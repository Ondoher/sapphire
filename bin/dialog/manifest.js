module.exports = {
	files: [
		{path: 'apps/{app}/features/dialogs/{name}/{name}.js', template: 'feature.js'},
		{path: 'apps/{app}/features/dialogs/{name}/assets/dialogs/{name}.html', template: 'dialog.html'},
		{path: 'apps/{app}/features/dialogs/{name}/assets/js/Views/{Name}.js', template: 'view.js'},
		{path: 'apps/{app}/features/dialogs/{name}/assets/js/Controllers/{Name}.js', template: 'controller.js'},
		{path: 'apps/{app}/features/dialogs/{name}/assets/css/{name}.css', template: 'dialog.css'},
	],
}
