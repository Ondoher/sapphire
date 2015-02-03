Package('{App}.Controllers', {
	{Name} : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listen('ready', this.onReady.bind(this));
		},

		onReady : function()
		{
			this.view = new {App}.Views.{Name}();
			this.view.draw();
		}
	})
});

SAPPHIRE.application.registerController('{name}', new {App}.Controllers.{Name}());
