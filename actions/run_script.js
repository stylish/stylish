action('Run Project Script')

describe('Runs an npm script for each project')

cli(function (program, dispatch){
  let action = this

  program
    .command('run:package:script <scriptName>')
    .description('ensures that a project document exists for each project')
    .option('--packages-only', 'only include packages')
    .option('--projects-only', 'only include projects')
    .option('--exclude <list>','exclude a comma separated list of package names')
    .option('--include <list>','include a comma separated list of package names')
    .action(dispatch(action.api.runner))

  return program
})

execute(function(scriptName, params, context) {
  let shell = require('shelljs')
  let project = context.project
  let {isArray, isString, trim, some} = require('lodash')

  if (params.include && isString(params.include)) {
    if(isString(params.include) && params.include.match(',')) {
      params.include = params.include.split(',').map(i => trim(i))
    }
  }

  if (params.include && !isArray(params.include)){
    params.include = [params.include]
  }

  if (params.exclude && isString(params.exclude)) {
    if(isString(params.exclude) && params.exclude.match(',')) {
      params.exclude = params.exclude.split(',').map(i => trim(i))
    }
  }

  if (params.exclude && !isArray(params.exclude)){
    params.exclude = [params.exclude]
  }

  let packages = project.packages.query((pkg) => {
    if(!params.exclude && !params.include) {
      return true
    }

    if (params.include) {
      return some(params.include, (inc) => {
        return pkg.result('name') === inc
      })
    }

    if (params.exclude) {
      return !some(params.exclude, (inc) => {
        return pkg.result('name') === inc
      })
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
        console.log(`${ pkg.data.name } ...` + 'not ok'.red)
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

