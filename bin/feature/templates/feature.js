var Q = require('q');
var Feature = require('feature').Feature;

module.exports = function(req, res, app)
{
	var {nAme} = new Feature(app, '/{app}/features/{name}/');

  	{nAme}.addJS(['assets/js/Controllers/{Name}.js', 'assets/js/Views/{Name}.js']);

	return Q(app);
}
