var Q = require('q');
var Feature = require('sapphire-express').Feature;
var CONFIG = require('sapphire-express').CONFIG;
var path = require('path');
var fs = require('fs');
var header = require('../header/header.js');
var footer = require('../footer/footer.js');
var paths = require('routePaths');

var thisDir = unDos(path.dirname(module.filename) + '/');
var fileCache = $H({});

function unDos(filepath)
{
	filepath = path.resolve(filepath);

	if (filepath.indexOf(':') == 1)
	{
		filepath = filepath.slice(2);
	}

  	filepath = filepath.replace(/\\/g, '/');
	return filepath;
}


var SiteServer = new Class({
	initialize : function(req, res, root, appName)
	{
		this.req = req;
		this.res = res;
		this.appName = appName;
		this.root = root;
	},

	stripTrailingSlash : function(str)
	{
	    if(str.substr(-1) == '/') return str.substr(0, str.length - 1);
	    return str;
	},

	exists : function(file)
	{
		var deferred = Q.defer();

		fs.exists(file, function(exists)
		{
			deferred.resolve(exists);
		}.bind(this));

		return deferred.promise;
	},

	checkOne : function(file)
	{
		var deferred = Q.defer();

		fs.exists(file, function(exists)
		{
			if (!exists) deferred.resolve(null);
			else deferred.resolve(file);
		}.bind(this));

		return deferred.promise;
	},

	findFile : function(file)
	{
		var ext = path.extname(file);
		var originalFile = file;

		if (ext == '') file = this.stripTrailingSlash(file) + '/index.html';

		return this.checkOne(file)
			.then(function(result)
			{
				if (result != null) return Q(result);
				if (ext != '') return Q(null);
				file = originalFile + '.html';
				return this.checkOne(file);
			}.bind(this))

	},

	mergeManifestSections : function(sectionName, base, newManifest)
	{
		var section = newManifest[sectionName];
		if (!section) return base;

	// since everything builds backwards, put the existing stuff at the end of the arrays so they come last in the list
		var baseJS = (base.js !== undefined)?base.js:[];
		var newJS = (section.js !== undefined)?section.js:[];

		var baseCSS = (base.css !== undefined)?base.css:[];
		var newCSS = (section.css !== undefined)?section.css:[];

		var baseAsyncCSS = (base.asyncCss !== undefined)?base.asyncCss:[];
		var newAsyncCSS = (section.asyncCss !== undefined)?section.asyncCss:[];

		var baseFeatures = (base.features !== undefined)?base.features:[];
		var newFeatures = (section.features !== undefined)?section.features:[];

		var baseIncludes = (base.includes !== undefined)?base.includes:{};
		var newIncludes = (section.includes !== undefined)?section.includes:{};

		var baseVariables = (base.variables !== undefined)?base.variables:{};
		var newVariables = (section.variables !== undefined)?section.variables:{};

		var baseStates = (base.states !== undefined)?base.states:[];
		var newStates = (section.states !== undefined)?section.states:[];

		base.js = newJS.concat(baseJS).clean().unique();
		base.css = newCSS.concat(baseCSS).clean().unique();
		base.asyncCss = newAsyncCSS.concat(baseAsyncCSS).clean().unique();
		base.features = newFeatures.concat(baseFeatures).clean().unique();
		base.states = newStates.concat(baseStates).clean().unique();

		base.includes = Object.merge({}, newIncludes, baseIncludes);
		base.variables = Object.merge({}, newVariables, baseVariables);

		if (base.title === undefined) base.title = section.title;
		if (base.body === undefined) base.body = section.body;

		return base;
	},

	mergeManifests : function(sectionName, base, newManifest)
	{
		if (!newManifest) return base;

		if (sectionName) base = this.mergeManifestSections(sectionName, base, newManifest);
		base = this.mergeManifestSections('all', base, newManifest);

		return base;
	},

	collectManifest : function(file, manifest)
	{
		var deferred = Q.defer();
		var directory;
		var manifestFile;
		var ext = path.extname(file);
		var paths;
		var top = ext != '';
		var section = null;

		manifest = (manifest !== undefined)?manifest:{};

		if (top)
		{
			directory = path.dirname(file);
			manifestFile = unDos(path.join(directory, 'manifest.js'));
			section = path.basename(file, '.html');
		}
		else
		{
			paths = file.split('/');
			if (file.substr(-1) === '/') paths.pop();
			directory = paths.join('/');
			manifestFile = unDos(path.join(directory, 'manifest.js'));
		}

		return this.exists(manifestFile)
			.then(function(exists)
			{
				if (exists)
				{
					var subManifest = require(manifestFile)
					manifest = this.mergeManifests(section, manifest, subManifest);
				}

				var paths = manifestFile.split('/');
				paths.pop();
				paths.pop();

				var newDirectory = paths.join('/');

				if (newDirectory.length >= this.root.length)
					return this.collectManifest(newDirectory, manifest);
				else
					return Q(manifest);
			}.bind(this));
	},


	serveFeatures : function(features, app)
	{
		if (!features || features.length == 0) return Q(app);

		var feature = require(features[0]);
		features.splice(0, 1);

		return feature(this.req, this.res, app)
			.then(this.serveFeatures.bind(this, features));
	},

	serveFile : function(app, file)
	{
		app.addFileReplacement('content', file, true);
		return this.collectManifest(file)
			.then(function(manifest)
			{
				return this.serveFeatures(manifest.features, app)
					.then(function(app)
					{
						if (manifest.js) app.addJS(manifest.js);
						if (manifest.css) app.addCSS(manifest.css);
						if (manifest.asyncCss) app.addAsyncCSS(manifest.asyncCss);
						if (manifest.title) app.setTitle(manifest.title);
						if (manifest.body) app.setBody(manifest.body);

						var includes = $H(manifest.includes);
						includes.each(function(value, key)
						{
							app.addFileReplacement(key, value);
						}, this);

						var variables = $H(manifest.variables);
						variables.each(function(value, key)
						{
							app.addVariable(key, value);
						}, this);

						if (manifest.states) {
							manifest.states.each(function(state)
							{
								app.addState(state);
							}, this);
						};

						return Q(app);
					}.bind(this))
			}.bind(this));
	},

	build : function(app)
	{
		var content = new Feature(app, thisDir);
		var url = this.req.url.split('.')[0];
		url = url.split('?')[0];

		if (url.indexOf(this.req.defaultApp) == 0)
		{
			url = url.substr(this.req.defaultApp.length);
		}
		if (url.indexOf('/' + this.appName) == 0)
		{
			url = url.substr(this.appName.length + 1);
		}

		var file = path.resolve(this.root + url);

		return this.findFile(file)
			.then(function(file)
			{
				if (file == null) file = this.root + '/404.html';
				file = unDos(file);
				return this.serveFile(app, file)
			}.bind(this));
		}
});

module.exports = function(req, res, root, appName, app)
{
	var server = new SiteServer(req, res, root, appName);
	app.addMetadata('viewport', 'width=1024');
	return server.build(app);
}

