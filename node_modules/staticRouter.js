var mootools = require('./mootools').apply(GLOBAL);
var static = require('node-static');
var url = require('url');
var path = require('path');
var CONFIG = require('config').CONFIG;
var thisDir = path.dirname(module.filename) + '/';

function unDos(filepath)
{
	filepath = path.resolve(filepath);

	if (filepath.indexOf(':') == 1)
	{
		filepath = filepath.slice(2);
	}

  	filepath = filepath.replace(/\\/g, '/');
	return filepath;
}

thisDir = unDos(thisDir);

var file = new(static.Server)(unDos(thisDir  + '/../public'));

module.exports = function()
{
	return function(req, res, next)
	{
		var paths = url.parse(req.url, true).pathname.split('/');
		paths.shift();
		if (paths[0] == 'assets')
		{
			file.serve(req, res);
			req.done = true;
		}
		else if (paths.indexOf('assets') != -1)
		{
			var filepath = path.normalize('../apps/' + paths.join('/'));
			try
			{
				file.serveFile(filepath, 200, {}, req, res).on('error', function(e)
				{
					req.error = true;
					next();
				});
			}
			catch (e) {
				req.error = true;
				next();
			}
			req.done = true;
		}
		else next();
	}
}
