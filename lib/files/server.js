/*
File: server.js

This is the main sapphire server file. It will handle all of the routing
for the application. This will be broken into a separate sapphire object
in the near future
*/
var domain = require('domain');
var cluster = require('cluster');
var Q = require('q');
var sapphire = require('sapphire-express');

//var CONFIG = sapphire.CONFIG;
if (!CONFIG.basePath) CONFIG.basePath = process.cwd();

var processes = CONFIG.processes != undefined ? CONFIG.processes : 4;
logger.open(processes);

process.on('exit', function()
{
	logger.info('pid', process.pid, 'master', cluster.isMaster, 'exiting...');
});

function masterSetup()
{
	var workers = $H({});
	var baseSocketPort = CONFIG.baseSocketPort;
	logger.info('Setting up the Master and forking', processes, 'workers');

	for (var idx = 0; idx < processes; idx++)
	{
		var worker = cluster.fork({socketPort: baseSocketPort + idx});
		workers.set(worker.id, {worker: worker, port: baseSocketPort + idx});
	}

	cluster.on('disconnect', function(worker)
	{
		logger.error('Worker died/disconnected');
		var workerItem = workers.get(worker.id);
		var port = workerItem.port;

		workers.erase(worker.id);
		worker = cluster.fork({socketPort: port});
		workers.set(worker.id, {worker: worker, port: port});
	});

	process.on('uncaughtException', function(err)
	{
		logger.error('Master Exception: \n' + err.stack);
	});
}

function workerSetup()
{
// !NOTE: make this configurable, so that it can be turned off in prod
	Q.longStackSupport = true;
//	Q.longStackSupport = false;

	var listenPort = CONFIG.port?CONFIG.port:8088;
	var socketPort = process.env.socketPort;

	process.on('uncaughtException', function(err)
	{
		logger.error('Worker Exception: \n' + err.stack);

		var killTimer = setTimeout(function()
		{
			process.exit(1);
		}, 10000);

		try	{server.close();} catch(err) {}
		cluster.worker.disconnect();
	});

	var server = sapphire.createServer();

	server.listen(listenPort);

	logger.info(process.pid + ' Server running at ', CONFIG.baseUrl);
}

function main()
{
	if (cluster.isMaster)
	{
		logger.configMaster();
		masterSetup();
	}
	else
	{
		logger.configWorker();
		workerSetup();
	}
}

main();
