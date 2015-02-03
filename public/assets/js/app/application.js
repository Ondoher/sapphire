/**********************************************************************************
	Class: Application

	A global instance of this class named SAPPHIRE.application manages the basic functions of a JavaScript Application,
	such as page management and the startup sequence.  Some of these functions will be called automatically using
	JavaScript snippets inserted when the application was built, see <Application>. Other functions will be called from
	within your	specific application.

	Extends:
		<Eventer>

	See Also:
		<PageManager>, <Eventer>
*/


Package('Sapphire', {
	Application : new Class({

		Extends : Sapphire.Eventer,

	/**********************************************************************************'
		Constructor: initialize

		Called at javascript load, the DOM will not be ready.
	*/
		initialize : function()
		{
			this.parent();
			this.pages = new Sapphire.PageManager(true);
			this.dialogs = new Sapphire.PageManager(false);
			this.panels = $H({});

			this.startPage = '';
			this.started = false;

			this.views = $H({});
			this.controllers = $H({});
			this.models = $H({});
			this.services = $H({});
		},

	/**********************************************************************************'
		Method: addPage

		The builder will insert a JavaScript snippet to call this function for every
		page that has been added.

		Parameters:
			spec    - the specification of a page
	*/
		addPage : function(spec)
		{
			this.pages.addPage(spec);
		},

	/**********************************************************************************'
		Method: dialog

		The builder will insert a JavaScript snippet to call this function for every
		dialog that has been added. Dialogs are modal windows designed to pop up over pages.
		You can have more than one dialog open at any time.

		Parameters:
			spec    - the specification for the dialog
	*/
		addDialog : function(spec)
		{
			this.dialogs.addPage(spec);
		},

		addPanel : function(name, spec)
		{
			if (!this.panels.has(name)) this.panels[name] = new Sapphire.PageManager(true);
			this.panels[name].addPage(spec);
		},

	/**********************************************************************************'
		Method: showPage

		Call this method to hide the current page and show a new one. If the current page
		has not been maked as dontPrune, then it will be removed from the DOM. Before the
		page has been removed, any hide events will be fired. The show events will fired
		once the page has been added back into the DOM.


		Parameters:
			name    - the name of the page
			...     - Any arguments passed after name will be passed to any listeners for
					  this page
	*/
		showPage : function(name)
		{
		 	var passed = Array.prototype.slice.call(arguments, 1);
			this.pages.showPage(name, passed);
			this.hasShownPage = true;
		},

	/**********************************************************************************'
		Method: showPanel

		Call this method to hide the current page and show a new one. If the current page
		has not been maked as dontPrune, then it will be removed from the DOM. Before the
		page has been removed, any hide events will be fired. The show events will fired
		once the page has been added back into the DOM.


		Parameters:
			name    - the name of the page
			...     - Any arguments passed after name will be passed to any listeners for
					  this page
	*/
		showPanel : function(set, name)
		{
		 	var passed = Array.prototype.slice.call(arguments, 1);
			this.panels[set].showPage(name, passed);
		},

		setPanelContainer : function(name, selector)
		{
			this.panels[name].setContainer(selector);
		},

		resetPanels : function(name)
		{
			this.panels[name].reset();
		},

		firePanelEvent : function(event, name)
		{
		 	var passed = Array.prototype.slice.call(arguments, 2);
			this.panels[name].fireArgs(event, passed);
		},

	/**********************************************************************************'
		Method: getCurrentPage

		Call this method to get the name of the current page.

		Returns:
			The page name as a string
	*/
		getCurrentPage : function()
		{
			return this.pages.currentPage;
		},

	/**********************************************************************************'
		Method: showDialog

		Call this method to show a dialog. Any dialogs already shown will remain shown.
		Show events will be fired once the dialog has been added back into the DOM.

		Parameters:
			name    - the name of the dialog
			...     - Any arguments passed after name will be passed to any listeners for
					  this dialog
	*/
		showDialog : function(name)
		{
		    var passed = Array.prototype.slice.call(arguments, 1);
			var deferred = Q.defer();
			passed.unshift(deferred);

			this.dialogs.showPage(name, passed);

			return deferred.promise;
		},

	/**********************************************************************************'
		Method: hideDialog

		Call this method to hide a dialog. This method must be called for all dialogs shown

		Parameters:
			name    - the name of the page
			...     - Any arguments passed after name will be passed to any listeners for
					  this page
	*/
		hideDialog : function(name)
		{
			this.dialogs.hidePage(name);
		},

	/**********************************************************************************'
		Method: setStartPage

		Call this method during application startup to set the first dialog to show

		Parameters:
			name    - the name of the page
	*/
		setStartPage : function(name)
		{
			this.startPage = name;
		},

		checkReady : function()
		{
			this.readyWaiting--;
			if (this.readyWaiting == 0) this.ready();
		},

		ready : function()
		{
			this.pages.setContainer($('#pages'));
			this.dialogs.setContainer($('#dialogs'));

			this.fire('ready');

			if (this.startPage && !this.hasShownPage) this.showPage(this.startPage);
		},

	/**********************************************************************************'
		Method: start

		Call this method after the dom is ready to start the application start up sequence. The
		Application object on the server side will insert a call to this automatically.

		When this method is called:
			- if set, the default page will be shown
	*/
		start : function()
		{
			if (this.started) return;
			this.started = true;

			this.readyWaiting = this.getEventCount('start');
			if (this.readyWaiting == 0) this.ready.delay(1, this);

			this.fire('start', this.checkReady.bind(this));
		},


		listenPageEvent : function(event, which, callback)
		{
			if (which) this.pages.listenPageEvent(event, which, callback)
			else this.pages.listenGlobalEvent(event, callback);
		},

		listenDialogEvent : function(event, which, callback)
		{
			if (which) this.dialogs.listenPageEvent(event, which, callback)
			else this.dialogs.listenGlobalEvent(event, callback);
		},

		listenPanelEvent : function(event, set, which, callback)
		{
			if (!set)
			{
				var panels = $H(this.panels);
				panels.each(function(set)
				{
					if (which) set.listenPageEvent(event, which, callback)
					else set.listenGlobalEvent(event, callback);
				}, this);
				return;
			}

			if(this.panels[set])
			{
				if (which) this.panels[set].listenPageEvent(event, which, callback)
				else this.panels[set].listenGlobalEvent(event, callback);
			}
		},

	/**********************************************************************************'
		Method: setPageEffects

		Call this method to register callbacks for adding animations when a page is shown or hidden.

		Parameters:
			show      - the <showEffect> function to call when a page is shown
			hide      - the <hideEffect> function to call when a page is hidden

	 	See Also:
			<showEffect>, <hideEffect>
	*/
		setPageEffects : function (show, hide)
		{
			this.pages.setEffects(show, hide);
		},

	/**********************************************************************************'
		Method: setDialogEffects

		Call this method to register callbacks for adding animations when a dialog is shown or hidden.

		Parameters:
			show      - the <showEffect> function to call when a dialog is shown
			hide      - the <hideEffect> function to call when a dialogis hidden

	 	See Also:
			<showEffect>, <hideEffect>
	*/
		setDialogEffects : function (show, hide)
		{
			this.dialogs.setEffects(show, hide);
		},

		setPanelEffects : function (name, show, hide)
		{
			this.panels[name].setEffects(show, hide);
		},

		registerController : function(name, controller)
		{
			this.controllers[name] = controller;
		},

		registerView : function(name, view)
		{
			this.views[name] = view;
		},

		registerService : function(name, service)
		{
			this.services[name] = service;
		},

		registerModel : function(name, service)
		{
			this.models[name] = service;
		},

		getController : function(name)
		{
			return this.controllers[name];
		},

		getModel : function(name)
		{
			return this.models[name];
		},

		getView : function(name)
		{
			return this.views[name];
		}
	})
});

SAPPHIRE.application = new Sapphire.Application();

//===========================================================================================
// Group: Callbacks
//===========================================================================================
/**********************************************************************************'
	Function: showEffect

	When you call <setPageEffects> or <setDialogEffects> your showEffect
	callback should look like this.

	> showEffect: function(oldPage, newPage, callback)

	Parameters:
		oldPage		- the jQuery selector for the page being hidden
		newPage     - the JQuery selector of the page or dialog being shown
		callback    - a function to call when the effect has finished

*/


/**********************************************************************************'
	Function: hideEffect

	When you call <setPageEffects> or <setDialogEffects> your showEffect
	callback should look like this.

	> hideEffect: function(node, callback)

	Parameters:
		node        - the JQuery selector of the page or dialog being shown
		callback    - a function to call when the effect has finished
*/

