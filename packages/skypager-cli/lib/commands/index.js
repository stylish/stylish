'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODES = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.program = program;
exports.configure = configure;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _path = require('path');

var _yargs = require('yargs');

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

var _author = require('./author');

var _author2 = _interopRequireDefault(_author);

var _available = require('./available');

var _available2 = _interopRequireDefault(_available);

var _build = require('./build');

var _build2 = _interopRequireDefault(_build);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _develop = require('./develop');

var _develop2 = _interopRequireDefault(_develop);

var _exporter = require('./exporter');

var _exporter2 = _interopRequireDefault(_exporter);

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

var _importer = require('./importer');

var _importer2 = _interopRequireDefault(_importer);

var _listen = require('./listen');

var _listen2 = _interopRequireDefault(_listen);

var _publish = require('./publish');

var _publish2 = _interopRequireDefault(_publish);

var _repl = require('./repl');

var _repl2 = _interopRequireDefault(_repl);

var _serve = require('./serve');

var _serve2 = _interopRequireDefault(_serve);

var _util = require('../util');

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDevMode = _yargs.argv.devMode || process.env.SKYPAGER_ENV === 'development';

var commands = {
  author: _author2.default,
  available: _available2.default,
  build: _build2.default,
  console: _repl2.default,
  develop: _develop2.default,
  exporter: _exporter2.default,
  init: _init2.default,
  importer: _importer2.default,
  listen: _listen2.default,
  publish: _publish2.default,
  repl: _repl2.default,
  serve: _serve2.default
};

var currentDirectory = process.env.PWD;

var requestedCommand = _yargs.argv._[0];

function program() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if ($skypager && _yargs.argv.debugPaths) {
    console.log((0, _stringify2.default)($skypager, null, 2));

    process.exit(0);
  }

  var commander = require('commander');

  commander.version(_package2.default.version).option('--debug', 'enable debugging').option('--env <env>', 'the application environment', process.env.NODE_ENV || 'development').option('--project <path>', 'the folder contains the project you wish to work with');

  configure(commander, options.mode || 'full');

  if (!requestedCommand || commander.commands.map(function (c) {
    return c._name;
  }).indexOf(requestedCommand) < 0) {
    // dont duplicate the output
    if (!_yargs.argv.help) {
      commander.outputHelp();
    }
  }

  return function () {
    return commander.parse(process.argv);
  };
}

exports.default = program;
var MODES = exports.MODES = {
  full: ['author', 'build', 'repl', 'develop', 'exporter', 'init', 'importer', 'serve'],
  setup: ['available', 'repl', 'init']
};

function configure(commander) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var mode = options.mode || 'full';

  var dispatch = function dispatch(handlerFn) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.push(context);
      try {
        handlerFn.apply(undefined, args);
      } catch (error) {
        console.log('Command Error:'.red);
        console.log(error.message);
        throw error;
      }
    };
  };

  var project = undefined;

  var projectFile = _yargs.argv.project || findNearestPackageManifest() || process.env.PWD;

  if (mode === 'missing_dependencies') {
    mode = 'init';
  } else {
    try {
      project = loadProject(projectFile);
    } catch (error) {
      console.log('Error loading project', error.message);
    }
  }

  var config = project && project.manifest && project.manifest.skypager;

  var context = {
    commander: commander,
    project: project,
    config: config,
    isCLI: true
  };

  var enabled = MODES[mode] || ['repl', 'init'];

  enabled.forEach(function (subcommand) {
    commands[subcommand](commander, dispatch);
  });

  // the project can dynamically add its own cli commands from certain actions
  if (project && project.actions) {
    project.actions.filter(function (action) {
      return (0, _get2.default)(action, 'definition.interfaces.cli');
    }).forEach(function (action) {
      return (0, _get2.default)(action, 'definition.interfaces.cli').call(action, commander, dispatch);
    });
  }

  return function () {
    return commander.parse(_yargs.argv);
  };
}

function loadProject(fromPath) {
  var silent = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  try {
    (0, _util.skypagerBabel)();
  } catch (error) {
    console.log('There was an error running the babel-register command. Make sure you have a .babelrc or that babel-preset-skypager is installed.'.red);
    process.exit(1);
  }

  try {
    return (0, _util.loadProjectFromDirectory)(fromPath || process.env.PWD);
  } catch (error) {
    if (!silent && requestedCommand !== 'init' && requestedCommand !== 'help') {
      console.error('Error loading skypager project.'.red);
      console.log('Attempted to load from ' + fromPath.yellow + '. Run this from within a project directory and make sure the ' + 'skypager-project'.magenta + ' is installed.');
    }
  }
}

function findNearestPackageManifest() {
  var loc = require('findup-sync')('package.json');

  if (!loc) {
    return;
  }

  return (0, _path.dirname)(loc);
}