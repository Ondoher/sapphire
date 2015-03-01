Package('Sapphire.Views.Mixins', {
	Animator : new  Class({

		initializeAnimator : function(duration, popFirst)
		{
			duration = (duration === undefined)?1000:duration;
			popFirst = (popFirst === undefined)?true:popFirst;

			this.duration = duration;
			this.popFirst = popFirst;

		},

		resetState : function(selector)
		{
			var allTransitionClasses = 'instant-onscreen offscreen-right offscreen-left move-offscreen-left move-offscreen-right full-opaque full-transparent onscreen fade-in fade-out dialog-fade-in dialog-fade-out';
			selector.removeClass(allTransitionClasses);
		},

		crossFade : function(from, to)
		{
			SAPPHIRE.application.fire('onAnimation', 'cross');

		// set initial states
			this.resetState(oldPage.selector);
			this.resetState(newPage.selector);

			from.addClass('instant-opaque');
			from.addClass('instant-onscreen');

			to.addClass('instant-onscreen');
			to.selector.addClass('instant-transparent');

		// let the dom settle
			return Q.delay(1)
				.then(function()
				{
					to.selector.removeClass('instant-transparent');
					from.selector.removeClass('instant-opaque');

					to.selector.addClass('fade-in');
					from.selector.addClass('fade-out');

					return Q(true);
				}.bind(this))
		},

		fadeIn : function(selector)
		{
		// set initial states
			this.resetState(selector);

			selector.addClass('instant-onscreen');
			selector.addClass('instant-transparent');

		// let the dom settle
			return Q.delay(1)
				.then(function()
				{
					selector.addClass('fade-in');
					return Q(true);
				}.bind(this))
		},

		fadeOut : function(selector)
		{
		// set initial states
			this.resetState(selector);

			selector.addClass('instant-opaque');
			selector.addClass('instant-onscreen');

		// let the dom settle
			return Q.delay(1)
				.then(function()
				{
					selector.removeClass('instant-opaque');
					selector.addClass('fade-out');

					return Q(true);
				}.bind(this))
		},

		moveLeft : function(from, to)
		{
		// set initial states
			from.addClass('instant-onscreen');
			to.addClass('offscreen-right');

		// let the dom settle
			return Q.delay(1)
				.then(function()
				{
					SAPPHIRE.application.fire('animation', 'left');

					to.removeClass('offscreen-right');
					to.addClass('onscreen');

					from.addClass('move-offscreen-left');
					from.removeClass('instant-onscreen');
					return Q(true);
				}.bind(this));
		},

		moveRight : function(from, to)
		{
		// set initial states
			to.addClass('offscreen-left');
			from.addClass('instant-onscreen');

		// let the dom settle
			return Q.delay(1)
				.then(function()
				{
					SAPPHIRE.application.fire('animation', 'right');

					to.removeClass('offscreen-left');

					from.addClass('onscreen');
					from.addClass('move-offscreen-right');
					return Q(true);
				}.bind(this));
		},

		effectDone : function(from, to)
		{
			return Q.delay(1)
				.then(function()
				{
					if (from) this.resetState(from);
					this.resetState(to);
				}.bind(this));
		},

		onWillShow : function(newPage, oldPage, callback)
		{
			if (oldPage && oldPage.name == newPage.name)
			{
				callback();
				return;
			}

		// for the first page, just put it onscreen
			if (!oldPage && this.popFirst)
			{
				newPage.selector.removeClass('offscreen-right');
				newPage.selector.addClass('instant-onscreen');
				callback();
				return;
			}

			var oldName = oldPage?oldPage.name:'';
			var newName = newPage.name

			var transition = 'crossfade';
			var promise = Q(true);

			transition = this.getTransition(oldName, newName);

			switch (transition)
			{
				case 'fadeIn':
					promise = this.fadeIn(newPage.selector);
					break;
				case 'crossfade':
					promise = this.crossFade(oldPage.selector, newPage.selector);
					break;
				case 'moveLeft':
					promise = this.moveLeft(oldPage.selector, newPage.selector);
					break;
				case 'moveRight':
					promise = this.moveRight(oldPage.selector, newPage.selector);
					break;
			}

			promise
				.delay(this.duration)
				.then(this.effectDone.bind(this, oldPage.selector, newPage.selector))
				.then(function()
				{
					callback();
				}.bind(this));
		},

		onWillHide : function(page, callback)
		{
			var name = page.name

			var transition = 'crossfade';
			var promise = Q(true);

			transition = this.getHideTransition(name);

			switch (transition)
			{
				case 'fadeOut':
					promise = this.fadeOut(page.selector);
					break;
			}

			promise
				.delay(this.duration)
				.then(this.effectDone.bind(this, undefined, page.selector))
				.then(function()
				{
					callback();
				}.bind(this));
		}

	})
});
