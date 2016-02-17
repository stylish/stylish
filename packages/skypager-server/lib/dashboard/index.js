'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/dashboard/index.js';
exports.dashboard = dashboard;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _reactBlessed = require('react-blessed');

var _App = require('./App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dashboard(server, options) {
  // Create our screen
  var screen = _blessed2.default.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Skypager',
    dockBorders: true
  });

  // Let user quit the app
  screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
  });

  // Render React component into screen
  (0, _reactBlessed.render)(_react2.default.createElement(_App2.default, { options: options,
    logPath: server.logPath,
    project: server.project,
    env: options.env,
    processes: server.processes,
    screen: screen, __source: {
      fileName: _jsxFileName,
      lineNumber: 21
    }
  }), screen);

  // Don't overwrite the screen
  console.log = function () {};
  console.warn = function () {};
  console.error = function () {};
  console.info = function () {};
  console.debug = function () {};
}

exports.default = dashboard;