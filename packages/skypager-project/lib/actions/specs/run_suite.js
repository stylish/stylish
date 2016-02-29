'use strict';

action('run spec suite');

describe('use the spec documents as a mocha test suite');

cli(function (program, dispatch) {
  var action = this;

  program.command('specs:run').description(action.definition.description).action(dispatch(action.api.runner));

  return program;
});

execute(function (params, ctx) {
  console.log('running the spec suite');
});