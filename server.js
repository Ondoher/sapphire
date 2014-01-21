/*
File: server.js

This is the main sapphire server file. It will handle all of the routing
for the application. This will be broken into a separate sapphire object
in the near future
*/

var cluster = require('cluster');
var CONFIG = require('config').CONFIG;

process.on('exit', function() {
	console.info('pid', process.pid, 'master', cluster.isMaster, 'exiting...');
});

if (cluster.isMaster)
{
	var processes = CONFIG.processes ? CONFIG.processes : 4;

	for (var idx = 0; idx < processes; idx++)
		cluster.fork();

	cluster.on('disconnect', function(worker)
	{
		console.error('worker disconnected');
		cluster.fork();
	});

	process.on('uncaughtException', function(err) {
		console.error(err.stack);
	});

}
else
{
	var http = require('http');
	var redis = require('redis');
	var Cookies = require('cookies');
	var sessions = require('sessions');
	var connect = require('connect');
	var notFound = require('notFound');
	var staticRouter = require('staticRouter');
	var appPath = require('appPath');
	var appRouter = require('appRouter');
	var serviceRouter = require('serviceRouter');
	var errorHandler = require('errorHandler');

	var listenPort = CONFIG.port?CONFIG.port:8088;
	var client = redis.createClient();
	var server;

	process.on('uncaughtException', function(err) {
		console.error(err.stack);
		var killTimer = setTimeout(function()
		{
			process.exit(1);
		}, 10000);

		server.close();
		cluster.worker.disconnect();
	});

	server = http.createServer(connect()
		.use(errorHandler())
		.use(Cookies.connect())
		.use(connect.query())
		.use(connect.bodyParser())
		.use(sessions(client))
		.use(appPath())
		.use(staticRouter())
		.use(serviceRouter())
		.use(appRouter())
		.use(notFound())
	).listen(listenPort);


	server.listen(listenPort);
	console.info(process.pid, 'Server running at http://127.0.0.1:' + listenPort + '/');
}

