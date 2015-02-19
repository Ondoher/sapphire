var path = require('path');
var url = require('url');
var mangler = new CONFIG.mangler();

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

		next();
	}
}
