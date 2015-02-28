
Package('Sapphire.Controllers.Mixins', {
	Dialog : new Class({

		initializeDialog : function(name, autoSetup)
		{
			this.autoSetup = (typeof autoSetup === 'undefined')?true:autoSetup;
			this.name = name;
			SAPPHIRE.application.listenDialogEvent('show', name, this.onDialogShow.bind(this));
		},

		setBusy : function()
		{
			this.dialogView.setBusy();
		},

		clearBusy : function()
		{
			this.dialogView.clearBusy();
		},

		setupDialog : function()
		{
			this.dialogView = new Sapphire.Views.Dialog(this.name);
			this.dialogView.listen('cancel', this.onDialogCancel.bind(this));
		},

		onDelayView : function()
		{
		},

		onDialogShow : function(deferred)
		{
			this.dialogDeferred = deferred;

			if(this.autoSetup)
				this.setupDialog();
		},

		onDialogCancel : function()
		{
			SAPPHIRE.application.hideDialog(this.name);
			if (this.dialogDeferred) this.dialogDeferred.resolve('cancel');
		}
	})
});
