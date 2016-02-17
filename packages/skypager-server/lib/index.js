'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultServerSettings = undefined;
exports.dashboard = dashboard;
exports.deepstream = deepstream;
exports.server = server;

var _server = require('./server');

var defaultServerSettings = exports.defaultServerSettings = _server.defaultSettings;

function dashboard(params) {
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var Dashboard = require('./dashboard').Dashboard;
  var proc = new Dashboard(params, context);

  proc.start();

  return proc;
}

function deepstream() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var Deepstream = require('./deepstream').Deepstream;
  var proc = new Deepstream(params, context);

  proc.start();

  return proc;
}

function server() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var Server = require('./proc').Server;
  var proc = new Server(params, context);

  proc.start();

  return proc;
}