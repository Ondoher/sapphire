/**********************************************************************************
	File: timer.js

	Implements a job queue for single interval timer for an application. Multiple
	timers can effect application performance.
**********************************************************************************/

/**********************************************************************************
	Constant: TIMER_RESOLUTION

	specifies the number of milliseconds for the a timer tick. Currently set to 50, which
	is 20 times per second.
*/

var TIMER_RESOLUTION = 50; // 20 times per second

Timer = new Class({


/**********************************************************************************
	Constructor: initialize

	sets up the initial timer, and empties the job queue
*/
	initialize : function()
	{
		setInterval(this.onTick.bind(this), TIMER_RESOLUTION);
		this.timers = [];
	},

/**********************************************************************************
	Method: addTimer

	call this function to add a new job to the timer queue.

	Parameters:
		interval    	  - the number of milliseconds between ticks. The timer will
							call your function when the elapsed times between it's ticks is
							greater than or equal to this value.
		duration    	  - the number of milliseconds for the timer to run. Set to -1 to
							have no expiration
		callback    	  - the function the timer will call on each tick. At any time this function can
							return 'cancel' to kill the timer.
		killCallback      - the function the timer will call when the job has been canceled or has expired

	Returns:
		a unique ID that can be passed to <killTimer> to remove the job from the queue
*/
	addTimer : function(interval, duration, callback, killCallback)
	{
		var now = new Date().getTime();
		var nextFire = now + interval;
		var kill;
		var id = now;

		if (duration == -1)
			kill = duration;
		else
			kill = now + duration;

		this.timers.push({id: id, nextFire: nextFire, interval: interval, kill: kill, callback: callback, killCallback: killCallback});

		return id;
	},

/**********************************************************************************

	Function: killTimer:

	Call this function to remove a job from the queue.

	Parameters:
		id       - the unique id returned from <addTimer>.
*/
	killTimer : function(id)
	{
		for (var idx = 0; idx < this.timers.length; idx++)
			if (this.timers[idx].id == id)
			{
				if (this.timers[idx].killCallback) this.timers[idx].killCallback('forced');
				this.timers.splice(idx, 1);
				return;
			}
	},

/**********************************************************************************
	Function: fireTimer

	Called by the timer object to run a specific job

	Parameters:
		id     - an internal reference to the job
*/
	fireTimer : function(which)
	{
		var now = new Date().getTime();
		var nextFire = now + this.timers[which].interval;
		this.timers[which].nextFire = nextFire;

	// return 'kill' to immediately kill the timer
		var result = this.timers[which].callback();
		if (result == 'cancel')
			this.timers[which].kill = -2;
	},

/**********************************************************************************
	Function: clearDeadTimers

	Called by the timer object to removed canceled and expired timers from the queue
*/
	clearDeadTimers : function()
	{
		var now = new Date().getTime();
		for (var idx = this.timers.length - 1; idx >= 0; idx--)
			if (this.timers[idx].kill != -1 && this.timers[idx].kill <= now)
			{
				if (this.timers[idx].killCallback) this.timers[idx].killCallback((this.timers[idx].kill == -2)?'canceled':'expired');

				this.timers.splice(idx, 1);
			}
	},

/**********************************************************************************
	Function: onTick

	The interval function called by JavaScript. Does the heavy lifting of the timer object
*/
	onTick : function()
	{
		if (this.timers.length == 0) return;
		var now = new Date().getTime();
		for (var idx = 0; idx < this.timers.length; idx++)
			if (this.timers[idx].nextFire <= now) this.fireTimer(idx);

		this.clearDeadTimers();
	}
});


/**********************************************************************************
	VARIABLE: TIMER

	The global timer instance. The application should not create new tiemr object,
	but instead reference this instance.
*/

TIMER = new Timer();
