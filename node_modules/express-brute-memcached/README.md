express-brute-memcached
=======================
[![Build Status](https://travis-ci.org/AdamPflug/express-brute-memcached.png?branch=master)](https://travis-ci.org/AdamPflug/express-brute-memcached)
[![NPM version](https://badge.fury.io/js/express-brute-memcached.png)](http://badge.fury.io/js/express-brute-memcached)

A memcached store for [express-brute](https://github.com/AdamPflug/express-brute)

Installation
------------
  via npm:

      $ npm install express-brute-memcached

Usage
-----
``` js
var ExpressBrute = require('express-brute'),
	MemcachedStore = require('express-brute-memcached');

var store = new MemcachedStore('127.0.0.1');
var bruteforce = new ExpressBrute(store);

app.post('/auth',
	bruteforce.prevent, // error 403 if we hit this route too often
	function (req, res, next) {
		res.send('Success!');
	}
);
```

Options
-------
- `hosts` Memcached servers locations, can by string, array, or hash.
- `options`
	- `prefix`       An optional prefix for each memcache key, in case you are sharing
	                 your memcached servers with something generating its own keys.
	- ...            The rest of the options will be passed directly to the node-memcached constructor.



For details see [node-memcached](http://github.com/3rd-Eden/node-memcached).
