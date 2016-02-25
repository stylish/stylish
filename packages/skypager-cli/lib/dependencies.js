'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.missingSupportPackages = missingSupportPackages;
exports.missingRequiredPackages = missingRequiredPackages;
exports.checkAll = checkAll;
exports.getPaths = getPaths;
exports.getPathsGlobal = getPathsGlobal;

var _util = require('./util');

var _path = require('path');

var _values = require('lodash/values');

var _values2 = _interopRequireDefault(_values);

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _transform = require('lodash/transform');

var _transform2 = _interopRequireDefault(_transform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requiredPackages = {
  'skypager-project': process.env.SKYPAGER_PROJECT_ROOT,
  'babel-preset-skypager': process.env.BABEL_PRESET_SKYPAGER_ROOT
};

var supportPackages = {
  'skypager-devpack': process.env.SKYPAGER_DEVPACK_ROOT,
  'skypager-electron': process.env.SKYPAGER_ELECTRON_ROOT,
  'skypager-server': process.env.SKYPAGER_SERVER_ROOT,
  'skypager-themes': process.env.SKYPAGER_THEMES_ROOT
};

var _Object = Object;
var keys = _Object.keys;
function missingSupportPackages() {
  return keys(supportPackages).filter(function (key) {
    return typeof supportPackages[key] !== 'undefined';
  });
}

function missingRequiredPackages() {
  return keys((0, _values2.default)(requiredPackages, 'skypager-cli')).filter(function (key) {
    return typeof requiredPackages[key] !== 'undefined';
  });
}

function checkAll() {
  var req = keys(requiredPackages).map(function (packageName) {
    return (0, _util.findPackage)(packageName).then(function (dir) {
      return requiredPackages[packageName] = process.env[toEnv(packageName)] = dir;
    });
  });

  var sup = keys(supportPackages).map(function (packageName) {
    return (0, _util.findPackage)(packageName).then(function (dir) {
      return supportPackages[packageName] = process.env[toEnv(packageName)] = dir;
    });
  });

  return _promise2.default.all(req.concat(sup));
}

function toEnv(packageName) {
  return (packageName + '-root').toUpperCase().replace(/\-/, '_');
}

function getPaths() {
  var paths = (0, _assign2.default)({}, requiredPackages, supportPackages);

  return (0, _transform2.default)(paths, function (result, key, value) {
    result[(0, _camelCase2.default)(key.replace(/skypager\-/g, ''))] = value;
  }, paths);
}

function getPathsGlobal() {
  return global.$skypager = global.$skypager || getPaths();
}