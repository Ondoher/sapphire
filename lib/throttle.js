/**********************************************************************************
	File: throttle.js

	Uses ExpressBrute (https://github.com/AdamPflug/express-brute) to
	limit the number of POST requests to a path

	NOTE: A few changes were made to ExpressBrute to make it compatible with Sapphire

  Params:
    options    - Object that includes the key "path" (required),
								 "method" (optional) and
								 ExpressBrute options (optional)

	If path is set to "services", then any request that includes "/services/"
	in the path will be throttled

	If method is set to "GET", then any GET requests to a path will be throttled.
	Only "POST" requests will be throttled by default

	For ExpressBrute options, see: https://github.com/AdamPflug/express-brute


**********************************************************************************/
var mootools = require('./mootools').apply(GLOBAL);
var ExpressBrute = require('express-brute');
var MemcachedStore = require('express-brute-memcached')
var CONFIG = require('./config').CONFIG;
var Q = require('q');
var url = require('url');

module.exports = function throttle(options) {
	options = options || {};
	var path = options.path;
	var method = options.method || 'POST';
	var mcServer = CONFIG.mcServer?CONFIG.mcServer:'localhost:11211';
	options.freeRetries = options.freeRetries || 6;
	options.failCallback = function(req, res, next, nextValidRequestDate) {
      res.writeHead(429, {'Content-Type': 'text/plain'});
      res.end();
  };

	options.lifetime = options.lifetime || 10800;
	options.proxyDepth = options.proxyDepth || 4;
	options.whiteList = [];

	var store = new MemcachedStore(mcServer);
	var bruteforce = new ExpressBrute(store, options);

	return function(req, res, next)
	{
		var paths = url.parse(req.url, true).pathname.split('/');
		var ipAddress = (req.headers['x-forwarded-for'] || '').split(',')[0]  ||
			req.connection.remoteAddress;
		var internalIps = CONFIG.internalIps || [];
		var internalIp = new RegExp(internalIps.join('|')).test(ipAddress);
		if (req.method == method && paths.indexOf(path) != -1 && ! internalIp)
		{
			bruteforce.prevent(req, res, next);
		}

		else next();
	}
}
