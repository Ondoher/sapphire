var domain = require('domain');
/**********************************************************************************
	File: service.js

	Service calls take the following form:

	> <app>/services/<service>/[...objects]/<method>

	This file is the router for services. To find the service, the service router looks for a directory named services
	in the application directory, and within that directory tries to load <service>.js. Each service must export a function
	or object that corresponds to the first part of the service path. The router will then attempt to drill down into
	this service object to find the objects specified. for instance, if your service was named account, and you had an object named
	'settings' and a method named 'set', it would look for the presence of 'settings' within the service object.

	The last part of the route is assumed to be the method name. The router will verify that this is a function, and then call
	it, passing the request, the response and the post data.

	Params:
		app        - The name of the application that implemented the service
		service    - The name of the service being called
		objects    - a nested list of objects, for example, "building.resouces"
		method     - the specific servicemethod being called

	Examples:
		> /xp/services/system/health

**********************************************************************************/
var mootools = require('./mootools').apply(GLOBAL);
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var url = require('url');
var CONFIG = require('./config').CONFIG;
var Q = require('q');

var services = $H({});
var resolved = $H({});

function getService(servicePath, callback)
{
	if (!services.has(servicePath))
	{
		fs.exists(servicePath, function(exists)
		{
			if (!exists) callback(null);
			else
			{
				var service = require(servicePath);
				services.set(servicePath, service);
				callback(services.get(servicePath));
			}
		}.bind(this));
	}
	else
		callback(services.get(servicePath));
}


function runService(service, req, res)
{
	return service(req, res)
}

function response(req, res, result)
{
	if (!res.headersSent)
	{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
	}
	if (!result)return;
	if (result.raw)
		res.end(result.raw);
	else
	{
		res.end(JSON.stringify(result));
	}
}

function error(req, res, error)
{
	if (!res.headersSent)
	{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
	}

	res.end(JSON.stringify({success: false, result: error.stack}));

	throw error;
}

module.exports = function()
{
	return function(req, res, next)
	{
		if (req.error) return next();
		var paths = url.parse(req.url, true).pathname.split('/');

		if (paths.indexOf('services') != -1)
		{
			var appPath = paths[1];
			var servicesIndex = paths.indexOf('services');
			var servicePaths = paths.slice(servicesIndex);
			var serviceName = servicePaths.shift();
			serviceName = servicePaths[0];

			if (servicePaths.length == 0 )
			{
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({success: false, error: 'service not found'}));
				next();
			}
			try
			{
				var serviceFile = path.normalize(CONFIG.basePath + '/apps/' + appPath + '/services/' + serviceName + '.js');

				if (resolved[serviceFile] == undefined)
				{
					serviceFile = fs.realpathSync(serviceFile);
					resolved[serviceFile] = serviceFile;
				}
				else
				{
					resolved[serviceFile] = serviceFile;
				}
			}
			catch (e)
			{
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({success: false, error: 'service not found'}));
				return;
			}

			getService(serviceFile, function(service)
			{
				if (service == null)
				{
					res.end(JSON.stringify({success: false, error: 'service not found'}));
					return;
				}

				var obj = service;
				var found = 0;
				var lastObject;

				for (var idx = 4; idx < paths.length; idx++)
				{
					if (!(paths[idx] in obj))
					{
						found = idx - 1;
						break;
					}

					found = idx;
					lastObject = obj;
					obj = obj[paths[idx]];
				}

				req.extraPath = paths.slice(idx);

				obj = lastObject;

				if (!obj || !(paths[found] in obj) || (typeof(obj[paths[found]]) !== 'function'))
				{
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({success: false, error: 'service not found'}));
					return;
				}

				if (CONFIG.qsToBody)
				{
					req.body = Object.merge(req.body, req.query);
				}

				runService(obj[paths[found]].bind(obj), req, res)
					.then(response.bind(this, req, res))
					.fail(error.bind(this, req, res))
					.done();
			});
		}
		else next();
	}
}
