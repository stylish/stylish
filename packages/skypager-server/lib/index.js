'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultServerSettings = undefined;
exports.dashboard = dashboard;
exports.deepstream = deepstream;
exports.server = server;

var _dashboard = require('./dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _server = require('./server');

var _deepstream = require('./deepstream');

var _deepstream2 = _interopRequireDefault(_deepstream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultServerSettings = exports.defaultServerSettings = _server.defaultSettings;

function dashboard(params) {
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var dashboard = new _dashboard2.default(params, context);

  dashboard.start();

  return dashboard;
}

function deepstream() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var deepstream = new _deepstream2.default(params, context);

  deepstream.start();

  return deepstream;
}

function server() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var server = new _server.Server(params, context);

  server.start();

  return server;
}