
var mootools = require('./mootools').apply(GLOBAL);
var CONFIG = require('./config').CONFIG;
var http = require('http');
var Cookies = require('cookies');
var sessions = require('./sessions');
var sessionRouter = require('./sessionRouter');
var connect = require('connect');
var notFound = require('./notFound');
var staticRouter = require('./staticRouter');
var sessions = require('./sessions');
var preprocess = require('./preprocess');
var appPath = require('./appPath');
var appRouter = require('./appRouter');
var serviceRouter = require('./serviceRouter');
//var socketRouter = require('socketRouter');
//var errorHandler = require('errorHandler');
var Q = require("q");
var compression = require('compression');

module.exports.createServer = function()
{
	var app = connect();
	var useCompression = CONFIG.useCompression===true?true:false;

	if (useCompression) app.use(compression({threshold: 5000 }))

	app
		.use(logger.middleware())
		.use(Cookies.connect())
		.use(connect.query())
		.use(connect.bodyParser())
		.use(sessionRouter())
		.use(preprocess())

// Add app-specific middleware if it exists
	if (CONFIG.middleware)
	{
		var middleware = require(CONFIG.basePath + CONFIG.middleware);
		middleware.createMiddleware(app);
	}

	return http.createServer(app
		.use(appPath())
		.use(staticRouter())
		.use(serviceRouter())
		.use(appRouter())
		.use(notFound())
	);
}

module.exports.Application = require('./application').Application;
module.exports.Service = require('./service').Service;
module.exports.Feature = require('./feature').Feature;
module.exports.logger = require('./consoleLogger');
module.exports.CONFIG = CONFIG;
