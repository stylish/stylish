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

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _develop = require('./develop');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function serve(program, dispatch) {
  program.command('serve [profile]').description('start the project server').option('--dashboard', 'display a dashboard view of the server processes').option('--profile', 'which configuration profile to use?', 'web').action(dispatch(handle));
}

exports.default = serve;
function handle(arg) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var project = context.project;

  if (!project) {
    throw 'project must be run within a skyager project';
  }

  if (!isServerInstalled()) {
    console.log('This command requires the skypager-server package'.red);
    process.exit(1);
  }

  var _require = require('skypager-server');

  var server = _require.server;
  var defaultSettings = _require.defaultSettings;

  var _require2 = require('skypager-devpack');

  var availableProfiles = _require2.availableProfiles;
  var devpack = _require2.devpack;

  var settings = project.settings;

  var serverSettings = settings.server || defaultSettings;
  var profile = arg || options.profile || (0, _keys2.default)(serverSettings)[0] || 'web';
  var env = options.env || process.env.NODE_ENV || 'development';
  var dashboard = options.dashboard || false;
  var rawArg = _yargs2.default.argv._[1];

  if (rawArg === 'deepstream') {
    require('skypager-server').deepstream({ profile: profile, env: env }, { project: project, argv: _yargs2.default.argv });
  } else if (rawArg === 'webpack') {
    var opts = (0, _get2.default)(serverSettings, profile + '.' + env + '.webpack') || {};
    context.argv = _yargs2.default.argv;
    (0, _develop.handle)(profile, opts, context);
  } else {
    server({ profile: profile, env: env, dashboard: dashboard }, { project: project, argv: _yargs2.default.argv });
  }
}

function isDevpackInstalled() {
  try {
    require('skypager-devpack');
    return true;
  } catch (error) {
    return false;
  }
}

function isServerInstalled() {
  try {
    require('skypager-server');
    return true;
  } catch (error) {
    console.log('Error requiring skypager-server', error.message);
    return false;
  }
}