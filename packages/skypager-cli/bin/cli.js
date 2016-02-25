#!/usr/bin/env node

var deps = require('../lib/dependencies'),
    colors = require('colors'),
    argv = require('yargs')

deps.checkAll().then(()=> {
  global.$skypager = deps.getPathsGlobal()
  require('../lib/commands').program()()
}, handleError)



function handleError(err){
  console.log('This command is intended to be run inside of a ' + 'skypager'.magenta + ' project path.' )
  console.log('You can run the ' + 'init'.cyan + ' command to get started.')

  console.log('Error', err)
  console.log(require('../lib').paths)
}
