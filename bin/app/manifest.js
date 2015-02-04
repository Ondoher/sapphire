module.exports = {
	files: [
		{path: 'apps/{path}/{app}.js', template: 'app.js'},
		{path: 'apps/{path}/templates/body.html', template: 'body.html'},
		{path: 'apps/{path}/templates/master.html', template: 'master.html'},
		{path: 'apps/{path}/assets/css/Views/{app}.css', template: 'app.css'},
		{path: 'apps/{path}/assets/js/Views/{App}.js', template: 'view.js'}
		{path: 'apps/{path}/assets/js/Controllers/{App}.js', template: 'controller.js'},
		{path: 'apps/{path}/assets/js/Models/Service.js', template: 'service.js'},
	]);

	return Q(app)
}

