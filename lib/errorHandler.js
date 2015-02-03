var domain = require('domain');

module.exports = function () {
	return function (req, res, next) {
		req.domain = domain.create();

		res.on('close', function () {
			req.domain.dispose();
		});

		res.on('finish', function () {
			req.domain.dispose();
		});

		req.domain.on('error', function (err) {

			//console.error('caught domain error---------------------------------------');
			//console.log(err.stack);
			// Once a domain is disposed, further errors from the emitters in that set will be ignored.
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({success: false, result: err}));
			console.log(err.stack);
			throw err;
			//next(err);
		});

		req.domain.run(next);
	};
};
