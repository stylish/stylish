#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const exists = fs.existsSync
const colors = require('colors')
const pkg = require('../package.json')
const program = require('commander')
const commands = require('../lib/commands')
const util = require('../lib/util')
const argv = require('yargs').argv

if (exists(path.join(process.env.PWD,'.babelrc'))) {
	require('babel-register')
} else {
	require('babel-register')({
		presets:[
			require.resolve('babel-preset-es2015'),
			require.resolve('babel-preset-react'),
			require.resolve('babel-preset-stage-0')
		],
		plugins:[
			require.resolve('babel-plugin-add-module-exports')
		]
	})
}

var localPackage = {}

try {
	localPackage = require(path.join(process.env.PWD, 'package.json'))
} catch (error) {

}

program
	.version(pkg.version)
	.option('--project <path>', 'specify which folder contains the project you wish to work with')
	.option('--debug', 'enable debugging')
	.option('--env <env>', 'which environment should we run in? defaults to NODE_ENV', process.env.NODE_ENV || 'development')

commands.configure(program, localPackage.skypager || {})

program.parse(process.argv)

if (!process.argv.slice(2).length) {
	program.outputHelp()
}

var commandNames = program.commands.map(function(c){ return c._name })

if (commandNames.indexOf(program.rawArgs.slice(2)[0]) === -1) {
	console.log()
	console.log('Invalid command'.red)
	 program.outputHelp()
}
