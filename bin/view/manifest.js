module.exports = {
	files: [
		{path: 'apps/{path}/views/{name}/{name}.js', template: 'feature.js'},
		{path: 'apps/{path}/views/{name}/assets/pages/{name}.html', template: 'page.html'},
		{path: 'apps/{path}/views/{name}/assets/js/Views/{Name}.js', template: 'view.js'},
		{path: 'apps/{path}/views/{name}/assets/js/Controllers/{Name}.js', template: 'controller.js'},
		{path: 'apps/{path}/views/{name}/assets/css/{name}.css', template: 'page.css'},
	],
}
