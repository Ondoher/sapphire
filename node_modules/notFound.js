var mootools = require('./mootools').apply(GLOBAL);
var url = require('url');
var fs = require('fs');
var apps = $H({});

module.exports = function()
{
	return function(req, res, next)
	{
		res.statusCode = 404;
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.write("<h1>404 Not Found</h1>");
		res.end("The page you were looking for: "+ req.url + " can not be found");
	}
}

