exports.open = function(workers)
{
}

exports.configNode = function()
{
}

exports.configMaster = function()
{
}

exports.configWorker = function()
{
}

exports.log = function()
{
//	console.log('log', arguments);
	console.log.apply(console, arguments);
}

exports.error = function()
{
//	console.log('error', arguments);
	console.error.apply(console, arguments);
}

exports.info = function()
{
//	console.log('info', arguments);
	console.info.apply(console, arguments);
}

exports.warning = function()
{
	console.warn.apply(console, arguments);
}

exports.debug = function()
{
	console.log.apply(console, arguments);
}

exports.middleware = function()
{
	return function(req, res, next)
	{
        console.log(process.pid, new Date(), req.url);
		next();
	}
}

