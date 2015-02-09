var url = require('url');
var fs = require('fs');
var path = require('path');
var CONFIG = require('./config').CONFIG;

/**********************************************************************************
	File: messages.js

	Message calls take the following form:

	> <app>/<service>/[...objects]/<method>

	This file is the router for socket.io messages. To find the service, the router looks for a directory named sockets
	in the application directory, and within that directory tries to load <sockets>.js. Each service must export the function
	getSocketService that will return an object that represents the socket service. The router will then attempt to drill down into
	this service object to find the objects specified. for instance, if your service was named account, and you had an object named
	'settings' and a method named 'set', it would look for the presence of 'settings' within the service object.

	The last part of the route is assumed to be the method name. The router will verify that this is a function, and then call
	it, passing the request, the response and the post data.

	Params:
		app        - The name of the application that implemented the service
		service    - The name of the service being called
		objects    - a nested list of objects, for example, "building.resouces"
		method     - the specific service method being called

	Example:
		> horizon/timer/new

**********************************************************************************/

var SocketRouter = new Class({
	initialize : function()
	{
		this.validatedPaths = [];
		this.services = $H({});
		this.resolved = $H({});
	},

	listen : function(port)
	{
		this.io = require('socket.io').listen(parseInt(port));
		this.io.set('log level', 0);

		this.io.sockets.on('connection', this.onConnection.bind(this));
	},

	findApp : function(root, paths, callback)
	{
		var path = paths.shift();

		fs.readdir(root, function(err, dirs)
		{
			if (dirs && dirs.indexOf(path) != -1)
			{
				root = root + '/' + path;
				if (paths.length != 0)
				{
					findApp(root, paths, callback);
				}
				else
				{
					callback(true);
				}
			}
			else
			{
				callback(false);
			}
		});
	},

	getAppPath : function(paths, callback)
	{
		var appPath = '';

		appPath = paths.join('/');

		if (this.validatedPaths.indexOf(appPath) != -1)
		{
			req.appPath = appPath;
			return next();
		}
		else
		{
			findApp(CONFIG.basePath + '/apps', paths, function(found)
			{
				if (!found)
				{
					callback(null)
				}
				else
				{
					this.validatedPaths.push(appPath);
					callback(appPath)
				}
			}.bind(this));
		}
	},

	getService : function(servicePath, callback)
	{
		if (!this.services.has(servicePath))
		{
			fs.exists(servicePath, function(exists)
			{
				if (!exists) callback(null);
				else
				{
					var service = require(servicePath);
					this.services.set(servicePath, service);
					callback(this.services.get(servicePath));
				}
			}.bind(this));
		}
		else
			callback(this.services.get(servicePath));
	},


	callSocketService : function(socket, message, data, callback)
	{
		var paths = message.split('/');

  		console.log(process.pid, new Date(), message);

		var app = paths[0];
		var service = paths[1];

		var serviceFile = path.normalize(CONFIG.basePath + '/apps/' + app + '/messages/' + service + '.js');

		if (this.resolved[serviceFile] == undefined)
		{
			serviceFile = fs.realpathSync(serviceFile);
			this.resolved[serviceFile] = serviceFile;
		}

		servicePath = this.resolved[serviceFile];

		path.exists(servicePath, function(exists)
		{
			if (!exists)
			{
				if (callback) callback({success: false, error: 'service not found'});
				return;
			}

			var service = require(servicePath);
			var obj = service;

			for (var idx = 2; idx < paths.length - 1; idx++)
			{
				if (!(paths[idx] in obj))
				{
					if (callback) callback({success: false, error: 'service not found'});
					return;
				}

				obj = obj[paths[idx]];
			}

			if (!(paths[paths.length - 1] in obj) || (typeof(obj[paths[paths.length - 1]]) !== 'function'))
			{
				if (callback) callback({success: false, error: 'service not found'});
				return;
			}

			obj[paths[paths.length - 1]](socket, data, callback);
		});
	},

	onConnection : function(socket)
	{
		socket.on('message', this.onMessage.bind(this, socket));
	},

	onMessage : function(socket, message, data, callback)
	{
   		this.callSocketService(socket, message, data, callback)
	}
});

var router = new SocketRouter();

exports.listen = router.listen.bind(router);

