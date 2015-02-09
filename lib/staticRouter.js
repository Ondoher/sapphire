var mootools = require('./mootools').apply(GLOBAL);
var static = require('node-static');
var url = require('url');
var path = require('path');

var publicRoot = path.normalize(CONFIG.sapphireRoot + '/../public/');
var file = new static.Server(publicRoot);
var appFiles = new static.Server(CONFIG.basePath + '/apps/');

console.log('==============================' + publicRoot);

module.exports = function()
{
	return function(req, res, next)
	{
		var paths = url.parse(req.url, true).pathname.split('/');
		paths.shift();
		if (paths[0] == 'assets')
		{
			console.log('))))))))))))))))serving public static file', req.url);
			file.serve(req, res);
			req.done = true;
		}
		else if (paths.indexOf('assets') != -1)
		{
			var filepath = paths.join('/');
			console.log('<<<<<<<<<<<<<<<<<serving static file', filepath);
			try
			{
				appFiles.serveFile(filepath, 200, {}, req, res).on('error', function(e)
				{
					console.log('err', e);
					req.error = true;
					next();
				});
			}
			catch (e) {
				console.log('err', e);
				req.error = true;
				next();
			}
			req.done = true;
		}
		else next();
	}
}
