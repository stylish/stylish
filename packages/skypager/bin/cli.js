#!/usr/bin/env node

var yargs = require('yargs'),
    argv = yargs.argv

var launch

if (argv.devMode || process.env.SKYPAGER_ENV == 'development') {
  require('babel-register')({
    presets:['skypager']
  })

	process.env.SKYPAGER_ENV = 'development'
  launch = require('../src/commands').program()
} else {
	process.env.SKYPAGER_ENV = 'release'
  launch = require('../lib/commands').program()
}

launch()
