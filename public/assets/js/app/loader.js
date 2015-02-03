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


		scriptLoaded : function(list, callback)
		{
			var id = setTimeout(function()
			{
				this.loadNextScript(list, callback);
			}.bind(this), 1);
		},

        loadScript : function(url, callback)
		{
//			if (url.indexOf('?') != -1)
//				url += '&r=' + Math.floor(Math.random() * 10000);
//			else
//				url += '?r=' + Math.floor(Math.random() * 10000);
//			$.getScript(url, function()
//			{
//				console.log('script loaded');
//				console.log(JSON.stringify(arguments, null, '  '));
//				callback();
//			});
//			return;

            if(!url || !(typeof url === 'string')){return};
            var script = document.createElement('script');
            //if this is IE8 and below, handle onload differently
            if(typeof document.attachEvent === "object"){
				//if (url.indexOf('?') != -1)
				//	url += '&r=' + Math.floor(Math.random() * 10000);
				//else
				//	url += '?r=' + Math.floor(Math.random() * 10000);
                script.onreadystatechange = function(){
                    //once the script is loaded, run the callback
                    if (script.readyState === 'loaded' || script.readyState == 'complete'){
                        if (callback){callback()};
                    };
                };
            } else {
                //this is not IE8 and below, so we can actually use onload
                script.onload = function(){
                    //once the script is loaded, run the callback
                    if (callback){callback()};
                };
            };
            //create the script and add it to the DOM
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
		},

/*

		loadScript : function (url, callback)
		{
			console.log('loadScript');
			console.log(url);
//			$.getScript(url, callback);
//			return;

			var script = $('<script></script>');
			if (typeof script.onreadystatechange != 'undefined')
			{
				script.addEvent('readystatechange', function()
				{
					if (['loaded', 'complete'].contains(this.readyState) && callback) callback();
				}).bind(this);
			}
			else
			{
				script.on('load', function()
				{
					if (callback) callback();
				}.bind(this));
			}
			script.attr('src', url);
			$('head')[0].appendChild(script[0]);
	//		$('head').append(script);

		},
  */

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
		loadNextScript : function(list, callback)
		{
			if (list.length == 0)
			{
				if (callback) callback();
				return;
			}

			script = list[0];
			list.splice(0, 1);

			this.addLoadedScript(script); // make global loader
			this.loadScript(script, this.scriptLoaded.bind(this, list, callback));
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

			this.loadNextScript(scripts, function()
			{
				if (callback) callback();
			});
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
				if (callback) callback();
				return;
			}

			var css = list[0];
			var one = list.shift();

			//this.loadNextCSS.delay(1, this, [list, callback, css]);
			this.loadNextCSS(list, callback);
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

			css.each(function(css)
			{
				this.addLoadedCSS(css); // make global loader
				if (document.createStyleSheet) {
					document.createStyleSheet(css);
				}
				else {
					$('head').append($('<link rel="stylesheet" type="text/css">').attr('href', css));
				}

			}, this);

			//this.loadNextCSS(css, callback);
			if (callback) callback();
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
			//page.selector = $('<div>')
			page.selector = $('<div>');
				//page.selector.load(page.url, function()
				$.ajax({
					type: 'GET',
					url: page.url,
					success: function(response, status, xhr)
					{
						page.selector.attr('id', page.name);
						page.selector[0].innerHTML = response;
						callback();
					}.bind(this)
				});
		}
	})
});
SAPPHIRE.loader = new Sapphire.Loader();
