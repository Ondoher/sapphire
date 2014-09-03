var mootools = require('mootools').apply(GLOBAL);
var Mangler = require('mangler').Mangler;

var config =
{
	port : 8080,
	server : 'localhost:8080',
	baseUrl : 'http://localhost:8080/',
	socketServer : 'http://localhost',
	basePath : './',
	log : true,
	mangler : Mangler,

	sapphireEncryptKey: 'iCUrNsmjz0biDfsgKATOKIbExn+yxCeV',
 	sapphireEncryptCipher: 'aes-256-cbc',

};

var env = process.env.node_env;
var dir = process.env.node_config?process.env.node_config:undefined;

var appConfig = {};
if (dir) appConfig = require(dir + 'config');

module.exports.CONFIG = Object.merge(config, appConfig);



