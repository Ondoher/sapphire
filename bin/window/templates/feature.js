var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var {nAme} = new Feature(app, '/{path}/windows/{name}/');

	{nAme}.addWindow({
		name: '{name}',
		url: 'assets/windows/{name}.html',
		javascript: ['assets/js/Controllers/{Name}.js', 'assets/js/Views/{Name}.js'],
		css: ['assets/css/{name}.css']
	});

	return Q(app);
}
