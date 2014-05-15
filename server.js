/*
File: server.js

This is the main sapphire server file. It will handle all of the routing
for the application. This will be broken into a separate sapphire object
in the near future
*/
var domain = require('domain');
var cluster = require('cluster');
var CONFIG = require('config').CONFIG;

var processes = CONFIG.processes != undefined ? CONFIG.processes : 4;
global.logger = CONFIG.logger?require(CONFIG.logger):require('consoleLogger');

logger.configNode();
logger.open(processes);
logger.info("Initialized configs and logconfigs, starting the node.js server, worker count: " + processes);

process.on('exit', function()
{
	logger.info('pid', process.pid, 'master', cluster.isMaster, 'exiting...');
});

function masterSetup()
{

    var workers = $H({});
    var baseSocketPort = CONFIG.baseSocketPort;
    logger.info("Setting up the Master and forking workers : " + processes);

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
    logger.info("Setting up the Worker: pid: " + process.pid);

    var http = require('http');
    var Cookies = require('cookies');
    var sessions = require('sessions');
    var sessionRouter = require('sessionRouter');
    var connect = require('connect');
    var notFound = require('notFound');
    var staticRouter = require('staticRouter');
    var sessions = require('sessions');
    var appPath = require('appPath');
    var appRouter = require('appRouter');
    var serviceRouter = require('serviceRouter');
    var socketRouter = require('socketRouter');
    var errorHandler = require('errorHandler');
    var Q = require("q");

// !NOTE: make this configurable, so that it can be turned off in prod
    Q.longStackSupport = true;

    var listenPort = CONFIG.port?CONFIG.port:8088;
    var socketPort = process.env.socketPort;

    var server;

    process.on('uncaughtException', function(err)
	{
        logger.error('Worker Exception: \n' + err.stack);

        var killTimer = setTimeout(function()
        {
            process.exit(1);
        }, 10000);

        server.close();
        cluster.worker.disconnect();
    });

    server = http.createServer(connect()
    	.use(logger.middleware())
    	.use(Cookies.connect())
    	.use(connect.query())
    	.use(connect.bodyParser())
    	.use(sessionRouter())
    	.use(appPath())
    	.use(staticRouter())
    	.use(serviceRouter())
    	.use(appRouter())
    ).listen(listenPort);

    server.listen(listenPort);
//    console.info(process.pid, 'Server running at http://127.0.0.1:' + listenPort + '/');
    logger.info(process.pid + ' Server running at http://127.0.0.1:' + listenPort + '/');

    if (CONFIG.baseSocketPort)
    {
        io = require('socket.io').listen(server);
        io.set('log level', 0);
        socketRouter.listen(socketPort);
        logger.info(process.pid +  'Socket server running at http://127.0.0.1:' + socketPort);
    }
}

if (processes == 0)
{
	workerSetup();
}
else
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


