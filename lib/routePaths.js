var path = require('path');
var fs = require('fs');

function unDos(filepath)
{
	filepath = path.resolve(filepath);

	if (filepath.indexOf(':') == 1)
	{
		filepath = filepath.slice(2);
	}

  	filepath = filepath.replace(/\\/g, '/');
	return filepath;
}

var thisDir = CONFIG.basePath;
var mainAssets = CONFIG.sapphireRoot + '/../public';

exports.urlPathToFilePath = function(which)
{
	var relative = which.indexOf(root) != 0;

	var paths = which.split('/');
	paths.shift();

//	console.log('urlPathToFilePath', which, paths)
	if (paths[0] == 'assets')
	{
		return mainAssets + '/' + paths.join('/');
	}
	else
	{
		return CONFIG.basePath + '/apps/' + paths.join('/');
		return result;
	}
}

