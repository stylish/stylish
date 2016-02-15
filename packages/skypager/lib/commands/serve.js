'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serve = serve;
exports.handle = handle;

var _yargs = require('yargs');

var _skypagerServer = require('skypager-server');

var _skypagerDevpack = require('skypager-devpack');

function serve(program, dispatch) {
  program.command('serve [profile]').description('start the project server').option('--dashboard', 'display a dashboard view of the server processes').option('--profile', 'which configuration profile to use?', 'web').option('--env', 'which environment should the server run in?', process.env.NODE_ENV || 'development').action(dispatch(handle));
}

exports.default = serve;
function handle(arg) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var project = context.project;

  var profile = arg || options.profile || 'web';
  var env = options.env || 'development';
  var dashboard = options.dashboard || false;

  (0, _skypagerServer.start)({ profile: profile, env: env, dashboard: dashboard }, { project: project, options: _yargs.argv });
}