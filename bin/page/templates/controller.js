Package('{App}.Controllers', {
	{Name} : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenPageEvent('load', '{name}', this.onLoad.bind(this));
			SAPPHIRE.application.listenPageEvent('show', '{name}', this.onShow.bind(this));
		},

		onLoad : function()
		{
			this.view = new {App}.Views.{Name}();
		},

		onShow : function(panel, query)
		{
			this.view.draw()
		},
	})
});

SAPPHIRE.application.registerController('{name}', new {App}.Controllers.{Name}());
