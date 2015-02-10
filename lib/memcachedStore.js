var events = require('events');
var CONFIG = require('./config').CONFIG;
var Q = require('q');
var memcached = require('memcached');
var uuid = require('node-uuid');
var crypto = require('crypto');
var Memcached = require('memcached');

var mcServer = CONFIG.mcServer?CONFIG.mcServer:'localhost:11211';
var mcOptions = CONFIG.mcOptions?CONFIG.mcOptions:{};

var memcached = new Memcached(mcServer, mcOptions);

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
		memcached.get(this.sessionId, function(err, data)
		{
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
		var deferred = Q.defer();
		var duration = CONFIG.sessionExpire?CONFIG.sessionExpire:(60 * 60 * 24);
		this.session = session;
		var sessionJ = JSON.stringify(this.session);
		memcached.set(this.sessionId, sessionJ, duration, function(err, data)
		{
			deferred.resolve(data);
			if (err)
			{
				deferred.reject(err);
			}
			else
				deferred.resolve(data);
		});
		return deferred.promise;
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
	return new Session(sessionId);
};

