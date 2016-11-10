Package('{App}.Controllers', {
	{Name} : new Class({
		Extends : Sapphire.Controller,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenViewEvent('new', '{name}', this.onNew.bind(this));
		},

		onNew : function(type, id, selector)
		{
		},
	})
});

SAPPHIRE.application.registerController('{name}', new {App}.Controllers.{Name}());
