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

var thisDir = path.dirname(module.filename) + '/';
var mainAssets = unDos(thisDir  + '../public');
var root = unDos(path.resolve(thisDir + '../'));

exports.urlPathToFilePath = function(which)
{
	var relative = which.indexOf(root) != 0;

	var paths = which.split('/');
	paths.shift();

	if (paths[0] == 'assets')
	{
		return mainAssets + '/' + paths.join('/');
	}
	else
	{
		var result = which;

		if (relative)
			result = path.normalize(unDos(thisDir) + '/../apps/' + paths.join('/'));
		return result;
	}
}

