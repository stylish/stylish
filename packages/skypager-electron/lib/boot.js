'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enter = enter;

var _electron = require('electron');

var _application = require('./application');

var _yargs = require('yargs');

var _util = require('skypager-project/lib/util');

var _defaults = require('lodash/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SkypagerApp = null;

function enter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var shouldQuit = _electron.app.makeSingleInstance(function (commandLine, workingDirectory) {
    if (SkypagerApp) {
      SkypagerApp.restoreFocus();
    }
    return true;
  });

  if (shouldQuit) {
    _electron.app.quit();
  }

  return SkypagerApp = boot(options);
}

function boot() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options.project && typeof options.project === 'string') {
    options.project = (0, _util.loadProjectFromDirectory)(options.project || process.env.PWD);
  }

  var project = options.project;

  var myApp = new _application.Application(project, options);

  if (!(_yargs.argv.dontBoot || options.dontBoot)) {
    myApp.boot(_electron.app);
  }

  return myApp;
}

exports.default = enter;