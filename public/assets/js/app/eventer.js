Package('Sapphire', {

/**********************************************************************************
	Class: Eventer

	Use this class to manage the listening and fireing of events. It can be used by either
	Extending it, or by making an instance of it within your own class.
*/
	Eventer : new Class({

	/**********************************************************************************
		Constructor: initialize

		If you extend this class, you must make sure to call this parent method
	*/
		initialize : function()
		{
			this.events = new Hash();
			this.eventId = 0;
		},

	/**********************************************************************************
		Method: listen

		Call this function to listen for an event.

		Parameters:
			name       - the name of the event
			callback   - the function to call when the event has been fired

		Returns:
			a unique ID that can be later used to unlisten for an event

	*/
		listen : function(name, callback)
		{
			var eventList = this.events.get(name);

			if (eventList == null)
			{
				eventList = new Hash();
				this.events.set(name, eventList);
			}

			var eventId = 'event_' + this.eventId;
			this.eventId++;
			eventList.set(eventId, callback);
			return eventId;
		},

	/**********************************************************************************
		Method: remove

		Call this function to remove your callback for an event

		Parameters:
			name       - the name of the event
			id         - the unique ID returned from listen

	*/
		remove : function(name, id)
		{
			var eventList = this.events.get(name);
			if (eventList == null) return;
			if (id === '')
				eventList.empty();
			else
				eventList.erase(id);
		},

	/**********************************************************************************
		Method: removeAll

		Call this function to remove all listeners for an event

		Parameters:
			name       - the name of the event

	*/
		removeAll : function(name)
		{
			this.events.set(name, new Hash());
		},

	/**********************************************************************************
		Method: getCount

		Call this function to get the number of listeners for a specific event

		Parameters:
			name       - the name of the event

	*/
		getEventCount : function(name)
		{
			var eventList = this.events.get(name);
			if (eventList == null) return 0;
			return eventList.getLength();
		},


	/**********************************************************************************
		Method: fire

		Call this function to fire an event. All event handlers will be called.

		Parameters:
			name       - the name of the event
			...        - any extra parameters will be passed to the event handlers

	*/
		fire : function(name)
		{
		    var passed = Array.prototype.slice.call(arguments, 1);
			var eventList = this.events.get(name);
			if (eventList == null) return;
			eventList.each(function (callback)
			{
				callback.apply(this, passed);
			}, this);
		},

	/**********************************************************************************
		Method: fireArgs

		Call this function to fire an event passing it extra paramters from an array.
		All event handlers will be called.

		Parameters:
			name       - the name of the event
			params    - an array of parameters to pass to the event handlers

	*/
		fireArgs : function(name, params)
		{
			var eventList = this.events.get(name);
			if (eventList == null) return;
			eventList.each(function (callback)
			{
				callback.apply(this, params);
			}, this);
		}
	})
});

window[SAPPHIRE.ns].events = new Sapphire.Eventer();
