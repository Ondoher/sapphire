module.exports = {
	files: [
		{path: 'apps/{path}/features/{name}/{name}.js', template: 'feature.js'},
		{path: 'apps/{path}/features/{name}/assets/js/Views/{Name}.js', template: 'view.js'},
		{path: 'apps/{path}/features/{name}/assets/js/Controllers/{Name}.js', template: 'controller.js'},
	],
}
