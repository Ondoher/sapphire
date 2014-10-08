
Package('Sapphire', {
	Templates : new Class({
		Extends : Sapphire.Eventer,

		initialize : function()
		{
			SAPPHIRE.application.listenPageEvent('load', '', this.onLoad.bind(this, 'page'));
			SAPPHIRE.application.listenDialogEvent('load', '', this.onLoad.bind(this, 'dialog'));
			SAPPHIRE.application.listen('start', this.onStart.bind(this));
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

		iterate : function(callback, obj)
		{
			this.templates.each(callback, obj);
		},

		onStart : function(callback)
		{
			this.grab();
			callback();
			SAPPHIRE.application.panels.each(function(panel, name)
			{
				SAPPHIRE.application.listenPanelEvent('load', name, '', this.onLoad.bind(this, 'panel'));
			}, this);
		},

		onLoad : function(type)
		{
			this.grab();
		}
	})
});

SAPPHIRE.templates = new Sapphire.Templates();
