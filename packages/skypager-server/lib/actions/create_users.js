'use strict';

action('create users');

cli(function (program, dispatch) {
  var action = this;

  program.command('create:user <email> <password>').option('--role', 'which role should this user be assigned', 'user').option('--organization', 'which organization is this user a member', 'default').action(dispatch(action.api.runner));
});

execute(function (email, password) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var context = arguments[3];

  var defaults = require('lodash').defaults;
  var project = context.project;

  var _defaults = defaults(options, {
    role: 'user',
    organization: 'public'
  });

  var role = _defaults.role;
  var organization = _defaults.organization;

  var service = require('deepstream.io-client-js');
  var deepstream = project.settings.integrations.deepstream;

  if (!deepstream) {
    throw 'Must specify deepstream configuration in the project settings integrations.yml';
  }

  var ds = undefined;

  try {
    var connection = (deepstream.host || 'localhost') + ':' + (deepstream.port || 6021);

    ds = service(connection).login(null, function (success, errorMessage, errorCode) {
      if (!success) {
        console.log('Error connecting to deepstream server', errorMessage, errorCode);
        process.exit(1);
      }
    });
  } catch (error) {
    console.log('error', error.message);
    process.exit(1);
  }

  ds.on('error', function () {
    var _console;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (_console = console).log.apply(_console, ['DS Error'].concat(args));
  });

  try {
    (function () {
      var user = ds.record.getRecord('users/' + organization + '/' + email);

      user.whenReady(function () {
        user.set({
          email: email,
          organization: organization,
          role: role
        });

        console.log(user.get());
      });
    })();
  } catch (error) {
    console.log('error getting record');
    console.log(error.message);
  }
});