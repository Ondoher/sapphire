var Q = require('q');

module.exports = function(req, res, app)
{
	app.addJS([
		'/assets/features/animator/assets/js/Views/Animator.js'
	]);

	app.addCSS([
		'/assets/features/animator/assets/css/animator.css'
	]);

	return Q(app);
}
