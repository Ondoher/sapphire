var events = require('events');
var mootools = require('./mootools').apply(GLOBAL);
var Cookies = require('cookies');
var CONFIG = require('config').CONFIG;

exports.Session = new Class(
{
	initialize : function(sessionId)
	{
		this.store = store(sessionId);
	},

	get : function()
	{
		return this.store.get();
	},

	set : function(name, value)
	{
		this.store.set(name, value);
	},

	save : function()
	{
		return this.store.save();
	},

	getSessionId : function()
	{
		return this.store.getSessionId();
	}
});

exports.Session.implement(events.EventEmitter.prototype);

