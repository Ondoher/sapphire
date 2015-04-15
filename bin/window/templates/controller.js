Package('{App}.Controllers', {
	{Name} : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			this.windows = {};

			SAPPHIRE.application.listenDialogEvent('new', '{name}', this.onNew.bind(this));
			SAPPHIRE.application.listenDialogEvent('load', '{name}', this.onLoad.bind(this));
			SAPPHIRE.application.listenDialogEvent('show', '{name}', this.onShow.bind(this));

			this.initializeDialog('{name}');
		},

		onLoad : function()
		{
		},

		onNew : function(name)
		{
			this.windows[name] = {};
			this.windows[name].view = new {App}.Views.{Name}();
		},

		onShow : function(name)
		{
			this.windows[name].view.draw()
		},
	})
});

SAPPHIRE.application.registerController('{name}', new {App}.Controllers.{Name}());
