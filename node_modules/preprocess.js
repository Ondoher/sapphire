var path = require('path');
var CONFIG = require('config').CONFIG;
var url = require('url');
var fs = require('fs');
var Q = require('q');
var paths = require('routePaths');
var CssMangler = require('cssMangler').CssMangler;
var mangler = new CONFIG.mangler();

function processCSS (req, res, next)
{
	var cssMangler = new CssMangler(req, res, next);

	cssMangler.process();
}

module.exports = function()
{
	return function(req, res, next)
	{
		var hash = req.url.match(/-h([a-f0-9]{32})\./);

		if (hash)
		{
			req.hash = hash[1];
			req.url = req.url.replace(/-h([a-f0-9]{32})\./, '.');
		}
		req.url = mangler.demangle(req.url);
		var url = req.url.split('?')[0];
		var ext = path.extname(url);
//		return next();
		if (url.indexOf('/assets/') != -1 && ext == '.css')	processCSS(req, res, next)
		else next();
	}
}
