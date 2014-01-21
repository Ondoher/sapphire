Package('Spa', {

/**********************************************************************************
	Class: Loader

	Use this class to dynalically load content from a server, It will load Scripts,
	CSS and Markup

	Extends:
		<EventManager>

	See Also:
		<Application>, <PageManager>
*/

	Loader : new Class({
		Extends : Spa.EventManager,

	/**********************************************************************************
		Constructor: initialize

		constructor for the loader class

		Parameters:
			list			- the list to be trimmed

		Returns:
			an array of javascript files that have not yet been loaded
	*/
		initialize : function()
		{
			this.loadedCSS = [];
			this.loadedScripts = [];
		},

	/**********************************************************************************
		Method: getUnloadedScripts

		call this method remove all the already loaded javascript files from the give list

		Parameters:
			list			- the list to be trimmed

		Returns:
			an array of javascript files that have not yet been loaded
	*/
		getUnloadedScripts : function(list)
		{
			var result = [];

			list.each(function(file)
			{
				if (this.loadedScripts.indexOf(file) == -1) result.push(file);
			}, this);

			return result;
		},

	/**********************************************************************************
		Method: getUnloadedCSS

		call this method remove all the already loaded style sheets from the give list

		Parameters:
			list			- the list to be trimmed

		Returns:
			an array of CSS files that have not yet been loaded
	*/
		getUnloadedCSS : function(list)
		{
			var result = [];

			list.each(function(file)
			{
				if (this.loadedCSS.indexOf(file) == -1) result.push(file);
			}, this);

			return result;
		},

	/**********************************************************************************
		Method: addLoadedScript

		call this method to add a style sheet to the list of already loaded style sheets

		Parameters:
			file			- the file to be added
	*/
		addLoadedScript : function(file)
		{
			this.loadedScripts.push(file);
		},

	/**********************************************************************************
		Method: addLoadedCSS

		call this method to add a style sheet to the list of already loaded style sheets

		Parameters:
			file			- the file to be added
	*/
		addLoadedCSS : function(file)
		{
			this.loadedCSS.push(file);
		},

		loadScript : function (url, callback)
		{
			console.log('Loader', 'loadScript', url);
			var script = $('<script></script>');
			if (typeof script.onreadystatechange != 'undefined')
			{
				script.addEvent('readystatechange', function()
				{
					if (['loaded', 'complete'].contains(this.readyState)) callback();
				}).bind(this);
			}
			else
			{
				console.log('Loader', 'loadScript', 'using onload');
				script.on('load', function()
				{
					console.log('Loader', 'loadScript', 'loaded', url);
					callback();
				}.bind(this));
			}
			script.attr('src', url);
			$('head')[0].appendChild(script[0]);
	//		$('head').append(script);
		},

	/**********************************************************************************
		Method: loadNextScript

		<loadScripts> calls this method to hot load the next script in the list.
		resultant script will be loaded into the <head> of the document.

		Parameters:
			list			- the list of remaining script files. The first in the list
							  will be removed and loaded. When done, this method will
							  be called again until the list is empty
			callback     	- The function to call when the all the scripts have been
			script     		- The name of the last script loaded
	*/
		loadNextScript : function(list, callback, script)
		{
			if (list.length == 0)
			{
				callback();
				return;
				console.log('Loader', 'loadNextScript', 'done');
			}

			script = list[0];
			list.splice(0, 1);

			console.log('Loader', 'loadNextScript', script);

			this.addLoadedScript(script); // make global loader

		// this will never do, I must fix
	/*
			$(document).ajaxError(function(e, xhr, settings, exception) {
			    console.log('error in: ' + settings.url + ' \n'+'error:\n' + exception );
			});
			$.getScript(script, this.loadNextScript.bind(this, list, callback, script));
	*/

			this.loadScript(script, this.loadNextScript.bind(this, list, callback, script));
		},

	/**********************************************************************************
		Method: loadScripts

		call this method to hot load an array of javascript files. The resultant
		javascript will be loaded into the <head> of the document.

		Parameters:
			CSS				- an array of CSS files
			callback     	- The function to call when the markup has CSS loaded
	*/
		loadScripts : function(scripts, callback)
		{
			scripts = this.getUnloadedScripts(scripts);

			this.loadNextScript(scripts, callback);
		},

	/**********************************************************************************
		Method: loadNextCSS

		<loadCSS> calls this method to hot load the next CSS in the list.
		resultant CSS will be loaded into the <head> of the document.

		Parameters:
			list			- the list of remaining css files. The first in the list
							  will be removed and loaded. When done, this method will
							  be called again until the list is empty
			callback     	- The function to call when the all the CSS has been
	*/
		loadNextCSS : function(list, callback)
		{
			if (list.length == 0)
			{
				callback();
				return;
				console.log('Loader', 'loadNextCSS', 'done');
			}

			css = list[0];
			list.splice(0, 1);

			$('head').append($('<link rel="stylesheet" type="text/css">').attr('href', css));

			this.loadNextCSS.delay(50, this, [list, callback, css]);
		},

	/**********************************************************************************
		Method: loadCSS

		Call this method to hot load the a list CSS filer. The resultant CSS will be
		loaded into the <head> of the document.

		Parameters:
			CSS				- an array of CSS files
			callback     	- The function to call when all the CSS has been loaded
	*/
		loadCSS : function(css, callback)
		{
			css = this.getUnloadedCSS(css);

			this.loadNextCSS(css, callback);
		},

	/**********************************************************************************
		Method: loadMarkup

		The page manager calls this method to hot load the page html. The
		resultant dom elements for the markup will be placed in page.selector. The
		whole thing will be wrapped in a div

		Parameters:
			page			- the url to the page. For cross domain purposes this
							  must be on the same domain as the application
			callback     	- The function to call when the markup has been loaded
	*/
		loadMarkup : function(page, callback)
		{
			page.selector = $('<div>').load(page.url, callback);
		}
	})
});
SPA.loader = new Spa.Loader();
