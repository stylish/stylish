'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.build = build;
exports.handle = handle;

var _path = require('path');

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

var _uniq = require('lodash/uniq');

var _uniq2 = _interopRequireDefault(_uniq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function build(program, dispatch) {
  program.command('build [preset]').allowUnknownOption(true).description('build a website for this project using our preconfigured webpack bundle').option('--output-folder <path>', 'relative path to the output folder', 'public').option('--preset <name>', 'use a preset instead of all of this configuration').option('--platform <name>', 'which platform are we building for? electron or web', 'web').option('--theme <name>', 'the name of the theme to use', 'dashboard').action(dispatch(handle));
}

exports.default = build;
function handle(preset) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  process.env.NODE_ENV = 'production';

  if (!isDevpackInstalled()) {
    console.log('The skypager-devpack package is required to use the webpack integration.'.red);
    process.exit(1);
  }

  var project = context.project;

  if (!project) {
    console.log('Can not launch the dev server outside of a skypager project directory. run skypager init first.'.red);
    process.exit(1);
  }

  preset = preset || options.preset;
  options.preset = preset;

  function beforeCompile(_ref) {
    var config = _ref.config;
    var argv = _ref.argv;

    project.debug('skypager:beforeCompile', (0, _extends3.default)({}, argv, {
      config: config
    }));
  }

  function onCompile(err, stats) {
    project.debug('skypager:afterCompile', {
      stats: stats && (0, _keys2.default)(stats.toJson())
    });
  }

  if (!preset) {
    console.log('Must specify a config preset.'.yellow);
    console.log('Available options:');
    console.log(available(project, 'settings.build', 'settings.builds', 'settings.webpack'));
    process.exit(1);
  }

  console.log('Checking for config presets: ' + preset.green);

  var opts = checkForSettings(project, 'settings.build.' + preset + '.webpack', 'settings.build.' + preset, 'settings.builds.' + preset + '.webpack', 'settings.builds.' + preset, 'settings.webpack.' + preset + '.build', 'settings.webpack.' + preset);

  if (!opts) {
    console.log('Missing config. Creating default config in: ' + ('settings/build/' + preset).green);
    project.content.settings_files.createFile('settings/build/' + preset + '.yml', yaml(require('skypager-devpack').argsFor(preset, 'production')));
  }

  options.devpack_api = 'v2';
  options = (0, _assign2.default)(options, opts);

  require('skypager-devpack').webpack('build', options, { beforeCompile: beforeCompile, onCompile: onCompile });
}

function isDevpackInstalled() {
  try {
    require('skypager-devpack');
    return true;
  } catch (error) {
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

function yaml(obj) {
  return require('js-yaml').dump(obj);
}