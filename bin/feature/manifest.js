module.exports = {
	files: [
		{path: 'apps/{app}/features/{name}/{name}.js', template: 'feature.js'},
		{path: 'apps/{app}/features/{name}/assets/js/Views/{Name}.js', template: 'view.js'},
		{path: 'apps/{app}/features/{name}/assets/js/Controllers/{Name}.js', template: 'controller.js'},
	],
}
