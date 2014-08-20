Package('Sapphire', {

/**********************************************************************************
	Class: PageManager

	This class is used by the <Application> class to manage pages and dialogs.
	Applications have no need to use this class directly

	Extends:
		<Eventer>

	See Also:
		<Application>
*/
	PageManager : new Class({
		Extends : Sapphire.Eventer,

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
			this.showEffect = function (oldPage, newPage, callback) {callback()};
			this.hideEffect = function (oldPage, newPage, callback) {callback()};
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
		afterShowEffect : function(oldPage, newPage, passed)
		{
			var name = newPage.name;
			var page = newPage;

			page.selector.css('display', 'block');

			if (oldPage && this.currentPage != name) this.hidePage(oldPage.name, name);
			else
			{
			// There is no page to hide, so the animation is over
				this.fire('postAnimate.' + name, newPage.selector);
				this.fire('postAnimate', name, newPage.selector);
				this.transitioning = false;
			}

			this.currentPage = newPage.name;
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
			var canShow = true;
			var passedJSON = JSON.stringify(passed);
			var oldPage = null;
			var oldPageSelector = null;
			var newPage = page;

			if (page == undefined) return;

			if (this.transitioning) return;

			this.fire('canShow', name, function(can)
			{
				canShow = canShow && can;
			}.bind(this));
			if (!canShow) return;

			this.loadPage(name, function(loaded)
			{
			// Remove the current page if needed
				if (this.currentPage == name && passedJSON == this.passedJSON)
				{
					return;
				}

				this.fireArgs('preShow.' + name);
				this.fireArgs('preShow', name);

				if (this.currentPage)
				{
					this.fireArgs('preHide.' + this.currentPage);
					this.fireArgs('preHide', this.currentPage);
				}

				this.transitioning = true;
				if (this.currentPage && this.exclusive)
				{
					$(document.body).removeClass(this.currentPage);

					oldPage = this.pages[this.currentPage];
					oldPageSelector = oldPage.selector
				}

				if (this.exclusive)
					$(document.body).addClass(name);
				//this.currentPage = name;
				this.passedJSON = passedJSON

			//!Pending: should we increment z-order here?
				if (!page.dontPrune || !page.shown)
				{
					this.container.append(page.selector);
					page.shown = true;
				}

				if (loaded)
				{
					this.fire('load', page.selector);
					this.fire('load.' + name);
				}

				this.oldPage = oldPage;
				this.newPage = newPage;

				if (!page.shown)
					this.fireArgs('firstShow.' + name, passed);

				page.shown = true;

				this.fireArgs('show.' + name, passed);
				this.fireArgs('preAnimate.' + name, passed);
				passed.splice(0, 0, name)
				this.fireArgs('show', passed);
				this.fireArgs('preAnimate', passed);

				this.showEffect(oldPageSelector, page.selector, this.afterShowEffect.bind(this, oldPage, newPage, passed));
			}.bind(this));
		},

		show : function(name)
		{
		 	var passed = Array.prototype.slice.call(arguments, 1);
			this.showPage(name, passed);
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
		Method: afterHideEffect

		This function is passed to the hide effect callback. When an effect
		has completed, it must call this callback. The page will be removed from the
		DOM or hidden when this function has completed.

		Parameters:
			name        - The name of the page
			newName     - the name of the new page

		Fires:
			- onShow
			- onShow{name}
	*/
		afterHideEffect : function(name, newName)
		{
			var page = this.pages[name];
			var newPage = this.pages[newName];

			this.fire('hide.' + name);
			this.fire('hide', name);

			if (!page.prune)
				page.selector.detach();
			else
				page.selector.css('display', 'none');

			this.currentPage = '';


		// animation is not complete until the page is hidden
			if (newName)
			{
				this.fire('postAnimate.' + newName, newPage.selector);
				this.fire('postAnimate', newName, newPage.selector);
				this.transitioning = false;
			}
		},


		setEffects : function(show, hide)
		{
			if (show) this.showEffect = show;
			if (hide) this.hideEffect = hide;
		},
	/**********************************************************************************
		Method: hidePage

		The application manager calls this method to hide a page. This method only needs to be called if
		the page manager is set exclusive.

		Parameters:
			name        - The name of the page
	*/
		hidePage : function(name, newPage)
		{
			var page = this.pages[name];

			this.hideEffect(this.oldPage?this.oldPage.selector:null, this.newPage.selector, this.afterHideEffect.bind(this, name, newPage));
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
			if (name)
			{
				var page = this.pages[name];
				if (page.loaded)
				{
					this.fire('load.' + name);
				}
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
				SAPPHIRE.loader.loadScripts(page.javascript, this.stepComplete.bind(this, name, callback, 'scripts', true));
				SAPPHIRE.loader.loadCSS(page.css, this.stepComplete.bind(this, name, callback, 'css', true));
				SAPPHIRE.loader.loadMarkup(page, this.stepComplete.bind(this, name, callback, 'markup', true));
			}
		}
	})
});


