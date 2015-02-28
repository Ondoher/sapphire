Package('Sapphire.Views', {
	Dialog : new Class({
		Extends: Sapphire.View,

		initialize : function(name)
		{
			this.parent();
			var id = name + '-dialog';
			this.dialogId = id;

			$('#' + id + ' h1 span').unbind('click');
			$('#' + id + ' h1 span').click(this.fire.bind(this, 'cancel'));
		},

		setBusy : function()
		{
			$('#' + this.dialogId).addClass('dialog-busy');
		},

		clearBusy : function()
		{
			$('#' + this.dialogId).removeClass('dialog-busy');
		}
	})
});

