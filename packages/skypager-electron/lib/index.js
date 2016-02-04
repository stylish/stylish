'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enter = enter;

var _application = require('./application');

var _util = require('skypager/lib/util');

var _yargs = require('yargs');

function enter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var projectPath = options.project || process.env.PWD;
  var project = (0, _util.loadProjectFromDirectory)(projectPath);

  var app = new _application.Application(project);

  if (!_yargs.argv.dontBoot) {
    app.boot();
  }
}