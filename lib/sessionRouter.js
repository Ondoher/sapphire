var events = require('events');
var uuid = require('node-uuid');
var mootools = require('./mootools').apply(GLOBAL);
var Cookies = require('cookies');
var crypto = require('crypto');
var CONFIG = require('config').CONFIG;

var storeName = CONFIG.sessionStore?CONFIG.sessionStore:'memcachedStore';
var store = require(storeName);

var SessionRouter = new Class(
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

		res.on('finish', this.onResponseDone.bind(this));
		this.store = store(req, res, this.sessionId);
	},

	setSessionId : function()
	{
		this.res.cookies.set('sessionId', this.store.getSessionId(), {httpOnly: false, overwrite: true});
		this.res.setHeader('X-Sapphire-Session', this.store.getSessionId());
	},

	get : function()
	{
		return this.store.get();
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
	},

	onResponseDone : function()
	{
//		this.store.save();
	}
});

SessionRouter.implement(events.EventEmitter.prototype);


var SessionWrapper = new Class({
	initialize: function(data, router)
	{
		this.data = data;
		this.router = router;
	},

	get : function()
	{
		return this.data;
	},

	set : function(name, value)
	{
		this.router.set(name, value);
	},

	save : function()
	{
		return this.router.save();
	}

});

module.exports = function()
{
	return function(req, res, next)
	{
		if (req.url.indexOf('assets') != -1) return next();
		var router = new SessionRouter(req, res);
		router.get()
			.then(function(session)
			{
				req.session = new SessionWrapper(session, router);
				next();
			});
	}
}