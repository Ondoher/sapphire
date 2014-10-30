Package('Sapphire', {
/**********************************************************************************
	Class: DefaultRouter
*/
	DefaultRouter : new Class({
		Extends : Sapphire.Eventer,

		initialize : function()
		{
			this.parent();
			this.history = SAPPHIRE.history;

			SAPPHIRE.application.listenPageEvent('show', '', this.onPageShow.bind(this));
			SAPPHIRE.application.listenPanelEvent('show', '', '', this.onPanelShow.bind(this));
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
			SAPPHIRE.application.showPage(address.page, address.path, address.query);
		},

		onPageShow : function(name, path, query)
		{
			path = (path !== undefined)?path:name;
			var queryStr = Object.toQueryString(query);

			this.history.setPath(path, queryStr);
		},

		onPanelShow : function(name, path, query)
		{
			path = (path !== undefined)?path:name;
			var queryStr = Object.toQueryString(query);

			this.history.setPath(path, queryStr);
		}

	})
});

SAPPHIRE.history.installRouter(new Sapphire.DefaultRouter());
