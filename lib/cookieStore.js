var events = require('events');
var Q = require('q');
var uuid = require('node-uuid');
var crypto = require('crypto');
var encrypt = require('./sapphire-encrypt');
var config = require('./config');

var Session = new Class(
{
	initialize : function(req, res, sessionId)
	{
		this.appConfig = config.appConfig(req.appPath);
		this.prefix = this.appConfig.cookiePrefix?this.appConfig.cookiePrefix:'';
		this.cookieName = this.prefix + 'session-data';
		this.res = res;
		this.sessionId = sessionId;
		this.session = null;
		data = null;
	},

	load : function()
	{
		var data;

		if (this.session) return Q(this.session);
		if (!this.sessionId)
		{
			this.sessionId = uuid.v4();
			data = JSON.stringify({});

			var md5sum = crypto.createHash('md5');
			md5sum.update(data);
			this.hash = md5sum.digest('hex');

			this.session = {};
			return Q(this.session);
		}

		var deferred = Q.defer();
		data = this.res.cookies.get(this.cookieName);
		if (data) data = encrypt.decrypt(data);
		if (!data)
		{
			this.sessionId = uuid.v4();
			data = JSON.stringify({});
			this.session = {};
		}

		var md5sum = crypto.createHash('md5');
		md5sum.update(data);
		this.hash = md5sum.digest('hex');

		this.session = JSON.parse(data);
		return Q(this.session);
	},

	getSessionId : function()
	{
		return this.sessionId;
	},

	set : function(name, value)
	{
		this.session[name] = value;
	},

	update : function(session)
	{
		var duration = this.appConfig.sessionExpire?this.appConfig.sessionExpire:(60 * 60 * 24);
		var path = this.appConfig.sessionPath?this.appConfig.sessionPath:'';
		this.session = session;
		var sessionJ = JSON.stringify(this.session);
		var expires = new Date(new Date().getTime() + (duration * 1000));

		var data = encrypt.encrypt(sessionJ);

		this.res.cookies.set(this.cookieName, data, {httpOnly: true, expires: expires, overwrite: true, path: path});
		return Q(sessionJ);
	},

	save : function()
	{
		data = JSON.stringify(this.session);


		var md5sum = crypto.createHash('md5');
		md5sum.update(data);
		var hash = md5sum.digest('hex');

		if (hash != this.hash)
		{
			this.hash = hash;
			return this.update(this.session);
		}
		else
		{
			return Q(true);
		}
	}
});

Session.implement(events.EventEmitter.prototype);

module.exports = function(req, res, sessionId)
{
	return new Session(req, res, sessionId);
};

