module.exports = {
	files: [
		{path: 'apps/{app}/features/pages/{name}/{name}.js', template: 'feature.js'},
		{path: 'apps/{app}/features/pages/{name}/assets/pages/{name}.html', template: 'page.html'},
		{path: 'apps/{app}/features/pages/{name}/assets/js/Views/{Name}.js', template: 'view.js'},
		{path: 'apps/{app}/features/pages/{name}/assets/js/Controllers/{Name}.js', template: 'controller.js'},
		{path: 'apps/{app}/features/pages/{name}/assets/css/{name}.css', template: 'page.css'},
	],
}
