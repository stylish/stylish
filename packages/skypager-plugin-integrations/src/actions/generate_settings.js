action('generate integration settings')

describe('Runs an npm script for each project')

cli(function (program, dispatch){
  var action = this

  program
    .command('settings:generate <services>')
    .description('generate settings files for an integration')
    .action(dispatch(action.api.runner))

  return program
})

/**
* generate settings files

* @param String services a comma separated list of services to enable
*
*/
execute(function(services, context) {
  var project = context.project

	// create a settings/integrations/service.yml
	// copy from the plugin src/integrations/**/*.yml templates
})

