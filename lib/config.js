var config =
{
	port : 8080,
	server : 'localhost',
	baseUrl : 'http://localhost:8080/',
	basePath : process.cwd(),
	log : true,

	sapphireEncryptKey: 'iCUrNsmjz0biDfsgKATOKIbExn+yxCeV',
	sapphireEncryptCipher: 'aes-256-cbc',

};

var dir = process.env.node_config?process.env.node_config:undefined;

var defaultConfig = {};
if (dir) defaultConfig = require(dir + 'config');

var config = Object.merge(config, defaultConfig);
module.exports.CONFIG = config;

// method to get an app specific configuration
module.exports.appConfig = function(app)
{
	try
	{
		if (!app) return config;
		var mainApp = app.split('/')[1];
		appConfig = config[mainApp];
		return config = Object.merge({}, config, appConfig);
	}
	catch(e)
	{
		console.log(e.stack);
		return config;
	}
}


