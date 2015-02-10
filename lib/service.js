var url = require('url');
var fs = require('fs');
var path = require('path');
var qs = require('querystring');
var Q = require('q');

module.exports.Service = new Class({
	addCSRFException : function(url)
	{
		if (this.csrfExceptions === undefined || typeOf(this.csrfExceptions) != 'array') this.csrfExceptions = [];
		this.csrfExceptions.push(url);
	},

	export : function(which, module)
	{
		module.exports[which] = this.callFunction.bind(this, which);
	},

	csrfCheck : function(req, res)
	{
		var url = req.url;
		var cookieCsrf = req.cookies.get('sapphire-csrf');
		var submitCsrf = req.body.csrfCode;

		if (this.csrfExceptions)
		{
			for (var idx = 0, l = this.csrfExceptions.length; idx < l; idx++)
			{
				if (url.indexOf(this.csrfExceptions[idx]) != -1) return true;
			}
		}

		if (cookieCsrf != submitCsrf) return {success: false, error: 'csrf fail'}
		return true;
	},

	callFunction : function(which, req, res)
	{
		var good = this.csrfCheck(req, res);
		good = (good === true) && this.verify(req, res);

		if (good !== true) return Q(good);
		return this[which].call(this, req, res);
	}
});
