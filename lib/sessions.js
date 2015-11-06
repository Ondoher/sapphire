var events = require('events');
var uuid = require('node-uuid');
var crypto = require('crypto');
var config = require('./config');

var Session = new Class(
{
	initialize : function(req, res)
	{
		this.appConfig = config.appConfig(req.appPath);
		this.prefix = this.appConfig.cookiePrefix?this.appConfig.cookiePrefix:'';
		this.cookieName = this.prefix + 'sessionId';
		this.headerName = 'X-Sapphire-Session' + this.prefix;
		this.storeName = this.appConfig.sessionStore?this.appConfig.sessionStore:'./cookieStore';
		var store = require(this.storeName);

		this.sessionId = req.cookies.get(this.cookieName);

	// if it is not in the cookies, try the headers
		if (!this.sessionId)
		{
			if (req.headers[this.headerName.toLowerCase()] !== undefined)
				this.sessionId = req.headers[this.headerName.toLowerCase()];
		}

		this.req = req;
		this.res = res;
		this.cookieSent = false;

		this.store = store(req, res, this.sessionId);
	},

	setSessionId : function()
	{
		var duration = this.appConfig.sessionExpire?this.appConfig.sessionExpire:(60 * 60 * 24);
		var path = this.appConfig.sessionPath?CONFIG.sessionPath:'';
		var expires = new Date(new Date().getTime() + (duration * 1000));

		this.res.cookies.set(this.cookieName, this.store.getSessionId(), {httpOnly: false, overwrite: true, expires: expires, path: path});
		this.res.setHeader(this.headerName, this.store.getSessionId());
	},

	load : function()
	{
		return this.store.load()
			.then(function(data)
			{
				this.data = data;
			}.bind(this));
	},

	get : function()
	{
		return this.data;
	},

	set : function(name, value)
	{
		this.store.set(name, value);

		if (!this.cookieSent) this.setSessionId();
		this.cookieSent = true;
	},

	save : function()
	{
		return this.store.save();
	}
});
Session.implement(events.EventEmitter.prototype);

module.exports = function()
{
	return function(req, res, next)
	{
		if (req.url.indexOf('assets') != -1) return next();
		var session = new Session(req, res);
		session.load()
			.then(function(data)
			{
				req.session = session;
				res.session = session;
				next();
			});
	}
}
