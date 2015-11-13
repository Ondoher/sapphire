/*
Middleware: appPath

Finds the path to the application based on the url path. The appPath is saved
in req.appPath. Url paths look like this

/<app>/<subapp>				- application root
/<app>/<subapp>/services	- base services directory
/<app>/<subapp>/assets		- base assets directory
*/
var Q = require('q');
var fs = require('fs');
var path = require('path');
var url = require('url');
var appPaths = [];

function getDir(path)
{
	var deferred = Q.defer();

	fs.readdir(path, function(err, files)
	{
		if (err) deferred.reject(err);
		else deferred.resolve(files);
	});

	return deferred.promise;
}

function isApp(path)
{
	if (!fs.existsSync(path)) return false;
	try
	{
		var module = require(path);
		if (module.getApplication)
		{
			return true;
		}
		return false;
	}
	catch(err)
	{
		console.log(err);
		console.log(err.stack);
		return false;
	}
}

function isDirectory(path)
{
	var deferred = Q.defer();

	fs.stat(path, function(err, stats)
	{
		deferred.resolve({path: path, directory: stats.isDirectory()});
	});

	return deferred.promise;
}

function addApplication(path, name) {
	appPaths.push(path);
	var paths = path.split('/');
	var appsIndex = paths.indexOf('apps');
	paths.splice(0, appsIndex + 1);

	var root = CONFIG;
	paths.each(function(name) {
		root[name] = root[name] || {};
		root = root[name];
	});

	try
	{
		var appConfig = require(path + '/' + 'sapphire-config/config.js');
		Object.merge(root, appConfig);
	} catch (e) {}

}

function checkApp(path)
{
	var deferred = Q.defer();

	fs.stat(path, function(err, stats)
	{
		if (err) return deferred.reject(err);
		if (!stats.isDirectory()) return deferred.resolve(false);

		var parts = path.split('/');
		var name = parts[parts.length - 1];
		var file = path + '/' + name + '.js';

		if (isApp(file)) addApplication (path, name);

		deferred.resolve(true);
	});

	return deferred.promise;
}

function findApplications(root)
{
	root = (root === undefined)?CONFIG.basePath + '/apps':root;

	return getDir(root)
		.then(function(files)
		{
			var promises = [];

			files.each(function(file)
			{
				if (file.charAt(0) == '.') return;
				if (file == 'assets') return;
				if (file == 'service') return;
				if (file == 'node_modules') return;
				promises.push(checkApp(root + '/' + file));
			});

			return Q.all(promises)
				.then(function(result)
				{
					var promises = [];

					files.each(function(file)
					{
						if (file.charAt(0) == '.') return;
						if (file == 'assets') return;
						if (file == 'service') return;
						if (file == 'node_modules') return;
						promises.push(isDirectory(root + '/' + file))
					});

					return Q.all(promises)
						.then(function(result)
						{
							promises = [];

							result.each(function(one)
							{
								if (one.directory) promises.push(findApplications(one.path));
							});

							return Q.all(promises);
						})
				});
	});
}


function getFullPath(req, appPath, realPath)
{
	var url = req.url;
	url = url.split('.')[0];
	var remove = 0;
	var fullPath = url;
	if (!appPath) return appPath;
	if (!realPath) return appPath;

	if (url.indexOf(realPath) == 0) fullPath = fullPath.slice(realPath.length)
	else if (url.indexOf(appPath) == 0) fullPath = fullPath.slice(appPath.length);

	fullPath = appPath + '/' + fullPath;
	return fullPath;
}

function getRealPath(req, appPath)
{
	var url = req.url;
	url = url.split('.')[0];
	var defaultApp = CONFIG.defaultApp?'/' + CONFIG.defaultApp:undefined;
	var realPath = appPath;
	if (!defaultApp) return appPath;
	if (!appPath) return appPath;
	if (url.indexOf(defaultApp) == 0) return appPath;
	realPath = appPath.slice(defaultApp.length);
	if (realPath.charAt(0) != '/') realPath = '/' + realPath;
	return realPath;
}

function matchAppPath(url)
{
	var which = '';

	for (var idx = 0, l = appPaths.length; idx < l; idx++)
	{
		var appPath = appPaths[idx];
		if (url.indexOf(appPath) == 0)
		{
			which = appPath;
			break;
		}
	}

	return which;
}

function stripTrailingSlash(str)
{
	if(str.substr(-1) == '/')
	{
		return str.substr(0, str.length - 1);
	}
	return str;
}

function stripLeadingSlash(str)
{
	if(str.substr(0) == '/')
	{
		return str.substr(1, str.length);
	}
	return str;
}

function clean(reqUrl)
{
	var parsed = url.parse(reqUrl);
	return url.format(parsed);
}

module.exports = function()
{
	return function(req, res, next)
	{
		req.url = clean(req.url);
		var url = req.url;
		var defaultApp = CONFIG.defaultApp?'/' + CONFIG.defaultApp:undefined;
		var appPath = matchAppPath(url);

		if (appPath == '' && CONFIG.defaultApp) appPath = matchAppPath('/' + CONFIG.defaultApp + url);

		appPath = stripTrailingSlash(appPath);
		appPath = stripLeadingSlash(appPath);
		if (appPath != '')
		{
			req.appPath = appPath;
			req.realPath = getRealPath(req, appPath);
			req.fullPath = getFullPath(req, appPath, req.realPath);
			req.defaultApp = defaultApp;
		}

		next();
	}
}

findApplications()
	.then(function()
	{
		appPaths.each(function(path, idx)
		{
			var root = CONFIG.basePath + '/apps';
			var newPath = path.slice(root.length);
			appPaths[idx] = newPath;
		});
		appPaths.sort(function(a, b)
		{
			return b.length - a.length;
		});
	})
	.done();

