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
	var workers = $H({});
	var processes = CONFIG.processes ? CONFIG.processes : 4;
	var baseSocketPort = CONFIG.baseSocketPort;

	for (var idx = 0; idx < processes; idx++)
	{
		var worker = cluster.fork({socketPort: baseSocketPort + idx});
		workers.set(worker.id, {worker: worker, port: baseSocketPort + idx});
	}

	cluster.on('disconnect', function(worker)
	{
		console.error('worker disconnected');

		var workerItem = workers.get(worker.id);
		var port = workerItem.port;

		workers.erase(worker.id);
		worker = cluster.fork({socketPort: port});
		workers.set(worker.id, {worker: worker, port: port});
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
	var sessionRouter = require('sessionRouter');
	var connect = require('connect');
	var notFound = require('notFound');
	var staticRouter = require('staticRouter');
	var sessions = require('sessions');
	var log = require('log');
	var appPath = require('appPath');
	var appRouter = require('appRouter');
	var serviceRouter = require('serviceRouter');
	var socketRouter = require('socketRouter');
	var errorHandler = require('errorHandler');

	var listenPort = CONFIG.port?CONFIG.port:8088;
	var socketPort = process.env.socketPort;

	var client = redis.createClient();
	var server;

	sessions.setDefaultRedisClient(client);
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
//		.use(errorHandler())
		.use(log())
		.use(Cookies.connect())
		.use(connect.query())
		.use(connect.bodyParser())
		.use(sessionRouter(client))
		.use(appPath())
		.use(staticRouter())
		.use(serviceRouter())
		.use(appRouter())
//		.use(notFound())
	).listen(listenPort);


	server.listen(listenPort);
	console.info(process.pid, 'Server running at http://127.0.0.1:' + listenPort + '/');

	if (CONFIG.baseSocketPort)
	{
		io = require('socket.io').listen(server);
		socketRouter.listen(socketPort);
		console.info(process.pid, 'Socket server running at http://127.0.0.1:' + socketPort);
	}
}

