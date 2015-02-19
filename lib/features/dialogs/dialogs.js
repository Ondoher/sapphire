var Q = require('q');
var Feature = require('feature').Feature;

module.exports = function(req, res, app)
{
	var dialogs = new Feature(app, '/common/features/dialogs/');

		dialogs.addJS([
		'assets/js/Controllers/Dialog.js',
		'assets/js/Views/Dialogs.js',
		'assets/js/Views/Dialog.js'
	]);

		dialogs.addCSS([
		'assets/css/dialogs.css'
	]);

	return Q(app);
}
