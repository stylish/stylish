#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const exists = fs.existsSync
const colors = require('colors')
const pkg = require('../package.json')
const program = require('commander')
const commands = require('../lib/cli')
const util = require('../lib/util')

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

program
	.version(pkg.version)
	.option('--project <path>', 'specify which folder contains the project you wish to work with')

	commands.console = commands.repl

	Object.keys(commands).sort().forEach(function(cmdName) {
		if (cmdName === 'dispatcher' || cmdName === 'repl') {
			 return
		}

		var cmd = commands[cmdName]

		if (typeof cmd !== 'function') {
			console.log('Something wrong with the' + cmdName + ' command definition. Does not export a function'.red)
		} else {
			cmd(program, commands.dispatcher.bind(program))
		}
	})

program.parse(process.argv)
