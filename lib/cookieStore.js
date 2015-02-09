var events = require('events');
var CONFIG = require('./config').CONFIG;
var Q = require('q');
var memcached = require('memcached');
var uuid = require('node-uuid');
var crypto = require('crypto');
var encrypt = require('./sapphire-encrypt');
var Memcached = require('memcached');

var mcServer = CONFIG.mcServer?CONFIG.mcServer:'localhost:11211';
var mcOptions = CONFIG.mcOptions?CONFIG.mcOptions:{};

var memcached = new Memcached(mcServer, mcOptions);

var Session = new Class(
{
	initialize : function(res, sessionId)
	{
		this.res = res;
		this.sessionId = sessionId;
		this.session = null;
		data = null;
	},

	get : function()
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
		data = this.res.cookies.get('session-data');
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
		var duration = CONFIG.sessionExpire?CONFIG.sessionExpire:(60 * 60 * 24);
		this.session = session;
		var sessionJ = JSON.stringify(this.session);
		var expires = new Date(new Date().getTime() + (duration * 1000));

		var data = encrypt.encrypt(sessionJ);

		this.res.cookies.set('session-data', data, {httpOnly: true, expires: expires, overwrite: true});
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
	return new Session(res, sessionId);
};

