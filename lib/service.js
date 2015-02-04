var url = require('url');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var Q = require('q');

module.exports.Service = new Class({
	addXSSException : function(url)
	{
		if (this.xssExceptions === undefined || typeOf(this.xssExceptions) != 'array') this.xssExceptions = [];
		this.xssExceptions.push(url);
	},

	export : function(which, module)
	{
		module.exports[which] = this.callFunction.bind(this, which);
	},

	xssCheck : function(req, res)
	{
		var url = req.url;
		var cookieXSS = req.cookies.get('sapphire-xss');
		var submitXSS = req.body.xssCode;

		if (this.xssExceptions)
		{
			for (var idx = 0, l = this.xssExceptions.length; idx < l; idx++)
			{
				if (url.indexOf(this.xssExceptions[idx]) != -1) return true;
			}
		}

		if (cookieXSS != submitXSS) return {success: false, error: 'xss fail'}
		return true;
	},

	callFunction : function(which, req, res)
	{
		var good = this.xssCheck(req, res);
		good = (good === true) && this.verify(req, res);

		if (good !== true) return Q(good);
		return this[which].call(this, req, res);
	}
});