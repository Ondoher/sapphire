var mootools = require('./mootools').apply(GLOBAL);
var static = require('node-static');
var url = require('url');
var path = require('path');

var publicRoot = path.normalize(CONFIG.sapphireRoot + '/../public/');

var server = new static.Server(publicRoot);
var appServer = new static.Server(CONFIG.basePath + '/apps/');

module.exports = function()
{
	return function(req, res, next)
	{
		var paths = url.parse(req.url, true).pathname.split('/');
		paths.shift();
		if (paths[0] == 'assets')
		{
			server.serve(req, res).on('error', function(e)
			{
				req.error = true;
		res.statusCode = 404;
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.write("<h1>404 Not Found</h1>");
		res.end("The page you were looking for: "+ req.url + " can not be found");
			});
		}
		else if (paths.indexOf('assets') != -1)
		{
			var filepath = paths.join('/');
			try
			{
				appServer.serveFile(filepath, 200, {}, req, res).on('error', function(e)
				{
					req.error = true;
		res.statusCode = 404;
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.write("<h1>404 Not Found</h1>");
		res.end("The page you were looking for: "+ req.url + " can not be found");
				});
			}
			catch (e) {
				console.log(e);
				console.log(e.stack);
				req.error = true;
				next();
			}
		}
		else next();
	}
}
