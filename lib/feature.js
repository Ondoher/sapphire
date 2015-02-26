exports.Feature = new Class({
	initialize : function(app, path)
	{
		this.app = app;
		this.path = path;
	},

	fixPath : function(path)
	{
		if (path.charAt(0) != '/') return this.path + path;
		else return path;
	},

/**********************************************************************************
	Method: addState

	Call this method to add a global state css class to the body tag

	Paramters:
		state		- the css class name
*/
	addState : function(state)
	{
		this.app.addState(state);
	},

/**********************************************************************************
Method: addVariable

Call this method to add a javascript variable to the application. These
variables will be output to the namespace specified in the constructor

Parameters:
	key			- the name of the variable
	value		- the variable to set. This should be a native type, not a JSON
					encoded string
*/
	addVariable : function(key, value)
	{
		this.app.addVariable(key, value);
	},

/**********************************************************************************
Method: addUrl

Call this method to add a url to the list of managed urls. th eurl's will
be availabel in <namespace>.urls

Parameters:
	name		- the name of the url
	value		- the url itself
*/
	addUrl : function(name, value)
	{
		this.app.addUrl(name, value);
	},

/**********************************************************************************
Method: addConfig

Call this method to add a javascript variable that is used as part of configuration.
These variables will be output before the javascript is included.

Parameters:
	key			- the name of the variable
	value		- the variable to set. This should be a php type, not a JSON
					encoded string
*/
	addConfig : function(key, value)
	{
		this.app.addConfig(key, value);
	},

/**********************************************************************************
Method: addLink

Call this method to add a <link> tag to the output html

Parameters:
	rel			- the rel attribute of the link tag
	href		- the href link for the link tag
	type		- the type of the link tab
*/
	addLink : function(rel, href, type)
	{
		this.app.addLink(rel, href, type);
	},

/**********************************************************************************
Method: addTemplates

Call this method to add html files that contain global templates.
By default the templates will follow the body

Parameters:
	file			- the name of the templates file. It will be relative to root of apps
*/
	addTemplates : function(file)
	{
		file = this.fixPath(file);
		if (file.indexOf('apps/') == -1) file = 'apps' + file;
		this.app.addTemplates(file);
	},

/**********************************************************************************
Method: addFileReplacement

Call this method to add a replacement that is a file. This will replace a {<name>}
variable in the output html with the contents of a file

Parameters:
	name			- the name of the {} variable
	value			- the path to the file of html
*/
	addFileReplacement : function(name, file)
	{
		file = this.fixPath(file);
		if (file.indexOf('apps/') == -1) file = 'apps' + file;
		this.app.addFileReplacement(name, file);
	},

/**********************************************************************************
Method: addStringReplacement

Call this method to add a replacement that is a string. This will replace a {<name>}
string in the output html

Parameters:
	name			- the name of the {} variable
	value			- the block of html to use
*/
	addStringReplacement : function(name, value)
	{
		this.app.addStringReplacement(name, value)
	},

/**********************************************************************************
Method: addJS

Call this method to add a JavaScript file to be loaded in main body of the
application. You do not need to add JavaScript files that are specific to
pages of the application.

Parameters:
	files			- list of javascript files to add
	dontBust		- true if the js file should not be run through the cache
					busting logic
*/
	addJS : function(files, raw)
	{
		raw = (raw == undefined)?false:raw;

		if (!raw)
		{
			files.each(function(name, idx)
			{
				files[idx] = this.fixPath(name);
			}, this);
		}

		this.app.addJS(files, raw);
	},

/**********************************************************************************
Method: addCSS

Call this method to add a CSS file to be loaded in main body of the application.
You do not need to add CSS files that are specific to pages of the
application.

Parameters:
	file			- the name of the css file. It will be relative to the
					/css folder
*/
	addCSS : function(files, dontBust)
	{
		dontBust = (dontBust == undefined)?false:dontBust;

		files.each(function(name, idx)
		{
			files[idx] = this.fixPath(name);
		}, this);

		this.app.addCSS(files, dontBust);
	},

/**********************************************************************************
Method: addPage

Call this method to add a page to the application. Pages will be loaded on demand
and will appear in the html element with the id of "pages".

Pages are specified using a data structure with the following members

Spec:
	name		- the name of the page as it will be referenced in JavaScript.
				see <Application>
	url			- the path to the page template.
 	javascript	- an array of javascript files to be loaded before the page is
				displayed. These javascript files can assume that the dom has
				been loaded with the page content.
	css			- an array of css files to be loade for this page
	dontPrune	- set this to true to prevent the page from being removed from
				the dom when a new page is loaded. This is typically needed
				for pages with flash content

Parameters:
	spec		- the specification for this page
*/
	addPage : function(spec)
	{
		spec = $H(spec);

		spec.url = this.fixPath(spec.url);

		spec.javascript.each(function(name, index)
		{
			spec.javascript[index] = this.fixPath(name);
		}, this);

		spec.css.each(function(name, index)
		{
			spec.css[index] = this.fixPath(name);
		}, this);

		this.app.addPage(spec);
	},

/**********************************************************************************
Method: addDialog

Call this method to add a dialog to the application. Dialogs will be loaded on demand
and will appear in the html element with the id of "dialogs".

Dialogs are specified using a data structure with the following members

Spec:
	name				- the name of the dialog as it will be referenced in JavaScript.
						see <Application>
	url					- the path to the dialog template. This file will be relative to
						views/dialogs. You need to include the extension of the dialog
						file, but .html is recommended
	javascript			- an array of javascript files to be loaded before the dialog is
						displayed. These javascript files can assume that the dom has
						been loaded with the dialog content.
	css					- an array of css files to be loade for this dialog

Parameters:
	spec				- the specification for this dialog
*/
	addDialog : function(spec)
	{
		spec = $H(spec);

		spec.url = this.fixPath(spec.url);

		spec.javascript.each(function(name, index)
		{
			spec.javascript[index] = this.fixPath(name);
		}, this);

		spec.css.each(function(name, index)
		{
			spec.css[index] = this.fixPath(name);
		}, this);

		this.app.addDialog(spec);
	},

/**********************************************************************************
Method: addPanel

Call this method to add a loadable panel to the application. Panels are sub-parts of
an application that are not pages or dialogs, but managed separately. For instance,
a page may need many sub-parts, each one standing alone.

Panels are specified using a data structure with the following members

Spec:
	name				- the name of the panel as it will be referenced in JavaScript.
						  see <Application>
	url					- the path to the panel template. This file will be relative to
						  views/dialogs. You need to include the extension of the panel
						  file, but .html is recommended
	javascript			- an array of javascript files to be loaded before the dialog is
						  displayed. These javascript files can assume that the dom has
						  been loaded with the dialog content.
	css					- an array of css files to be loaded for this dialog

Parameters:
	setName				- a name of a panel set where this panel will be used. Must be a
						  a valid JavaScript identifier.
	spec				- the specification for this panel
*/
	addPanel : function(setName, spec)
	{
		spec = $H(spec);

		spec.url = this.fixPath(spec.url);

		spec.javascript.each(function(name, index)
		{
			spec.javascript[index] = this.fixPath(name);
		}, this);

		spec.css.each(function(name, index)
		{
			spec.css[index] = this.fixPath(name);
		}, this);

		this.app.addPanel(setName, spec);
	},

/**********************************************************************************
Method: setTitle

Call this method to set the title of the application. This will appear in the <title> tag
of the output html

Parameters:
	title				- the title string
*/
	setTitle : function(title)
	{
		this.app.setTitle(title);
	},

/**********************************************************************************
Method: addMetadata

Call this method to add metadata to the application. This will appear in a <metadata> tag.

Parameters:
	name 		- the name of the metadata variable
	content 	- the value of the metadata variable
*/
	addMetadata : function(name, content)
	{
		this.app.addMetaData(name, content);
	}
});
