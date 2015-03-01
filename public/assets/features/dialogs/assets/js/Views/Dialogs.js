Package('Sapphire.Views', {
	Dialogs : new Class({
		Extends: Sapphire.View,
		Implements: [Sapphire.Views.Mixins.Animator],

		initialize : function()
		{
			this.parent();
			this.hideDialog.delay(1, this);

			SAPPHIRE.application.listenDialogEvent('load', '', this.onLoadDialog.bind(this));
			SAPPHIRE.application.listenDialogEvent('show', '', this.onShowDialog.bind(this));
			SAPPHIRE.application.listenDialogEvent('hide', '', this.onHideDialog.bind(this));
			SAPPHIRE.application.listenDialogEvent('willShow', '', this.onDialogWillShow.bind(this));
			SAPPHIRE.application.listenDialogEvent('willHide', '', this.onDialogWillHide.bind(this));

			$('#dialog-overlay').click(this.onOverlayClick.bind(this));
			this.duration = 250;
		},

		setDuration : function(duration)
		{
			this.duration = duration;
		},

		hideDialog : function()
		{
			$(document.body).removeClass('dialog-open');
		},

		moveDialog : function(page)
		{
			var top = $(document).scrollTop();

			$(document.body).addClass('dialog-open');

			page.selector.css('top', (top + 20) + 'px');
			page.selector.css('position', 'relative');
		},

		onDialogWillShow : function(newPage, oldPage, callback)
		{
			this.moveDialog(newPage);
			newPage.selector.removeClass('hidden');
			callback();
		},

		onDialogWillHide : function(page, callback)
		{
			this.hideDialog();
			Q.delay(this.duration)
				.then(callback);
		},

		onShowDialog : function(dialog, deferred)
		{
			this.currentDeferred = deferred;
			this.currentDialog = dialog;
		},

		onHideDialog : function()
		{
			this.hideDialog.delay(1, this);
			this.currentDeferred = undefined;
			this.currentDialog = undefined;
		},

		onLoadDialog : function(name, selector)
		{
		},

		onOverlayClick : function()
		{
			if (!this.currentDialog) return;
			this.currentDeferred.resolve('cancel');

			SAPPHIRE.application.hideDialog(this.currentDialog);
		}
	})
});

SAPPHIRE.application.registerView('dialogs', new Sapphire.Views.Dialogs());

