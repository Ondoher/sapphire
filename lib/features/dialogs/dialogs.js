var Q = require('q');

module.exports = function(req, res, app)
{
	app.addJS([
		'/assets/features/dialogs/assets/js/Controllers/Dialog.js',
		'/assets/features/dialogs/assets/js/Views/Dialogs.js',
		'/assets/features/dialogs/assets/js/Views/Dialog.js'
	]);

	app.addCSS([
		'/assets/features/dialogs/assets/css/dialogs.css'
	]);

	return Q(app);
}
