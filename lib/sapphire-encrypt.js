var crypto = require('crypto');
var CONFIG = require('./config').CONFIG;

var key = CONFIG.sapphireEncryptKey;
var cipherType = CONFIG.sapphireEncryptCipher;

exports.encrypt = function(value)
{
	var plaintext = value;

	var cipher = crypto.createCipher(cipherType, key);
	var encrypted = cipher.update(plaintext, 'utf-8', 'hex');
	encrypted += cipher.final('hex');

	return encrypted;
}

exports.encryptObject = function(value)
{
	return exports.encrypt(JSON.stringify(value));
},

exports.decrypt = function(value)
{
	var decipher = crypto.createDecipher(cipherType, key);

	try
	{
		var decrypted = decipher.update(value, 'hex', 'utf-8');
		decrypted += decipher.final('utf-8');
	}
	catch (e)
	{
		return false;
	}
	return decrypted;
}

exports.decryptObject = function(value)
{
	return JSON.parse(exports.decrypt(value));
}
