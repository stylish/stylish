'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dashboard = dashboard;

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

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

  // Don't overwrite the screen
  console.log = function () {};
  console.warn = function () {};
  console.error = function () {};
  console.info = function () {};
  console.debug = function () {};
}

exports.default = dashboard;