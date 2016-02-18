'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commands = undefined;
exports.program = program;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _path = require('path');

var _yargs = require('yargs');

var _fs = require('fs');

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

var currentDirectory = process.env.PWD;

var commands = exports.commands = {
  author: _author2.default,
  available: _available2.default,
  build: _build2.default,
  console: _repl2.default,
  create: _create2.default,
  develop: _develop2.default,
  export: _exporter2.default,
  import: _importer2.default,
  listen: _listen2.default,
  publish: _publish2.default
};

var requestedCommand = _yargs.argv._[0];

function program() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var commander = require('commander');

  commander.version(_package2.default.version).option('--debug', 'enable debugging').option('--dev-mode', 'run skypager in dev mode. for local development').option('--env <env>', 'the application environment', process.env.NODE_ENV || 'development').option('--project <path>', 'the folder contains the project you wish to work with');

  configure(commander);

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

function configure(commander) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var project = loadProject(_yargs.argv.project);
  var config = project && project.manifest && project.manifest.skypager;

  var context = {
    commander: commander,
    project: project,
    config: config,
    isCLI: true
  };

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

  if (isDevMode) {
    (0, _author2.default)(commander, dispatch);
    (0, _available2.default)(commander, dispatch);
  }

  (0, _build2.default)(commander, dispatch);

  if (isDevMode) {
    (0, _repl2.default)(commander, dispatch);
    (0, _create2.default)(commander, dispatch);
  }

  (0, _develop2.default)(commander, dispatch);

  (0, _exporter2.default)(commander, dispatch);

  (0, _init2.default)(commander, dispatch);

  (0, _importer2.default)(commander, dispatch);

  if (isDevMode) {
    (0, _listen2.default)(commander, dispatch);
  }

  (0, _publish2.default)(commander, dispatch);

  (0, _serve2.default)(commander, dispatch);

  // the project can dynamically add its own cli commands from certain actions
  if (project && project.actions) {
    project.actions.filter(function (action) {
      return _util.dotpath.get(action, 'definition.interfaces.cli');
    }).forEach(function (action) {
      return _util.dotpath.get(action, 'definition.interfaces.cli').call(action, commander, dispatch);
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
    return (0, _util.loadProjectFromDirectory)(fromPath || process.env.PWD);
  } catch (error) {
    if (!silent && requestedCommand !== 'init' && requestedCommand !== 'help') {
      console.error('Error loading skypager project. Run this from within a project directory.'.red);

      console.log(error.message);
      console.log(error.stack);
    }
  }
}