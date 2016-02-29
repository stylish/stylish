action('generate portfolio settings')

describe('generate the necessary setting defaults for the portfolio project')

cli(function (program, dispatch){
  var action = this

  program
    .command('settings:generate')
    .description('generate settings files for a portfolio')
    .action(dispatch(action.api.runner))

  return program
})

/**
* generate settings files

*
*/
execute(function(services, context) {
  var project = context.project

	// copy from the plugin src/portfolio/**/*.yml templates
})

