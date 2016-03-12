action('document components')

describe('generate doc files for each of the components')

cli(function(program, dispatch) {
  program
    .command('document:components')
    .option('--include <pattern>', 'a glob pattern to use')
    .action(dispatch(this.api.runner))
})

execute( function(params, context = {}) {
  let exists = require('fs').existsSync
  let project = context.project
  let pick = require('lodash/pick')
  let targets = project.scripts.groupBy('categoryFolder')

  targets.components.forEach(target => {
     console.log(target.id)
  })

  targets.layouts.forEach(target => {
     console.log(target.id)
  })

  console.log(Object.keys(global))
})
