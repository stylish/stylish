action('Run Project Script')

describe('Runs an npm script for each project')

cli(function (program, dispatch){
  let action = this

  program
    .command('run:package:script <scriptName>')
    .description('ensures that a project document exists for each project')
    .option('--packages-only', 'only include packages')
    .option('--projects-only', 'only include projects')
    .option('--exclude <pattern>','exclude pattern')
    .action(dispatch(action.api.runner))

  return program
})

execute(function(scriptName, params, context) {
  let shell = require('shelljs')
  let project = context.project

  let packages = project.packages.query((pkg) => {
    if(!params.exclude && !params.include) {
      return true
    }

    if (params.exclude && pkg.data && pkg.data.name && pkg.data.name.match(params.exclude)) {
      return false
    }

    return true
  })

  packages.forEach((pkg) => {
    if (typeof pkg.result('scripts.test') === 'undefined') {
      console.log(`${ pkg.name } does not have the ${ scriptName } script`)
      return
    }

    let proc = require('child_process').spawn('npm', ['run', scriptName], {
      cwd: require('path').dirname(
        pkg.paths.absolute
      )
    })

    if (params.stdout) {
      proc.stdout.on('data', (data) => console.log(data.toString()))
    }

    if (params.stderr) {
      proc.stderr.on('data', (data) => console.log(data.toString()))
    }

    proc.on('exit', (code) => {
      if ( code == 0 ) {
        console.log(`${ pkg.data.name } ...` + 'ok'.green)
      }

      if (code !== 0) {
        console.log(`${ pkg.data.name } ...` + 'ok'.red)
      }
    })

  })
})

function forEachPackage(project ,fn) {
  let packages = project.query('docs', { id:/^packages\// })
  packages.forEach(fn.bind(project))
}

function forEachProject(project, fn) {
  let projects = project.query('docs', { id:/^projects\// })
  projects.forEach(fn.bind(project))
}

