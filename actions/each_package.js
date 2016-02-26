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

  console.log('Total of:' + packages.length + ' packages ')
  console.log('Running ' + params.command.cyan + ' ')

  var args = params.command.split(' ')
  var cmd = args.shift()
  var dirname = require('path').dirname

  if (cmd === 'npm' && args[0] === 'run') {
    packages = packages.filter(pkg =>
      args[1] && pkg.data && pkg.data.scripts && pkg.data.scripts[ args[1] ]
    )
  }

  packages.forEach(function(pkg){
    var child = require('child_process').spawn(cmd, args, {
      cwd: dirname(pkg.paths.absolute)
    })

    child.stdout.on('data', function(data) {
      console.log('[' + pkg.data.name.yellow + ']: ' + data.toString())
    })

    child.stderr.on('data', function(data) {
      console.log('Error: ' + data.toString())
    })

    child.on('end', function(){
      console.log('Finished ' + pkg.data.name)
    })

    child.on('error', function(){
       console.log('Error in ' + pkg.data.name)
    })
  })
})

