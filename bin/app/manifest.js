module.exports = {
	files: [
		{path: 'apps/{app}/{app}.js', template: 'app.js'},

		'/{app}/assets/js/Views/Dialog.js',
		'/{app}/assets/js/Controllers/Dialog.js',
		'/{app}/assets/js/Views/Canvas.js',
		'/{app}/assets/js/Views/Chrome.js',
		'/{app}/assets/js/Controllers/Chrome.js',
	]);


	return Q(app)
}

exports.buildApplication = function(req, res, callback)
{
	var session = req.session.get();
	var app = new application.Application('{APP}');

	app.setTitle('{App}');
	app.setBody('apps/{app}/templates/body.html');


	],
}
