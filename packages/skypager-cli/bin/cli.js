#!/usr/bin/env node

var deps = require('../lib/dependencies'),
    colors = require('colors');

if(deps.missingRequiredPackages().length > 0) {
  console.log('Missing Required Package'.red)
  console.log(deps.missingRequiredPackages())
  process.exit(1)
}

deps.checkAll().then(()=> {
  require('../lib/commands').program()()
}, function(err){
 console.log('Error with CLI', err)
})
