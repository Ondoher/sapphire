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
			SAPPHIRE.application.listenPageEvent('show', '', this.onPageShow.bind(this));
			SAPPHIRE.application.listenPanelEvent('show', '', '', this.onPanelShow.bind(this));
			SAPPHIRE.application.listen('ready', this.onReady.bind(this));

			console.log(window[SAPPHIRE.ns].realPath);
			if (window[SAPPHIRE.ns].realPath)
				$.address.state(window[SAPPHIRE.ns].realPath).init(this.onInit.bind(this)).change(this.onChange.bind(this));
			else
				$.address.init(this.onInit.bind(this)).change(this.onChange.bind(this));
		},

		handleFirst : function()
		{
			if (this.first)	this.handleEvent(this.first);
			this.first = false;
		},

		parseEvent : function(event)
		{
			var result = {};
			var paths = event.path.split('/');
			paths.shift();
			var path = paths[0];
			result.page = path;
			result.path = event.path;
			result.query = (event.queryString != '')?event.queryString.parseQueryString():{};
			return result;
		},

		handleEvent : function(event)
		{
			var address = this.parseEvent(event);
			console.log('handleEvent', event, address);

			this.ignoreChange = true;
			SAPPHIRE.application.showPage(address.page, address.path, address.query);
		},

		getFirst : function()
		{
			return this.parseEvent(this.first);
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
			console.log('change', event);
			if (this.first)
			{
				console.log('first', event);
				this.fire('init', event);
				return;
			}

			if (this.ignoreChange)
			{
				console.log('ignore change');
				this.ignoreChange = false;
				return;
			}
			this.ignoreChange = false;

			this.fire('change', event, this.first != false);
			this.fire('externalChange', this.first != false);
			if (this.first) this.first = false;
			this.internalChange = true;
			this.handleEvent(event);

		},

		onPageShow : function(name, path, query)
		{
			path = (path !== undefined)?path:name;

			if (!this.internalChange)
				this.fire('internalChange', this.first != false);

			if (this.first) return;

			var queryStr = Object.toQueryString(query);

			if (!this.ignoreChange)
			{
				console.log('update path');
				$.address.path(path);
				$.address.queryString(queryStr);
				$.address.update();
			}

			this.internalChange = false;
			this.ignoreChange = false;
		},

		onPanelShow : function(name, path, query)
		{
			path = (path !== undefined)?path:name;

			this.ignoreChange = true;
			var queryStr = Object.toQueryString(query);
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
