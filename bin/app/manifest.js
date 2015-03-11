module.exports = {
	files: [
		{path: '{app}.bat', template: 'run.bat'},
		{path: '{app}', template: 'run.sh'},
		{path: 'apps/{app}/sapphire-config/config.js', template: 'config.js'},
		{path: 'apps/{app}/sapphire-config/config.dev.js', template: 'config.dev.js'},
		{path: 'apps/{app}/sapphire-config/config.prod.js', template: 'config.prod.js'},
		{path: 'apps/{app}/sapphire-config/config.js'},
		{path: 'apps/{path}/{app}.js', template: 'app.js'},
		{path: 'apps/{path}/templates/body.html', template: 'body.html'},
		{path: 'apps/{path}/templates/master.html', template: 'master.html'},
		{path: 'apps/{path}/assets/css/{app}.css', template: 'app.css'},
		{path: 'apps/{path}/assets/js/Views/{App}.js', template: 'view.js'},
		{path: 'apps/{path}/assets/js/Controllers/{App}.js', template: 'controller.js'},
		{path: 'apps/{path}/assets/js/Models/Service.js', template: 'service.js'},
	],
}

