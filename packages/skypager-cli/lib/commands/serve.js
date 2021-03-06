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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Object = Object;
var assign = _Object.assign;
function serve(program, dispatch) {
  program.command('serve [profile]').allowUnknownOption(true).description('start the project server').option('--no-dashboard', 'disable the dashboard view on the CLI').option('--profile', 'which configuration profile to use?', 'web').option('--port <port>', 'which port to listen on?').action(dispatch(handle));
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

  var _require = require($skypager && $skypager['skypager-server'] || $skypager && $skypager.server || process.env.SKYPAGER_SERVER_ROOT || 'skypager-server');

  var server = _require.server;
  var deepstream = _require.deepstream;
  var defaultSettings = _require.defaultSettings;

  var _require2 = require($skypager && $skypager['skypager-devpack'] || $skypager && $skypager.devPack || process.env.SKYPAGER_DEVPACK_ROOT || 'skypager-devpack');

  var availableProfiles = _require2.availableProfiles;
  var devpack = _require2.devpack;

  var settings = project.settings;

  var serverSettings = settings.server || defaultSettings;
  var profile = arg || options.profile || (0, _keys2.default)(serverSettings)[0] || 'web';
  var env = options.env || process.env.NODE_ENV || 'development';
  var dashboard = !options.noDashboard && !options.dashboard === false;
  var rawArg = _yargs2.default.argv._[1];

  var opts = {};
  context.argv = _yargs2.default.argv;

  if (rawArg === 'deepstream') {
    opts = (0, _get2.default)(project, 'settings.servers.deepstream.' + profile) || (0, _get2.default)(project, 'settings.servers.' + profile + '.deepstream') || (0, _get2.default)(project, 'settings.deepstream.' + profile) || (0, _get2.default)(project, 'settings.deepstream');

    deepstream(opts, context);
  } else {
    server({ profile: profile, env: env, dashboard: dashboard }, context);
  }
}

function isServerInstalled() {
  var tryPath = $skypager && $skypager.server || $skypager && $skypager['skypager-server'] || process.env.SKYPAGER_SERVER_ROOT || attempt('skypager-server');

  if (!tryPath) {
    return false;
  }

  try {
    if (tryPath) {
      require(tryPath);
    }
    return true;
  } catch (error) {
    return false;
  }
}

function isDevpackInstalled() {
  var tryPath = $skypager && $skypager.devPack || $skypager && $skypager['skypager-devpack'] || process.env.SKYPAGER_DEVPACK_ROOT || attempt('skypager-devpack');

  if (!tryPath) {
    return false;
  }

  try {
    if (tryPath) {
      require(tryPath);
    }
    return true;
  } catch (error) {
    return false;
  }
}

function attempt(packageRequire) {
  try {
    return require.resolve(packageRequire);
  } catch (e) {
    return false;
  }
}