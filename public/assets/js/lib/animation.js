
var Animation = new Class({

	initialize : function()
	{
		this.animations = [];
		this.timer = undefined;
		this.id = 0;
	},

	animate: function(node, start, dest, duration, easing, callback)
	{
		if (this.animations.length === 0)
		{
			this.animations = [];
			this.timer = TIMER.addTimer(50, -1, this.tick.bind(this));
		}

		var start = $H(start);
		var dest = $H(dest);
		spec = $H({id: this.id, node: node, time: new Date().getTime(), start: start, dest: dest, duration: duration, easing: easing, callback: callback});
		this.animations.push(spec);
	},

	move: function(spec)
	{
		var elapsed = new Date().getTime() - spec.time;
		var duration = (elapsed > spec.duration)?spec.duration:elapsed;
		var styles = {};

		spec.dest.each(function(target, idx)
		{
			t = elapsed;
			b = spec.start[idx];
			c = spec.dest[idx] - b;
			d = spec.duration;

			if (elapsed >= spec.duration)
				styles[idx] = target + 'px';
			else
		 		styles[idx] = spec.easing(t, b, c, d) + 'px';
		}, this);

		spec.node.setStyles(styles);
		return (elapsed > spec.duration);
	},

	tick: function()
	{
		var remove = [];
		this.animations.each(function(spec, idx)
		{
			var done = this.move(spec);
			if (done) remove.push(idx);
		}, this);

		for (idx = remove.length - 1; idx >= 0; idx--)
		{
			spec = this.animations[remove[idx]];
			if (spec.callback) spec.callback();

			this.animations.splice(remove[idx], 1);
		}

		if (this.animations.length == 0)
		{
			TIMER.killTimer(this.timer);
			this.timer = undefined;
		}
	}
});

ANIMATION = new Animation();
