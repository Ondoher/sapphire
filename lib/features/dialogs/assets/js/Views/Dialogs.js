Package('Sapphire.Views', {
	Dialogs : new Class({
		Extends: Sapphire.View,

		initialize : function()
		{
			this.parent();

			SAPPHIRE.application.listenDialogEvent('load', '', this.onLoadDialog.bind(this));
			SAPPHIRE.application.listenDialogEvent('show', '', this.onShowDialog.bind(this));
			SAPPHIRE.application.listenDialogEvent('hide', '', this.onHideDialog.bind(this));
			SAPPHIRE.application.setDialogEffects(this.onShowDialogEffect.bind(this), this.onHideDialogEffect.bind(this));

			$('#dialog-overlay').click(this.onOverlayClick.bind(this));
		},

		resetState : function(selector)
		{
			var allTransitionClasses = 'instant-onscreen offscreen-right offscreen-left move-offscreen-left move-offscreen-right full-opaque full-transparent onscreen fade-in fade-out dialog-fade-in dialog-fade-out';
			selector.removeClass(allTransitionClasses);
		},

		hideDialog : function()
		{
			$(document.body).removeClass('dialog-open');
		},

		onShowDialog : function(dialog, deferred)
		{
			$(document.body).addClass('dialog-open');
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

		onShowDialogEffect : function(oldPage, newPage, callback)
		{
			var top = $(document).scrollTop();

			newPage.css('top', (top + 20) + 'px');
			newPage.css('position', 'relative');

			this.resetState(newPage);
			this.resetState($('#dialog-overlay'));
			newPage.find(':first-child').addClass('instant-transparent');
			$('#dialog-overlay').addClass('instant-transparent');

		// let the dom settle
			setTimeout(function()
			{
				newPage.find(':first-child').removeClass('instant-transparent');
				$('#dialog-overlay').removeClass('instant-transparent');
				newPage.find(':first-child').addClass('dialog-fade-in');
				newPage.find(':first-child').removeClass('dialog-fade-out');
				$('#dialog-overlay').addClass('dialog-fade-in');

				setTimeout(function()
				{
					callback();
				}.bind(this), 420);
			}.bind(this), 1);

		},

		onHideDialogEffect : function(oldPage, newPage, callback)
		{
			this.resetState(newPage);
			this.resetState($('#dialog-overlay'));
			newPage.find(':first-child').removeClass('instant-opaque');
			$('#dialog-overlay').removeClass('instant-opaque');
			setTimeout(function()
			{
				newPage.find(':first-child').removeClass('instant-opaque');
				$('#dialog-overlay').removeClass('instant-opaque');
				newPage.find(':first-child').addClass('dialog-fade-out');
				newPage.find(':first-child').removeClass('dialog-fade-in');
				$('#dialog-overlay').addClass('dialog-fade-out');

				setTimeout(function()
				{
					callback();
				}.bind(this), 450);
			}.bind(this), 1);
		},

		onOverlayClick : function()
		{
			if (!this.currentDialog) return;
			this.currentDeferred.resolve('cancel');
			SAPPHIRE.application.hideDialog(this.currentDialog);
		}
	})
});

SAPPHIRE.application.registerView('dialogs', new Common.Views.Dialogs());

