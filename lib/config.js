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

var appConfig = {};
if (dir) appConfig = require(dir + 'config');

module.exports.CONFIG = Object.merge(config, appConfig);



