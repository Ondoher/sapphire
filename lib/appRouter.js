/*
Middleware: appRouter

If the url points to an application, it will run that application.
*/
var mootools = require('./mootools').apply(GLOBAL);
var url = require('url');
var fs = require('fs');
var uuid = require('node-uuid');
var Q = require('q');
var CONFIG = require('./config').CONFIG;
var path = require('path');

var apps = $H({});
var jsCache = $H({});
var cssCache = $H({});

function getApp(root, path, callback)
{
	var file = path.split('/').pop();
	var file = root + path + '/' + file + '.js';
	if (apps.has(path))
	{
		return callback(apps[path], file);
	}
	else
	{
		fs.exists(file, function(exists)
		{
	  		if (exists)
			{
//				if (root.charAt(0) != '/') file = '../' + file;

				try
				{
					apps[path] = require(file);
				}
				catch (e)
				{
					console.log(e);
					console.log(e.stack);

				}
				return callback(apps[path], file);
			}
			else
				callback(null, '');
		});
	}
}

module.exports = function()
{
	return function(req, res, next)
	{
		if (req.error) return next();
		var appPath = req.appPath;
		var ext = path.extname(req.url);
		var javascript = ext == '.js';
		var css = ext == '.css';

		if (javascript) appPath.replace(/\.js/g, '');
		if (css) appPath.replace(/\.css/g, '');

		if (appPath == null) return next();

		getApp(CONFIG.basePath + '/apps/', appPath, function(app, appPath)
		{
			if (app)
			{
				if (javascript && req.hash && jsCache[req.hash])
				{
					var headers = {'Content-Type': 'text/javascript'};

					res.writeHead(200, headers);
					res.end(jsCache[req.hash]);

					return Q(null);
				}
				if (css && req.hash && cssCache[req.hash])
				{
					res.writeHead(200, {'Content-Type': 'text/css'});
					res.end(cssCache[req.hash]);

					return Q(null);
				}
				app.getApplication(req, res)
					.then(function(app)
					{
						if (javascript)
						{
							app.getJavaScript(function(content)
							{
								if (req.hash && CONFIG.builderCache)
									jsCache[req.hash] = content;

								res.writeHead(200, {'Content-Type': 'text/javascript'});
								res.end(content);
							});
						}
						else if (css)
						{
							app.getCss(function(content)
							{
								if (req.hash && CONFIG.builderCache)
									cssCache[req.hash] = content;

								res.writeHead(200, {'Content-Type': 'text/css'});
								res.end(content);
							});
						}
						else
						{
							app.getHTML(function(content)
							{
								res.cookies.set('sapphire-csrf', uuid.v4(), {httpOnly: false});
								res.writeHead(200, {'Content-Type': 'text/html'});
								res.end(content);
							});
						}
					})
					.done();
			}
			else next();
		});
	}
}
