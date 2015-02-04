/*
Middleware: appPath

Finds the path to the application based on the url path. The appPath is saved
in req.appPath. Url paths look like this

/<app>/<subapp> 			- application root
/<app>/<subapp>/services	- base services directory
/<app>/<subapp>/assets  	- base assets directory
/<app>/<subapp>/pages		- base pages directory
/<app>/<subapp>/dialogs		- base dialogs directory
*/
var Q = require('q');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var url = require('url');
var CONFIG = require('config').CONFIG;

var validatedPaths = [];

function isApplication(root, path)
{
	var deferred = Q.defer();
	var paths = path.split('/');
	if (path.substr(-1) === '/') paths.pop();
	var top = paths.pop();
	if (root.substr(-1) !== '/') root += '/';
	if (path.substr(-1) !== '/') path += '/';
	if (path.substr(1, 1) !== '/') path = path.substr(1);
	var file = root + path + top + '.js';

	fs.exists(file, function(exists)
	{
		if (exists)
		{
			if (file.charAt(0) == '.')
				file = '../' + file;
			var module = require(file);
			if (module.getApplication)
			{
				deferred.resolve(true);
				return;
			}
			deferred.resolve(false);
		}
		else
			deferred.resolve(false);

	});

	return deferred.promise;
}

function findApp(root, path)
{
	var deferred = Q.defer();
	var paths = path.split('/');
	if (path.substr(-1) === '/') paths.pop();

	path = paths.join('/');


	if (validatedPaths[path])
	{
		deferred.resolve(validatedPaths[path]);
	}

	isApplication(root, path)
		.then(function(isApp)
		{
			if (isApp)
			{
				deferred.resolve(path);
				validatedPaths[path] = path;
			}
			else
			{
				var paths = path.split('/');
				if (path.substr(-1) === '/') paths.pop();
				paths.pop();
				if (paths.length == 0)
				{
					deferred.resolve(null);
					return;
				}

				path = paths.join('/');
				deferred.resolve(findApp(root, path));
			}

		});

	return deferred.promise;
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

	fullPath = appPath + fullPath;
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

module.exports = function()
{
	return function(req, res, next)
	{
		var root = CONFIG.basePath + 'apps/';
		var path = url.parse(req.url, true).pathname;
		path = path.split('.')[0];

		var serviceIdx = path.indexOf('/service');
		var assetsIdx = path.indexOf('/assets');

		if (serviceIdx != -1) path = path.slice(0, serviceIdx);
		if (assetsIdx != -1) path = path.slice(0, assetsIdx);

		findApp(root, path)
			.then(function(appPath)
			{
				var realPath = (appPath == null)?'/':appPath;
				if (appPath == null && CONFIG.defaultApp)
				{
					appPath = CONFIG.defaultApp;

					if (appPath.substr(0, 1) !== '/') appPath = '/' + appPath;

					return findApp(root, appPath + path)
						.then(function(appPath)
						{
							var realPath = (appPath == null)?'/':appPath;
							var defaultApp = CONFIG.defaultApp?'/' + CONFIG.defaultApp:undefined;

							req.appPath = appPath;
							req.realPath = getRealPath(req, appPath);
							req.fullPath = getFullPath(req, appPath, req.realPath);
							req.defaultApp = defaultApp;

							next();
						});
				}
				else
				{
					var defaultApp = CONFIG.defaultApp?'/' + CONFIG.defaultApp:undefined;
					req.appPath = appPath;
					req.realPath = getRealPath(req, appPath);
					req.fullPath = getFullPath(req, appPath, req.realPath);
					req.defaultApp = defaultApp;

					next();
				}
			});
	}
}