var events = require('events');
var CONFIG = require('./config').CONFIG;
var Q = require('q');
var redis = require('redis');
var uuid = require('node-uuid');
var crypto = require('crypto');

// use config to setup parameters
var redisClient = redis.createClient();

var Session = new Class(
{
	initialize : function(sessionId)
	{
		this.sessionId = sessionId;
		this.session = null;
		data = null;
	},

	load : function()
	{
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
		redisClient.get(this.sessionId, function(err, data)
		{
			if (data == null)
			{
				this.sessionId = uuid.v4();
				data = JSON.stringify({});
				this.session = {};
			}

			var md5sum = crypto.createHash('md5');
			md5sum.update(data);
			this.hash = md5sum.digest('hex');

			this.session = JSON.parse(data);

			redisClient.expire(this.sessionId, CONFIG.sessionExpire?CONFIG.sessionExpire:(60 * 60 * 24));

			deferred.resolve(this.session);
		}.bind(this));

		return deferred.promise;
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
		this.session = session;
		redisClient.set(this.sessionId, JSON.stringify(this.session));
		redisClient.expire(this.sessionId, CONFIG.sessionExpire?CONFIG.sessionExpire:(60 * 60 * 24));
	},

	save : function()
	{
		data = JSON.stringify(this.session);

		var md5sum = crypto.createHash('md5');
		md5sum.update(data);
		var hash = md5sum.digest('hex');

		if (hash != this.hash)
		{
			this.update(this.session);
		}
	}
});

Session.implement(events.EventEmitter.prototype);

module.exports = function(req, res, sessionId)
{
	return new Session(sessionId);
};

