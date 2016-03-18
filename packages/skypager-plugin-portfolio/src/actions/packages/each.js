action('Run a command for each package')

describe('Runs an npm script for each package')

cli(function (program, dispatch){
  var action = this

  program
    .command('each <group>')
    .description('run commands in each project')
    .option('--group <group>', 'which type of folders do you want to loop over? projects or packages', 'package')
    .option('--command <command>', 'run a shell command for each of the matching packages')
    .option('--run <script>', 'run an npm script for each of the matching packages')
    .option('--exclude <list>','exclude a comma separated list of package names')
    .option('--include <list>','include a comma separated list of package names')
    .action(dispatch(action.api.runner))

  return program
})

execute(function(group, params = {}, context = {}) {

  if (!params || !context) {
    console.log(group, params, context)
    throw('missing params and context')
  }

  var project = context.project || params.project || this

  group = group || params.group
  params.group = group

  var shell = require('shelljs')

  if (params.run) {
    params.command = "npm run " + params.run
  }

  var requested = params.command || ""
  var args = params.command.split(' ')
  var cmd = args.shift()

  if (!cmd) {
    console.log('Must supply a command via the --command or --run flags.'.red)
    process.exit(1)
  }

  var dirname = require('path').dirname
  var pull = require('lodash/pull')

  var include, exclude, group

  switch(group) {
    case 'project', 'projects':
      include = params.include ? project.projects.glob(params.include) : project.projects.query()
      exclude = params.exclude ? project.projects.glob(params.exclude) : []
      break;
    case 'package', 'packages':
    default:
      include = params.include ? project.packages.glob(params.include) : project.packages.query()
      exclude = params.exclude ? project.packages.glob(params.exclude) : []
  }

  let paths = include.map(a => a.paths.absolute)

  if (exclude.length > 0) {
    pull(include, exclude)
  }

  if (cmd === 'npm' && args[0] === 'run') {
    include = include.filter(pkg =>
      args[1] && pkg.data && pkg.data.scripts && pkg.data.scripts[ args[1] ]
    )
  }

  include.forEach(function(pkg){
    var child = require('child_process').spawn(cmd, args, {
      cwd: dirname(pkg.paths.absolute),
      stdio:['inherit','inherit']
    })

    child.on('end', function(){
      console.log('Finished'.green + ' ' + pkg.data.name)
    })

    child.on('error', function(){
       console.log('Error'.red + ' in ' + pkg.data.name )
    })
  })
})

