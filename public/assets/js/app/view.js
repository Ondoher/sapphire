
Package('Sapphire', {
	View : new Class({
		Extends : Sapphire.Eventer,

		swallowEventAndFire : function(which)
		{
		    var args = Array.prototype.slice.call(arguments, 1);
			args.each(function(arg)
			{
			// see if this is a jquery event
				if (arg !== undefined && arg.preventDefault)
					arg.preventDefault();
			}, this);

			this.fireArgs(which, args);
		}
	})
});
