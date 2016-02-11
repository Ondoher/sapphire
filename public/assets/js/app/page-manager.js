Package('Sapphire', {

/**********************************************************************************
	Class: PageManager

	This class is used by the <Application> class to manage pages and dialogs.
	Applications have no need to use this class directly

	Extends:
		<Eventer>

	See Also:
		<Application>

	Events:
		load
		canShow
		showing
		hiding
		firstShow
		show
		hide
*/
	PageManager : new Class({
		Extends : Sapphire.Eventer,

	/**********************************************************************************
		Constructor: initialize

		This is the constructor for the class.

		Parameters:
			primary	  - true if this is the primary page manager, usually resevered for pages

	*/
		initialize: function(primary)
		{
			this.parent();
			this.primary = primary;
			this.pages = $({});
			this.currentPage = undefined;
			this.multi = false;
			this.nextId = 0;
		},

	/**********************************************************************************
		Method: setContainer

		Called to set the DOM element within which all the pages will be kept. Pages will
		be pulled out of the DOM and moved under this node. All previous content in this
		element will be deleted.

		Parameters:
			container	  - The DOM node to put the pages in

	*/
		setContainer : function(container)
		{
			this.container = container;
		},

		setMulti : function(on)
		{
			this.multi = on;
		},

	/**********************************************************************************
		Method: addPage

		This method adds a page to the list of pages to be named.

		Parameters:
			name		- The name of the page
			spec		- information about the page itself
	*/
		addPage : function(spec)
		{
			this.pages[spec.name] = $H(spec);
		},

		checkWait : function(deferred)
		{
			this.waiting--;
			if (this.waiting == 0) deferred.resolve(true);

		},

		fireEventAndWait : function(which, args)
		{
			var deferred = Q.defer();

			this.waiting = this.getEventCount(which);

			if (this.waiting == 0) deferred.resolve(true);
			else
			{
				args.push(this.checkWait.bind(this, deferred));
				this.fireArgs(which, args);
			}

			return deferred.promise;
		},

	/**********************************************************************************
		Method: showPage

		The application manager calls this method to show a page or dialog. If
		exclusive is true, then the current page will be hidden first.

		Parameters:
			name		- The name of the page
			passed		- the variables that were passed to the show method of the application
	*/
		showPage : function(name, passed)
		{
			var page = this.pages[name];
			var canShow = true;
			var passedJSON = JSON.stringify(passed);
			var oldPage = null;
			var oldPageSelector = null;
			var newPage = page;
			var pageName = name;

			if (page == undefined) return Q(false);
			if (this.transitioning) return Q(false);

		// give the application a chance to refuse the page show
			this.fire('canShow', name, function(can)
			{
				canShow = canShow && can;
			}.bind(this));
			if (!canShow) return Q(false);

		// don't reshow the current page
			if (!this.multi && this.currentPage == name && passedJSON == this.passedJSON) return Q(true);

			this.transitioning = true;

		// make sure the page is loaded
			return this.loadPage(name)
				.then(function(loaded)
				{
					var newName = name;
					var oldName = name;
					var cloned = false;

					if (this.multi || page.clone)
					{
						oldName = name;
						newName = name + '_' + this.nextId
						this.nextId++;

						this.pages[newName] = Object.clone(page);
						this.pages[newName].selector = page.selector.clone(true, true);
						this.pages[newName].clone = false;

						page = this.pages[newName];
						cloned = true;
					}

				// add the page into the dom, but add the class hidden to it first
					page.selector.addClass('hidden');
					if (page.dontPrune)
					{
						page.selector.css('position', 'static');
						page.selector.css('right', '0px');
					}
					if (!page.dontPrune || !page.shown) this.container.append(page.selector);

					if (loaded)
					{
						this.fire('load', name, page.selector, newName);
						this.fire('load.' + name, page.selector, newName);
					}

					name = newName;

					oldPage = this.pages[this.currentPage];

				// fire the willShow event, passing both the new page and the old. This allows the application to animate the transition.
					return this.fireEventAndWait('willShow', [page, oldPage])
						.then(this.hideCurrentPage.bind(this, name))
						.then(function()
						{
							if (this.primary) $(document.body).addClass(name);
							this.passedJSON = passedJSON
							this.currentPage = name;

							if (cloned)
							{
								var args = [oldName, name, page.selector].concat(passed);
								this.fireArgs('new', args);
							}

							page.selector.removeClass('hidden');
							if (!page.shown) this.fireArgs('firstShow.' + name, passed);
							page.shown = true;

							this.fireArgs('show.' + pageName, passed);

							passed.splice(0, 0, name)
							this.fireArgs('show', passed);


							this.transitioning = false;
							return Q(true);
						}.bind(this));
				}.bind(this));
		},

		show : function(name)
		{
			var passed = Array.prototype.slice.call(arguments, 1);
			return this.showPage(name, passed);
		},

		hidePage : function(name)
		{
			var page = this.pages[name];

			return this.fireEventAndWait('willHide', [page])
				.then(function()
				{
					this.fire('hide.' + name, page);
					this.fire('hide', name, page);

					if (this.primary)
						$(document.body).removeClass(name);
					if (!page.dontPrune)
						page.selector.detach();
					else
					{
						page.selector.css('right', '100%');
						page.selector.css('position', 'absolute');
					}

					this.currentPage = '';
					return Q(true);
				}.bind(this));
		},

		hideCurrentPage : function(name)
		{
			if (!this.currentPage) return Q(false);
			if (this.currentPage === name) return Q(false);
			if (this.multi) return Q(false);

			return this.hidePage(this.currentPage);
		},

		reset : function()
		{
			var name = this.currentPage;

			if (!name) return;

			var page = this.pages[name];

			this.fire('hide.' + name);
			this.fire('hide', name);

			if (!page.prune)
				page.selector.detach();
			else
				page.selector.css('display', 'none');

			this.currentPage = '';
		},

	/**********************************************************************************
		Method: listenPageEvent

		The application manager calls this method to listen for events that are exclusive to
		a single page.

		Parameters:
			event		- The event to listen for
			name		- The page having the event fired
			callback	- The function to call when fired
	*/
		listenPageEvent : function(event, name, callback)
		{
			var page = this.pages[name];

			this.listen(event + '.' + name, callback);

			if (page && page.loaded) this.fire('load.' + name);
		},

	/**********************************************************************************
		Method: listenGlobalEvent

		The application manager calls this method to listen for events that are fired
		for all pages

		Parameters:
			event		 - The event to listen for
			callback	 - The function to vall when fired
	*/
		listenGlobalEvent : function(event, callback)
		{
			this.listen(event, callback);
		},

	/**********************************************************************************
		Method: loadPage

		The application manager calls this method to hot load the page and its parts

		Parameters:
			name  - the name of the page to load

		Returns:
			a promise that will be fulfilled when loading is completed
	*/
		loadPage : function(name)
		{
			var deferred = Q.defer();
			var page = this.pages[name];

			if (page.selector) return Q(false);
			else
			{
				var promises = [];

				promises.push(SAPPHIRE.loader.loadScripts(page.javascript));
				promises.push(SAPPHIRE.loader.loadCSS(page.css));
				promises.push(SAPPHIRE.loader.loadMarkup(page));

				return Q.all(promises)
					.then(function()
					{
						return Q(true);
					}.bind(this));
			}
		}
	})
});


