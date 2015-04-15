module.exports = {
	files: [
		{path: 'apps/{path}/windows/{name}/{name}.js', template: 'feature.js'},
		{path: 'apps/{path}/windows/{name}/assets/windows/{name}.html', template: 'window.html'},
		{path: 'apps/{path}/windows/{name}/assets/js/Views/{Name}.js', template: 'view.js'},
		{path: 'apps/{path}/windows/{name}/assets/js/Controllers/{Name}.js', template: 'controller.js'},
		{path: 'apps/{path}/windows/{name}/assets/css/{name}.css', template: 'window.css'},
	],
}
