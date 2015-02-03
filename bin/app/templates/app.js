var Q = require("q");
var application = require('application.js');
var config = require('config/config').CONFIG;

function main(req, res, app)
{
	app.addCSS([
		'/{app}/assets/css/{app}.css',
		'/{app}/assets/css/dialogs.css',
	]);

	app.addJS([
		'/assets/js/lib/history.js',
		'/assets/js/lib/translate.js',
		'/assets/js/lib/templates.js',
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
	app.setBody('apps/{app}/templates/chrome.html');

	var promise = main(req, res, app)
		.then(function(app)
		{
			app.getHTML(callback);
		}).done();
}
