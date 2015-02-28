var Q = require('q');
var Feature = require('sapphire-express').Feature;

module.exports = function(req, res, app)
{
	var {nAme} = new Feature(app, '/{path}/dialogs/{name}/');

	{nAme}.addDialog({
		name: '{name}',
		url: 'assets/dialogs/{name}.html',
		javascript: ['assets/js/Controllers/{Name}.js', 'assets/js/Views/{Name}.js'],
		css: ['assets/css/{name}.css']
	});

	return Q(app);
}
