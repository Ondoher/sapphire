var path = require('path');
var CONFIG = require('./config').CONFIG;
var url = require('url');
var fs = require('fs');
var Q = require('q');
var paths = require('./routePaths');

var processed = {};
var mangler = new CONFIG.mangler();

exports.CssMangler = new Class({
	initialize : function(req, res, next)
	{
		this.req = req;
		this.res = res;
		this.next = next;
		this.mangler = new CONFIG.mangler();
	},

	deliverCSS : function(content)
	{
		this.res.statusCode = 200;
		this.res.setHeader('Content-Type', 'text/css');

		this.res.end(content);
	},

	getFile: function(url)
	{
		var deferred = Q.defer();
		var filename = paths.urlPathToFilePath(url, true);

		fs.readFile(filename, function (err, data)
		{
			if (err) deferred.reject();
			else deferred.resolve(data.toString());
		});

		return deferred.promise;
	},

	getUrls : function(content)
	{
		var urls = [];
		var regex = /url\(['"]?(.*?)['"]?\)/gim;
		var url = regex.exec(content);
		while (url)
		{
			if (urls.indexOf(url[1]) == -1)
				urls.push(url[1]);
			var url = regex.exec(content);
		}

		return urls;
	},

	mangleUrls : function(content, urls)
	{
		return this.mangler.mangleUrls(urls)
			.then(function()
			{
				urls.each(function(url)
				{
					var mangled = mangler.mangle(url);
					content = content.split(url).join(mangled);
				}, this);

				return Q(content);
			}. bind(this))
	},

	processContent : function(content)
	{
		var urls = this.getUrls(content);
		return this.mangleUrls(content, urls);
	},

	process : function()
	{
		var req = this.req;
		var res = this.res;
		var next = this.next;

		if (processed[req.url] && CONFIG.builderCache) return this.deliverCSS(processed[req.url]);

		this.getFile(req.url.split('?')[0])
			.then(function(content)
			{
				if (content == null) next();
				return this.processContent(content)
					.then(function(content)
					{
						processed[req.url] = content;
						this.deliverCSS(content);
						return Q(true);
					}.bind(this))
					.fail(function(e)
					{
						console.log('error');
					}.bind(this))
					.done();
			}.bind(this))
			.fail(function()
			{
				this.res.statusCode = 404;
				this.res.setHeader('Content-Type', 'text/html');

				this.res.end('<h1>404 Not Found</h1>\n<p>The page you were looking for: ' + req.url + ' cannot be found');
			}.bind(this))
			.done();
	}
});
