Package('Spa', {

/**********************************************************************************
	Class: PageManager

	This class is used by the <Application> class to manage pages and dialogs.
	Applications have no need to use this class directly

	Extends:
		<EventManager>

	See Also:
		<Application>
*/
	PageManager : new Class({
		Extends : Spa.EventManager,

	/**********************************************************************************
		Constructor: initialize

		This is the constructor for the class.

		Parameters:
			exclusive     - true if only one page at a time can be shown, false otherwise

	*/
		initialize: function(exclusive)
		{
			this.parent();
			this.exclusive = exclusive;
			this.pages = $({});
			this.currentPage = undefined;
			this.showEffect = function (node, callback) {callback()};
			this.hideEffect = function (node, callback) {callback()};
		},

	/**********************************************************************************
		Method: setContainer

		Called to set the DOM element within which all the pages will be kept. Pages will
		be pulled out of the DOM and moved under this node. All previous content in this
		element will be deleted.

		Parameters:
			container     - The DOM node to put the pages in

	*/
		setContainer : function(container)
		{
			this.container = container;
		},

	/**********************************************************************************
		Method: addPage

		This method adds a page to the list of pages to be named.

		Parameters:
			name        - The name of the page
			spec        - information about the page itself
	*/
		addPage : function(spec)
		{
			this.pages[spec.name] = $H(spec);
		},

	/**********************************************************************************
		Method: afterShowEffect

		This function is passed to the show effect callback. When an effect
		has completed, it must call this callback.

		Parameters:
			name        - The name of the page
			passed      - the variables that were passed to the show method

		Fires:
			- firstShow
			- show
			- show.<name>
	*/
		afterShowEffect : function(name, passed)
		{
			var page = this.pages[name];
			if (!page.shown)
				this.fireArgs('firstShow.' + name, passed);

			page.shown = true;
			this.fireArgs('show.' + name, passed);
			passed.splice(0, 0, name)
			this.fireArgs('show', passed);

			page.selector.css('display', 'block');
			this.currentPage = name;
		},

	/**********************************************************************************
		Method: showPage

		The application manager calls this method to show a page or dialog. If
		exclusive is true, then the current page will be hidden first.

		Parameters:
			name        - The name of the page
			passed      - the variables that were passed to the show method of the application
	*/
		showPage : function(name, passed)
		{
			var page = this.pages[name];

			this.loadPage(name, function(loaded)
			{
			// Remove the current page if needed
				if (this.currentPage == name) return;

				if (this.currentPage && this.exclusive)
					this.hidePage(this.currentPage);

				this.currentPage = name;

			//!Pending: should we increment z-order here?
				if (!page.dontPrune || !page.shown)
				{
					this.container.append(page.selector);
					page.shown = true;
				}

				if (loaded)
				{
					this.fire('load');
					this.fire('load.' + name);
				}

				this.showEffect(page.selector, this.afterShowEffect.bind(this, name, passed));
			}.bind(this));
		},

	/**********************************************************************************
		Method: afterHideEffect

		This function is passed to the hide effect callback. When an effect
		has completed, it must call this callback. The page will be removed from the
		DOM or hidden when this function has completed.

		Parameters:
			name        - The name of the page

		Fires:
			- onShow
			- onShow{name}
	*/
		afterHideEffect : function(name)
		{
			var page = this.pages[name];

			if (!page.prune)
				page.selector.detach();
			else
				page.selector.css('display', 'none');
		},

	/**********************************************************************************
		Method: hidePage

		The application manager calls this method to hide a page. This method only needs to be called if
		the page manager is set exclusive.

		Parameters:
			name        - The name of the page
	*/
		hidePage : function(name)
		{
			var page = this.pages[name];
			this.fire('hide.' + name);
			this.fire('hide', name);

			this.hideEffect(this.pages[name], this.afterHideEffect.bind(this, name));
			this.currentPage = '';
		},

	/**********************************************************************************
		Method: listenPageEvent

		The application manager calls this method to listen for events that are exclusive to
		a single page.

		Parameters:
			event       - The event to listen for
			name 		- The page having the event fired
			callback    - The function to call when fired
	*/
		listenPageEvent : function(event, name, callback)
		{
			if (page)
			{
				var page = this.pages[name];
				if (page.loaded)
					this.fire('load.' + name);
				this.listen(event + '.' + name, callback);
			}
			this.listen(event + '.' + name, callback);
		},

	/**********************************************************************************
		Method: listenGlobalEvent

		The application manager calls this method to listen for events that are fired
		for all pages

		Parameters:
			event        - The event to listen for
			callback     - The function to vall when fired
	*/
		listenGlobalEvent : function(event, callback)
		{
			this.listen(event, callback);
		},

	/**********************************************************************************
		Method: stepComplete

		called when part of a page has been loaded, when all steps are complete, the
		callback will be called

		Parameters:
			name		- the name of the page being loaded
			callback	- the function to call when done
			loaded		- true if the page had to be loaded, false otherwise
	*/

		stepComplete : function(name, callback, type, loaded)
		{
			var page = this.pages[name];

			page.loading++;
			if (page.loading == 3) callback(loaded);
			console.log('Spa.PageManager.stepComplete', name, type, loaded, page.loading);
		},



	/**********************************************************************************
		Method: loadPage

		The application manager calls this method to hot load the page and it parts

		Parameters:
			event        - The event to listen for
			callback     - The function to call when everything has been loaded
	*/
		loadPage : function(name, callback)
		{
			var page = this.pages[name];
			page.loading = 0;

			if (page.selector) callback(false);
			else
			{
				SPA.loader.loadScripts(page.javascript, this.stepComplete.bind(this, name, callback, 'scripts', true));
				SPA.loader.loadCSS(page.css, this.stepComplete.bind(this, name, callback, 'css', true));
				SPA.loader.loadMarkup(page, this.stepComplete.bind(this, name, callback, 'markup', true));
			}
		}
	})
});


