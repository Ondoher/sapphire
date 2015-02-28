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

		crossFade : function(oldPage, newPage)
		{
			SAPPHIRE.application.fire('onAnimation', 'cross');

		// set initial states
			this.resetState(oldPage.selector);
			this.resetState(newPage.selector);

			oldPage.selector.addClass('instant-opaque');
			oldPage.selector.addClass('instant-onscreen');

			newPage.selector.addClass('instant-onscreen');
			newPage.selector.addClass('instant-transparent');

		// let the dom settle
			return Q.delay(1)
				.then(function()
				{
					newPage.selector.removeClass('instant-transparent');
					oldPage.selector.removeClass('instant-opaque');

					newPage.selector.addClass('fade-in');
					oldPage.selector.addClass('fade-out');

					return Q(true);
				}.bind(this))
		},

		fadeIn : function(page)
		{
		// set initial states
			this.resetState(page.selector);

			page.selector.addClass('instant-onscreen');
			page.selector.addClass('instant-transparent');

		// let the dom settle
			return Q.delay(1)
				.then(function()
				{
					page.selector.removeClass('instant-transparent');
					page.selector.addClass('fade-in');
					return Q(true);
				}.bind(this))
		},

		fadeOut : function(page)
		{
		// set initial states
			this.resetState(page.selector);

			page.selector.addClass('instant-opaque');
			page.selector.addClass('instant-onscreen');

		// let the dom settle
			return Q.delay(1)
				.then(function()
				{
					page.selector.removeClass('instant-opaque');
					page.selector.addClass('fade-out');

					return Q(true);
				}.bind(this))
		},

		moveLeft : function(oldPage, newPage)
		{
		// set initial states
			oldPage.selector.addClass('instant-onscreen');
			newPage.selector.addClass('offscreen-right');

		// let the dom settle
			return Q.delay(1)
				.then(function()
				{
					SAPPHIRE.application.fire('animation', 'left');

					newPage.selector.removeClass('offscreen-right');
					newPage.selector.addClass('onscreen');

					oldPage.selector.addClass('move-offscreen-left');
					oldPage.selector.removeClass('instant-onscreen');
					return Q(true);
				}.bind(this));
		},

		moveRight : function(oldPage, newPage)
		{
		// set initial states
			newPage.selector.addClass('offscreen-left');
			oldPage.selector.addClass('instant-onscreen');

		// let the dom settle
			return Q.delay(1)
				.then(function()
				{
					SAPPHIRE.application.fire('animation', 'right');

					newPage.selector.removeClass('offscreen-left');
					newPage.selector.addClass('onscreen');

					oldPage.selector.addClass('move-offscreen-right');
					return Q(true);
				}.bind(this));
		},

		effectDone : function(oldPage, newPage)
		{
			console.log('effectDone', oldPage, newPage);
			return Q.delay(1)
				.then(function()
				{
					if (oldPage) this.resetState(oldPage.selector);
					this.resetState(newPage.selector);
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
					promise = this.fadeIn(newPage);
					break;
				case 'crossfade':
					promise = this.crossFade(oldPage, newPage);
					break;
				case 'moveLeft':
					promise = this.moveLeft(oldPage, newPage);
					break;
				case 'moveRight':
					promise = this.moveRight(oldPage, newPage);
					break;
			}

			promise
				.delay(this.duration)
				.then(this.effectDone.bind(this, oldPage, newPage))
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
					promise = this.fadeOut(page);
					break;
			}

			promise
				.delay(this.duration)
				.then(this.effectDone.bind(this, undefined, page))
				.then(function()
				{
					callback();
				}.bind(this));
		}

	})
});
