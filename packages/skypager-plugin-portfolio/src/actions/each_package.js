action('each:package')

describe('Runs an npm script for each project')

cli(function (program, dispatch){
  let action = this

  program
    .command('each:package <command>')
    .description('run a command in the context of each package')
    .option('--exclude <list>','exclude a comma separated list of package names')
    .option('--include <list>','include a comma separated list of package names')
    .option('--commands <settingsKey>', 'a project settings key which returns a commands object')
    .action(dispatch(action.api.runner))

  return program
})

execute(function(command, params = {}, context = {}) {
  let shell = require('shelljs')
  let project = context.project
  let {isArray, isString, some} = require('lodash')

  let exitCode = 0

  if (params.include && isString(params.include)) {
    params.include = params.include.split(',').map(i => trim(i))
  }

  if (params.exclude && isString(params.exclude)) {
    params.exclude = params.exclude.split(',').map(i => i.trim())
  }

  let packages = project.content.packages.query((pkg) => {
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

  packages.forEach(pkg => {
     console.log('TODO')
  })

})

