
Package('Spa', {
	Templates : new Class({
		Extends : Spa.EventManager,

		initialize : function()
		{
			SPA.application.listenPageEvent('load', '', this.onLoad.bind(this));
			SPA.application.listenDialogEvent('load', '', this.onLoad.bind(this));
			SPA.application.listen('start', this.onStart.bind(this));
			this.templates = $H({});
		},

		grab : function()
		{
			$('.template').each(function(which, element)
			{
				var selector = $(element);
				var id = selector.attr('id');
				selector.removeClass('template');
				this.templates[id] = selector.remove();
			}.bind(this));
		},

		get : function(which)
		{
			if (this.templates.has(which))
				return this.templates[which].clone(true, true);
			else
				return null;
		},

		onStart : function(callback)
		{
			this.grab();
			callback();
		},

		onLoad : function()
		{
			this.grab();
		}
	})
});

SPA.templates = new Spa.Templates();
