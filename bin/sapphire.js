#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var mootools = require('mootools').apply(GLOBAL);

var thisDir = path.dirname(module.filename) + '/';

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

thisDir = unDos(thisDir) + '/';
var params = argv._;

function outputInstructions()
{
	var instructions = fs.readFileSync(thisDir + 'instructions.txt', {encoding:'ascii'});
	console.log(instructions);
};

var commands = ['install', 'page', 'dialog', 'feature', 'app', 'vc'];

if (params.length == 0) return outputInstructions();
if (commands.indexOf(params[0]) == -1) return outputInstructions();
if (params[0] == 'install' && params.length != 1) return outputInstructions();
if (params[0] == 'app' && params.length != 2) return outputInstructions();
if (params[0] == 'vc' && params.length < 3) return outputInstructions();
if (params.length != 3 && params[0] != 'vc') return outputInstructions();

function replaceNames(text, names)
{
	names = $H(names);
	names.each(function(value, name)
	{
		var regEx = new RegExp('\{' + name + '\}', 'g');
		text = text.replace(regEx, value);
	});

	return text;
}

function processOne(folder, spec, names)
{

	var fullPath = unDos(fs.realpathSync('./') + '/' + spec.path);
	var justPath = path.dirname(fullPath);
	var templateFile = thisDir + folder + '/templates/' + spec.template;
	mkdirp.sync(justPath);

// do not overwrite existing files
	if (fs.existsSync(fullPath)) return;

	template =  fs.readFileSync(templateFile, {encoding: 'utf-8'});
	template = replaceNames(template, names);

	console.log('writing file', fullPath);

	fs.writeFileSync(fullPath, template);
}

function processManifest(folder, names)
{
	var manifestFile = thisDir + folder + '/manifest.js';
	var manifest = require(manifestFile);

	manifest.files.each(function(spec)
	{
		spec.path = replaceNames(spec.path, names);
		processOne(folder, spec, names);
	});
}

function getNames(params)
{
	var app = params[1];
	var name = params[2];

	var result = {}
	result.App = app.replace(/-/g, ' ').capitalize().replace(/ /g, '')
	result.aPp = app.camelCase(app.replace(/-/g, ' '));
	result.APP = app.toUpperCase().replace(/-/g, '_');;
	result.app = app;

	result.Name = name.replace(/-/g, ' ').capitalize().replace(/ /g, '')
	result.nAme = name.camelCase().replace(/-/g, ' ');
	result.NAME = name.toUpperCase().replace(/-/g, '_');
	result.name = name;

	console.log(result);

	return result;
}

function getPath(params)
{
	if (params.length != 4) return '';
	var path = params[3];

	return path;
}

switch (params[0])
{
	case 'install':
		console.log('not implemented');
		break;

	case 'app':
		console.log('not implemented');
		break;

	case 'page':
		var names = getNames(params);
		processManifest('page', names);
		break;

	case 'dialog':
		var names = getNames(params);
		processManifest('dialog', names);
		break;

	case 'feature':
		var names = getNames(params);
		processManifest('feature', names);
		break;
	case 'vc':
		var names = getNames(params);
		names.path = getPath(params);
		processManifest('vc', names);
		break;
}
