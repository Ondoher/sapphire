Package('Sapphire', {

/**********************************************************************************
	Class: Loader

	Use this class to dynalically load content from a server, It will load Scripts,
	CSS and Markup

	Extends:
		<Eventer>

	See Also:
		<Application>, <PageManager>
*/

	Loader : new Class({
		Extends : Sapphire.Eventer,

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
		addLoadedScript : function(files)
		{
			files.each(function(file)
			{
				this.loadedScripts.push(file);
			}, this);

		},

	/**********************************************************************************
		Method: addLoadedCSS

		call this method to add a style sheet to the list of already loaded style sheets

		Parameters:
			file			- the file to be added
	*/
		addLoadedCSS : function(files)
		{
			files.each(function(file)
			{
				this.loadedCSS.push(file)
			}, this);
		},


		scriptLoaded : function(list, deferred)
		{
		// wait a timer tick for states to settle down
			var id = setTimeout(function()
			{
				this.loadNextScript(list, deferred);
			}.bind(this), 1);
		},

		loadScript : function(url)
		{
			var deferred = Q.defer();
			if(!url || !(typeof url === 'string')){return};

			var script = document.createElement('script');

		//if this is IE8 and below, handle onload differently
			if(typeof document.attachEvent === "object")
			{
				script.onreadystatechange = function()
				{
				//once the script is loaded resolve the promise
					if (script.readyState === 'loaded' || script.readyState == 'complete')
					{
						deferred.resolve(true);
					};
				};
			}
			else
			{
			//this is not IE8 and below, so we can actually use onload
				script.onload = function()
				{
				//once the script is loaded resolve the promise
					deferred.resolve(true);
				};
				script.onerror = function()
				{
				//once the script is loaded resolve the promise
					deferred.resolve(true);
				};
			};

		//create the script and add it to the DOM
			script.src = url;
			document.getElementsByTagName('head')[0].appendChild(script);

			return deferred.promise;
		},

	/**********************************************************************************
		Method: loadNextScript

		<loadScripts> calls this method to hot load the next script in the list.
		resultant script will be loaded into the <head> of the document.

		Parameters:
			list			- the list of remaining script files. The first in the list
							  will be removed and loaded. When done, this method will
							  be called again until the list is empty
	*/
		loadNextScript : function(list)
		{
			if (list.length == 0) return Q(true);

			script = list[0];
			list.splice(0, 1);

			this.addLoadedScript([script]);

			return this.loadScript(script)
				.delay(1)
				.then(this.loadNextScript.bind(this, list))
		},

	/**********************************************************************************
		Method: loadScripts

		call this method to hot load an array of javascript files. The resultant
		javascript will be loaded into the <head> of the document.

		Parameters:
			scripts			- an array of javascript files
			callback		- The function to call when the markup has CSS loaded

		Returns:
			a promise that will be fulfilled when the markup has been loaded
	*/
		loadScripts : function(scripts, callback)
		{
			scripts = this.getUnloadedScripts(scripts);

			return this.loadNextScript(scripts);
		},

	/**********************************************************************************
		Method: loadCSS

		Call this method to hot load the a list CSS filer. The resultant CSS will be
		loaded into the <head> of the document.

		Parameters:
			css				- an array of CSS files

		Returns:
			a promise that will be fulfilled when the markup has been loaded
	*/
		loadCSS : function(css, callback)
		{
			css = this.getUnloadedCSS(css);
			css.each(function(css)
			{
				this.addLoadedCSS([css]); // make global loader
				if (document.createStyleSheet)
				{
					document.createStyleSheet(css);
				}
				else
				{
					$('head').append($('<link rel="stylesheet" type="text/css">').attr('href', css));
				}

			}, this);

			return Q(true);
		},

	/**********************************************************************************
		Method: loadMarkup

		The page manager calls this method to hot load the page html. The
		resultant dom elements for the markup will be placed in page.selector. The
		whole thing will be wrapped in a div

		Parameters:
			page			- the url to the page. For cross domain purposes this
							  must be on the same domain as the application
		Returns:
			a promise that will be fulfilled when the markup has been loaded
	*/
		loadMarkup : function(page)
		{
			var deferred = Q.defer();

			page.selector = $('<div>');
			$.ajax({
				type: 'GET',
				url: page.url,
				success: function(response, status, xhr)
				{
					page.selector.attr('id', page.name);
					page.selector[0].innerHTML = response;
					deferred.resolve(true);
				}.bind(this)
			});

			return deferred.promise;
		}
	})
});
SAPPHIRE.loader = new Sapphire.Loader();
