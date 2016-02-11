var CONFIG;
var Q = require('q');
var fs = require('fs');
var crypto = require('crypto');
var paths = require('./routePaths');
var cachedHashes = $H({});
var path = require('path');

exports.Mangler = new Class({
	initialize : function()
	{
		this.urls = $H({});
		this.hashes = $H({});
		if (!CONFIG) CONFIG = require('./config').CONFIG;
	},

	start : function()
	{
		if (!CONFIG.builderCache)
		{
			this.urls = $H({});
			this.hashes = $H({});
		}
	},

	md5Hash : function(data)
	{
		var md5sum = crypto.createHash('md5');
		md5sum.update(data);
		return md5sum.digest('hex');
	},

	hashUrl : function(url)
	{
		url = url.split('?')[0];
		var deferred = Q.defer();
		var filename = paths.urlPathToFilePath(url);
		var modifiedDate = Date.now();

		if (cachedHashes[url] != undefined && CONFIG.builderCache)
		{
			this.hashes.set(url, cachedHashes[url]);
			return Q(this.hashes.get(url));
		}

		fs.stat(filename, function(err, stat)
		{
			if (err)
			{
				deferred.resolve(null);
			}
			else
			{
				modifiedDate = new Date(stat.mtime).getTime()

				var hash = modifiedDate.toString().pad(13, '0', 'left');
				this.hashes.set(url, hash);
				cachedHashes[url] = hash;
				deferred.resolve(this.hashes.get(url));
			}
		}.bind(this));

		return deferred.promise;
	},

	hashUrls : function(urls)
	{
		var promises = [];

		urls.each(function(url)
		{
			promises.push(this.hashUrl(url));
		}, this);

		return Q.all(promises);
	},

	mangleUrls : function(urls)
	{
		return this.hashUrls(urls);
	},

	mangle : function(name)
	{
		if (name === '') return '';
		if (name.indexOf(':') !== -1) return name;
		var prefix = CONFIG.manglePrefix?CONFIG.manglePrefix:'';
		var hash = this.hashes.get(name);
		var url = '';
		var filename = path.basename(name);
		var parts = filename.split('.');
		var ext = parts.pop();
		if (hash)
		{
			parts.push('v' + hash);
		}
		parts.push(ext);
		filename = parts.join('.');

		if (name.indexOf(prefix) != 0) url += prefix + name;
		else url = name;

		parts = url.split('/');
		parts.pop();
		parts.push(filename);
		url = parts.join('/');

		return url;
	},

	demangle : function(name)
	{
		var prefix = CONFIG.manglePrefix?CONFIG.manglePrefix:'';
		if (prefix != '')
		{
			if (name.indexOf(prefix) == 0)
				name = name.substring(prefix.length);
		}

		name = name.replace(/\.v[0-9]{13}\./, '.');

		return name;
	},

});

