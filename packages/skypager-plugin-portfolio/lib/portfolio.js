'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrLoadFromPath = createOrLoadFromPath;

var _skypagerProject = require('skypager-project');

var _skypagerProject2 = _interopRequireDefault(_skypagerProject);

var _fs = require('fs');

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createOrLoadFromPath(portfolioRoot) {
  if (!(0, _fs.existsSync)(portfolioRoot)) {}
}