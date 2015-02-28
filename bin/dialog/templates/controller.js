Package('{App}.Controllers', {
	{Name} : new Class({
		Extends : Sapphire.Controller,
		Implements : [Sapphire.Controllers.Mixins.Dialog],

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenDialogEvent('load', '{name}', this.onLoad.bind(this));
			SAPPHIRE.application.listenDialogEvent('show', '{name}', this.onShow.bind(this));
			this.initializeDialog('{name}');
		},

		onLoad : function()
		{
			this.view = new {App}.Views.{Name}();
		},

		onShow : function(deferred)
		{
			this.deferred = deferred;
			this.view.draw()
		},
	})
});

SAPPHIRE.application.registerController('{name}', new {App}.Controllers.{Name}());
