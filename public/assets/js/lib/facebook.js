
var Facebook = new Class({

	initialize: function()
	{
		this.loggedIn = false;
		this.session = null;
		this.fid = '';
		this.auth = '';
		this.deviceType = -1;
		this.reference = "";
		this.loginParams = {};
		this.appUrl = {};
		this.me = {};

		this.events = new Eventer();
	},

	listen : function(rEvent, rFunction)
	{
		this.events.listen(rEvent, rFunction);
	},

	// This is called by the facebook platform or the facebook extension
	init : function(appKey, loggedIn, deviceType, reference, auth, me, session, appUrl)
	{
		this.loggedIn = loggedIn;
		this.appKey = appKey;
		this.session = session;
		this.loginParams = {deviceType: deviceType, reference: reference, auth: auth};
		this.auth = auth;
		this.me = me;
		this.appUrl = appUrl;
		this.fid = reference;
	},

	setup : function()
	{
		FB.getLoginStatus(function(result){});
	  	FB.Event.subscribe('auth.sessionChange', function(response)
		{
			//if (this.loggedIn) return;
			if (response.session)
			{
				var session = response.session;
				this.session = session;
				this.loggedIn = true;
				this.fid = session.uid;

			// setup the legacy variables
				APPLICATION.facebookLoggedIn = true;
				APPLICATION.session = this.session;
				APPLICATION.deviceID = 2;
				APPLICATION.deviceUserID = this.session.uid;

			// get me before firing logged in event
				FB.api('/me', function(response)
				{
					this.me = response;
					this.events.fire('onFacebookLoggedIn', this.session, this.me);
				}.bind(this));
			}
			else
			{
				this.loggedIn = false;
				this.session = {};
				this.fid = '';
				this.events.fire('onFacebookLoggedOut');

			// setup the legacy variables
				APPLICATION.facebookLoggedIn = false;
			}
	  	}.bind(this));

	//!Pending: this is a hack to fix a bug in facebook. it should be removed
		var origPostTarget = FB.Content.postTarget;
		FB.Content.postTarget = function(opts)
		{
		    opts.params = FB.JSON.flatten(opts.params);
		    origPostTarget(opts);

		};
	},

	appLoggedIn : function(auth)
	{
		this.auth = auth;
	},

	isLoggedIn : function()
	{
		return this.loggedIn;
	},

	getAppKey : function()
	{
		return this.appKey;
	},

	getAppUrl : function()
	{
		return this.appUrl;
	},

	getMe : function()
	{
		return this.me;
	},

	getLoginParams : function()
	{
		return this.loginParams;
	},

	getLoggedIn : function()
	{
		return this.loggedIn;
	},

	getFID : function()
	{
		return this.fid;
	},

	getAuth : function()
	{
		return this.auth;
	},

	getSession : function()
	{
		return this.session;
	}
});

FACEBOOK = new Facebook();

