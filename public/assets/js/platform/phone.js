
var Platform = new Class({

	Extends : Spa.EventManager,

	initialize : function()
	{
		this.parent();
		var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var length = Math.floor(Math.random(5)) + 7;

		this.uniqueId = this.getCookie('unique_id');
		if (!this.uniqueId)
		{
			this.uniqueId = '';
			for (idx = 0; idx < length; idx++)
				this.uniqueId += chars.charAt(Math.floor(Math.random() * chars.length));
			this.setCookie('unique_id', this.uniqueId, 30);
		}

		navigator.geolocation.watchPosition(this.onChangePosition.bind(this), undefined, {enableHighAccuracy: true});
		this.location = new google.maps.LatLng(37.273361, -121.915825);

		window.scrollTo(0, 1);
	},

	getCookie : function(name)
	{
		var i,x,y,ARRcookies = document.cookie.split(";");
		for (i=0; i < ARRcookies.length; i++)
		{
			x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
			y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
			x = x.replace(/^\s+|\s+$/g,"");
			if (x == name)
			{
				return unescape(y);
			}
		}
	},

	setCookie : function(name,value,exdays)
	{
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var value = escape(value) + ((exdays==null)?'':"; expires=" + exdate.toUTCString());

		console.log('setCookie', name, value);
		document.cookie = name + "=" + value;
	},

	getUniqueId : function()
	{
		return this.uniqueId;
	},

	getLocation : function()
	{
		return this.location;
	},

	onChangePosition : function(position)
	{
		this.location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		this.fire('positionChange', this.location);
	}
});

var PLATFORM = new Platform();

