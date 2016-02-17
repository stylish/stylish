'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.serve = serve;
exports.handle = handle;

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _skypagerServer = require('skypager-server');

var _skypagerDevpack = require('skypager-devpack');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serve(program, dispatch) {
  program.command('serve [profile]').description('start the project server').option('--dashboard', 'display a dashboard view of the server processes').option('--profile', 'which configuration profile to use?', 'web').action(dispatch(handle));
}

exports.default = serve;
function handle(arg) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var project = context.project;
  var argv = context.argv;

  if (!project) {
    throw 'project must be run within a skyager project';
  }

  var settings = project.settings;

  var serverSettings = settings.server || _skypagerServer.defaultSettings;
  var profile = arg || options.profile || (0, _keys2.default)(serverSettings)[0] || 'web';
  var env = options.env || process.env.NODE_ENV || 'development';
  var dashboard = options.dashboard || false;
  var rawArg = _yargs2.default.argv._[1];

  if (rawArg === 'deepstream') {
    require('skypager-server').deepstream({ profile: profile, env: env }, { project: project, argv: argv });
  } else if (rawArg === 'webpack') {
    (0, _skypagerDevpack.devpack)('develop', profile, env, project, (0, _lodash.get)(serverSettings, profile + '.' + env + '.webpack') || {});
  } else {
    (0, _skypagerServer.server)({ profile: profile, env: env, dashboard: dashboard }, { project: project, argv: argv });
  }
}