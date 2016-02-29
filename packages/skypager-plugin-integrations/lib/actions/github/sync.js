'use strict';

action('sync github data');

describe('syncs github api data for the project');

cli(function (program, dispatch) {
  var action = this;

  program.command('github:sync <services>').description(action.definition.description).action(dispatch(action.api.runner));

  return program;
});

/**
* generate settings files

* @param String endpoints a comma separated list of endpoints to sync
*
*/
execute(function (services, context) {
  var project = context.project;
});