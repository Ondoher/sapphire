var Q = require('q');
var sapphire = require('sapphire-express');

function main(req, res, app)
{
	app.addCSS([
		'/{app}/assets/css/{app}.css',
	]);

	app.addJS([
		'/assets/js/lib/translate.js',
		'/assets/js/lib/templates.js',
		'/{app}/assets/js/Views/{App}.js',
		'/{app}/assets/js/Controllers/{App}.js',
	]);


	return Q(app)
}

exports.getApplication = function(req, res)
{
	var session = req.session.get();
	var app = new sapphire.Application('{APP}', req, res);

	app.setTitle('{App}');
	app.setBody('apps/{path}/templates/body.html');
	app.setMaster('apps/{path}/templates/master.html');

	return main(req, res, app)
		.then(sapphire.features.animator.bind(sapphire.features.animator, req, res))
		.then(sapphire.features.dialogs.bind(sapphire.features.dialogs, req, res))
		.then(function(app)
		{
			return Q(app);
		})
}
