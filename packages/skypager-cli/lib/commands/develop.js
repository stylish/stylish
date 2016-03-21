'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.develop = develop;
exports.handle = handle;
exports.launchServer = launchServer;
exports.launchTunnel = launchTunnel;

var _path = require('path');

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is a low level wrapper around webpack dev server and how we use it to build react / bootstrap / redux
 * apps for web, electron, and react-native platforms.
 *
 * Eventually I would rather have several presets which compose these different options together.
*/
function develop(program, dispatch) {
  program.command('dev [preset]').alias('test:server').allowUnknownOption(true).description('run server for this project').option('--host <hostname>', 'which hostname should this server listen on?', 'localhost').option('--output-folder <path>', 'relative path to the output folder', 'public').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--port <port>', 'which port should this server listen on?', 3000).option('--preset <name>', 'use a preset instead of all of this configuration').option('--theme <name>', 'the name of the theme to use', 'dashboard').action(dispatch(handle));
}

exports.default = develop;
function handle(preset) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var project = context.project;

  preset = preset || options.preset || 'web';
  options.preset = preset;

  launchServer(preset, (0, _pick2.default)(options, 'host', 'port', 'preset'), context);
}

function launchServer(preset) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var project = context.project;

  if (!project) {
    console.log('Can not launch the dev server outside of a skypager project directory. run skypager init first.'.red);
    process.exit(1);
  }

  if (!isDevpackInstalled()) {
    console.log('The skypager-devpack package is required to use the webpack integration.'.red);
    process.exit(1);
  }

  function onCompile(err, stats) {
    project.debug('skypager:afterDevCompile', {
      stats: stats && (0, _keys2.default)(stats.toJson())
    });
  }

  function beforeCompile(err, data) {
    project.debug('skypager:beforeDevCompile', (0, _extends3.default)({}, data));
  }

  if (!preset) {
    console.log('Must specify a config preset.'.yellow);
    console.log('Available options:');
    console.log(available(project, 'settings.webpack', 'settings.servers'));
    process.exit(1);
  }

  var opts = checkForSettings(project, 'settings.webpack.' + preset, 'settings.servers.' + preset + '.webpack', 'settings.servers.' + preset);

  var devpack = require($skypager && $skypager['skypager-devpack'] || process.env.SKYPAGER_DEVPACK_ROOT || 'skypager-devpack');

  if (!opts) {
    console.log('Missing config. Creating default config in: ' + ('settings/build/' + preset).green);
    project.content.settings_files.createFile('settings/webpack/' + preset + '.yml', yaml(devpack.argsFor(preset, process.env.NODE_ENV || 'development')));
  }

  options.devpack_api = 'v2';
  options = (0, _assign2.default)(options, opts);

  if (!options.noBundle || options.bundle === false) {
    try {
      project.run.exporter('bundle', {});
    } catch (error) {
      console.log('Error running bundle exporter');
    }
  }

  devpack.webpack('develop', options, {
    project: project,
    beforeCompile: beforeCompile.bind(project),
    onCompile: onCompile.bind(project)
  });
}

function yaml(obj) {
  return require('js-yaml').dump(obj);
}

function launchTunnel(options, context) {
  var server = shell.exec('ngrok http ' + (options.port || 3000), { async: true });

  server.stdout.on('data', function (data) {
    console.log(data);
  });

  server.stderr.on('data', function (data) {
    console.log(data);
  });

  server.on('end', function () {
    console.log('Ngrok tunnel ended');
  });
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

var _Object = Object;
var assign = _Object.assign;

function attempt(packageRequire) {
  try {
    return require.resolve(packageRequire);
  } catch (e) {
    return false;
  }
}

function checkForSettings(project) {
  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  var key = keys.find(function (key) {
    console.log('Checking for settings in: ' + key.cyan);
    var value = project.get(key);

    if (value) {
      return true;
    }
  });

  if (key) {
    console.log('Found ' + key.green);
  }

  return project.get(key);
}

function available(project) {
  for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    keys[_key2 - 1] = arguments[_key2];
  }

  return (0, _uniq2.default)(keys.reduce(function (memo, test) {
    return memo.concat((0, _keys2.default)(project.get(test) || {}));
  }, [])).sort().join(',');
}