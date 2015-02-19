var path = require('path');
var url = require('url');
var CssMangler = require('./cssMangler').CssMangler;
var mangler = new CONFIG.mangler();

function deliverCss (req, res, next)
{
	var cssMangler = new CssMangler(req, res, next);

	cssMangler.deliver();
}

module.exports = function()
{
	return function(req, res, next)
	{
		var url = req.url.split('?')[0];
		var ext = path.extname(url);

		if (url.indexOf('/assets/') != -1 && ext == '.css')	deliverCss(req, res, next)
		else next();
	}
}
