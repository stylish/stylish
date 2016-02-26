action('Run Project Script')

describe('Runs an npm script for each project')

cli(function (program, dispatch){
  var action = this

  program
    .command('each:package')
    .description('')
    .option('--command <command>', 'which command to run in this package directory')
    .option('--exclude <list>','exclude a comma separated list of package names')
    .option('--include <list>','include a comma separated list of package names')
    .action(dispatch(action.api.runner))

  return program
})

execute(function(params, context) {
  var project = context.project
  var packages = project.packages.query()
  var shell = require('shelljs')

  /*
  var includePattern = params.include && require('minimatch').makeRe(params.include)
  var excludePattern = params.execlude && require('minimatch').makeRe(params.exclude)

  packages = packages.query(function(pkg){
    if (includePattern && !includePattern.exec(pkg.data.name)){
      return false
    }

    if (excludePattern && excludePattern.exec(pkg.data.name)){
      return false
    }

    return true
  })
  */

  console.log('Total of :' + packages.length + ' packages ')
  console.log('Running ' + params.command.cyan + ' ')

  packages.forEach(function(pkg){
    var child = shell.exec(params.command, {async: true})

    child.on('error', function(){
       console.log('Error in ' + pkg.data.name)
    })
  })
})

