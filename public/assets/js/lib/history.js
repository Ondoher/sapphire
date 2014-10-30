Package('Sapphire', {
/**********************************************************************************
	Class: History

	This class manages browser history and deep linking. When included it is assumed
	that the second parameter passed to showPage is an object to be encoded on the pseudo-
	query string in the url hash
*/
	History : new Class({
		Extends : Sapphire.Eventer,

		initialize : function()
		{
			this.parent();

			this.first = false;

			if (window[SAPPHIRE.ns].realPath)
			{
				$.address.history(true);
				$.address.state(window[SAPPHIRE.ns].realPath).init(this.onInit.bind(this)).change(this.onChange.bind(this));
			}
			else
				$.address.init(this.onInit.bind(this)).change(this.onChange.bind(this));
		},

		installRouter : function(router)
		{
			this.router = router;
		},

		handleEvent : function(event)
		{
			this.ignoreChange = true;
			this.router.handleEvent(event);
		},

		handleFirst : function()
		{
			if (this.first)	this.handleEvent(this.first);
			this.first = false;
		},

		onReady : function()
		{
		},

		onInit : function(event)
		{
			this.first = event;
			$.address.autoUpdate(false);
		},

		onChange : function(event)
		{
			if (this.first)
			{
				this.fire('init', event);
				return;
			}

			if (this.first) this.first = false;

			if (this.ignoreChange)
			{
				this.ignoreChange = false;
				return;
			}
			this.ignoreChange = false;

			this.fire('change', event, this.first != false);
			this.fire('externalChange', this.first != false);
			this.internalChange = true;
			this.handleEvent(event);
		},

		setPath : function(path, queryStr)
		{
			if (!this.internalChange)
				this.fire('internalChange', this.first != false);

			if (this.first)	this.first = false;

			if (!this.ignoreChange)
			{
				$.address.path(path);
				$.address.queryString(queryStr);
				$.address.update();
			}

			this.internalChange = false;
			this.ignoreChange = false;
		}
	})
});

SAPPHIRE.history = new Sapphire.History();
