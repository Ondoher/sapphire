var mootools = require('./mootools').apply(GLOBAL);
var path = require('path');

var config = require('./config');
global.CONFIG = config.CONFIG;
global.logger = CONFIG.logger?require(CONFIG.logger):require('./consoleLogger');

CONFIG.sapphireRoot = path.dirname(module.filename);
logger.configNode();

if (!CONFIG.mangler)
{
	var Mangler = require('./mangler').Mangler;
	CONFIG.mangler = Mangler;
}

var Q = require('q');
var http = require('http');
var https = require('https');
var express = require('express');
var Cookies = require( 'cookies' )
var compression = require('compression');
var bodyParser = require('body-parser');
var cors = require('cors');
var urls = require('./urls');
var deliverCss = require('./deliverCss');
var staticRouter = require('./staticRouter');
var sessions = require('./sessions');
var appPath = require('./appPath');
var appRouter = require('./appRouter');
var serviceRouter = require('./serviceRouter');
var notFound = require('./notFound');
var dialogs = require('./features/dialogs/dialogs.js');
var animator = require('./features/animator/animator.js');
var site = require('./features/site/site.js');

module.exports.createServer = function()
{
	var app = express();
	var useCompression = CONFIG.useCompression===true?true:false;
	var useCors = CONFIG.cors!==undefined?true:false;

	if (useCompression) app.use(compression({threshold: 5000 }))
	if (useCors)
	{
		app.use(cors(CONFIG.cors));
		app.options('*', cors(CONFIG.cors));
	}

	app
		.use(logger.middleware())
		.use(Cookies.express())
		.use(bodyParser.urlencoded({extended: false}))
		.use(bodyParser.json())
		.use(urls())
		.use(deliverCss())
		.use(staticRouter())
		.use(appPath())
		.use(sessions())

// Add app-specific middleware if it exists
	if (CONFIG.middleware)
	{
		var middleware = require(CONFIG.basePath + '/' + CONFIG.middleware);
		middleware.createMiddleware(app);
	}

	app
		.use(serviceRouter())
		.use(appRouter())
		.use(notFound())

	var server;

	if (CONFIG.https !== undefined)
		server = https.createServer(CONFIG.https, app);
	else
		server = http.createServer(app);

	return server;
}

module.exports.Application = require('./application').Application;
module.exports.Service = require('./service').Service;
module.exports.Feature = require('./feature').Feature;
module.exports.features = {
	animator: animator,
	dialogs: dialogs,
	site: site,
}

module.exports.socketRouter = function()
{
	var socketRouter = require('./socketRouter');
	return socketRouter;
}

module.exports.CONFIG = CONFIG;
module.exports.appConfig = config.appConfig;
