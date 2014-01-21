EASING =
{
	quadEaseIn : function(t, b, c, d)
	{
		return c * (t /= d) * t + b;
	},

	quadEaseOut: function(t, b, c, d)
	{
		return -c * (t /= d) * (t - 2) + b;
	},

	cubicEaseInOut : function(t, b, c, d)
	{
	  if ((t/=d/2) < 1) return c/2*t*t*t + b;
	  return c/2*((t-=2)*t*t + 2) + b;
	},

	linearEase: function(t, b, c, d)
	{
		return c * t / d + b;
	},

	quadEaseInOut: function(t, b, c, d)
	{
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t)*(t-2) - 1) + b;
	},

	expoEaseIn: function(t, b, c, d)
	{
		return (t == 0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},

	expoEaseOut: function(t, b, c, d)
	{
		return (t == d) ? b + c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},

	expoEaseInOut: function(t, b, c, d)
	{
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}
}

