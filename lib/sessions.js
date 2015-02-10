var events = require('events');
var uuid = require('node-uuid');
var crypto = require('crypto');

var storeName = CONFIG.sessionStore?CONFIG.sessionStore:'./memcachedStore';
var store = require(storeName);

var Session = new Class(
{
	initialize : function(req, res)
	{
		this.sessionId = req.cookies.get('sessionId');

	// if it is not in the cookies, try the headers
		if (!this.sessionId)
		{
			if (req.headers['x-sapphire-session'] !== undefined)
				this.sessionId = req.headers['x-sapphire-session'];
		}

		this.req = req;
		this.res = res;
		this.cookieSent = false;

		this.store = store(req, res, this.sessionId);
	},

	setSessionId : function()
	{
		this.res.cookies.set('sessionId', this.store.getSessionId(), {httpOnly: false, overwrite: true});
		this.res.setHeader('X-Sapphire-Session', this.store.getSessionId());
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
