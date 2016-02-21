'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enter = enter;

var _electron = require('electron');

var _application = require('./application');

var _yargs = require('yargs');

var _util = require('skypager-project/lib/util');

var _defaults = require('lodash/object/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function enter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options.project && typeof options.project === 'string') {
    options.project = (0, _util.loadProjectFromDirectory)(options.project || process.env.PWD);
  }

  var project = options.project;

  var SkypagerApp = new _application.Application(project, options);

  if (!(_yargs.argv.dontBoot || options.dontBoot)) {
    SkypagerApp.boot();
  }

  return SkypagerApp;
}

exports.default = enter;