#!/usr/bin/env node

var deps = require('../lib/dependencies'),
    colors = require('colors');

if(deps.missingRequiredPackages().length > 0) {
  console.log('Missing Required Packages'.red)
  console.log('The following packages can not be found in the require path.')
  console.log(deps.missingRequiredPackages())

  console.log('This command is intended to be run inside of a ' + 'skypager'.magenta + ' project path.' )
  console.log('You can run the ' + 'init'.cyan + ' or ' + 'init:portfolio'.green + ' command to get started.')
  process.exit(1)
}

deps.checkAll().then(()=> {
  global.$skypager = deps.getPathsGlobal()

  require('../lib/commands').program()()
}, function(err){
  console.log('This command is intended to be run inside of a ' + 'skypager'.magenta + ' project path.' )
  console.log('You can run the ' + 'init'.cyan + ' or ' + 'init:portfolio'.green + ' command to get started.')
})
