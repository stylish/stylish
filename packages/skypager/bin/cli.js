#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const exists = fs.existsSync
const colors = require('colors')
const pkg = require('../package.json')
const program = require('commander')
const commands = require('../lib/cli')
const shell = require('shelljs')

function loadProjectManifest (directory) {
	var manifest = require(path.join(directory,'package.json')) || {}

	return manifest
}

function loadProjectFromDirectory (directory) {
	var manifest = loadProjectManifest(directory)

	if (manifest.skypager && manifest.skypager.main) {
		return require(
			path.join(
				directory,
				manifest.skypager.main.replace(/^\.\//, '')
			)
		)
	}

	if (exists(path.join(directory, 'skypager.js'))) {
		return require(
			path.join(directory, 'skypager.js')
		)
	}

	if (exists(path.join(directory, 'index.js'))) {
		var p = require(
			 path.join(directory, 'index.js')
		)

		if (!p.registries && !p.docs) {
			abort('This project does not seem to have a skypager project')
		}

		return p
	}
}

program
	.version(pkg.version)
	.option('--project <path>', 'specify which folder contains the project you wish to work with')

program
	.command('init')
	.arguments('init [projectName]')
	.description('create a new skypager project')
	.option('--plugins', 'which plugins should this project include?')
	.action(function(projectName, options){

	})

program
	.command('console')
	.description('launch an interactive REPL for this project')
	.action(function(options){
		var projectPath = path.resolve(options.parent.project || process.env.PWD)
		var project = loadProjectFromDirectory(projectPath)

		var replServer = require('repl').start({
			prompt: ('skypager'.magenta + ':'.white + ' ')
		})

		replServer.context.project = project
		replServer.context.skypager = require('skypager')
	})

program
	.command('serve [entry]')
	.description('run a preconfigured webpack development server for this project')
	.option('--entry <entry>', 'the require path to the application entry point, defaults to ./src')
	.option("--precompiled <templateName>", "use an html template with a precompiled vendor bundle")
	.action(function(entryPoint, options){
		shell.exec("skypager-devpack start")
	})

program
	.command('compile [entry]')
	.description('run a preconfigured webpack compiler for this project')
	.option('--entry <entry>', 'the require path to the application entry point, defaults to ./src')
	.action(function(entryPoint, options){
		shell.exec("skypager-devpack build")
	})

program
	.command('publish [domain]')
	.description('run a preconfigured webpack compiler for this project')
	.action(function(domain, options){
		var projectPath = path.resolve(options.parent.project || process.env.PWD)
		var project = loadProjectFromDirectory(projectPath)

		domain = domain || project.options.domain

		console.log('Publishing to domain', domain)
	})

program
	.command('run <helper> [type]')
	.description('run a helper command for this project')
	.option('--type <type>', 'which type of helper? valid options are action, importer, or exporter', /action|importer|exporter/i)
	.action(function(helper, type, options){
		var projectPath = path.resolve(options.parent.project || process.env.PWD)
		var project = loadProjectFromDirectory(projectPath)
	})

program.parse(process.argv)
