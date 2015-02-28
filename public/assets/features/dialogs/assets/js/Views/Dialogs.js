Package('Sapphire.Views', {
	Dialogs : new Class({
		Extends: Sapphire.View,
		Implements: [Sapphire.Views.Mixins.Animator],

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenDialogEvent('load', '', this.onLoadDialog.bind(this));
			SAPPHIRE.application.listenDialogEvent('show', '', this.onShowDialog.bind(this));
			SAPPHIRE.application.listenDialogEvent('hide', '', this.onHideDialog.bind(this));
			SAPPHIRE.application.listenDialogEvent('willShow', '', this.onWillShow.bind(this));
			SAPPHIRE.application.listenDialogEvent('willHide', '', this.onWillHide.bind(this));
			SAPPHIRE.application.listenDialogEvent('willShow', '', this.moveDialog.bind(this));

			$('#dialog-overlay').click(this.onOverlayClick.bind(this));

			this.initializeAnimator(500, false);
		},

		getHideTransition : function(name)
		{
			return 'fadeOut';
		},

		getTransition : function(oldName, newName)
		{
			return 'fadeIn';
		},

		hideDialog : function()
		{
			$(document.body).removeClass('dialog-open');
		},

		moveDialog : function(newPage, oldPage, callback)
		{
			var top = $(document).scrollTop();

			$(document.body).addClass('dialog-open');

			newPage.selector.css('top', (top + 20) + 'px');
			newPage.selector.css('position', 'relative');

			callback();
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

