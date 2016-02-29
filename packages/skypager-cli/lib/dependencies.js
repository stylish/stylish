'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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
  keys(requiredPackages).forEach(function (packageName) {
    var dir = undefined;

    try {
      dir = (0, _util.findPackageSync)(packageName);
    } catch (error) {
      console.log('Error finding Required Package ' + packageName, error);
    }

    if (dir) {
      requiredPackages[packageName] = requiredPackages[packageName] || (requiredPackages[packageName] = process.env[toEnv(packageName)] = dir);
    }
  });

  keys(supportPackages).forEach(function (packageName) {
    var dir = (0, _util.findPackageSync)(packageName);

    if (dir) {
      supportPackages[packageName] = supportPackages[packageName] || (supportPackages[packageName] = process.env[toEnv(packageName)] = dir);
    }
  });

  return getPathsGlobal();
}

function toEnv(packageName) {
  return (packageName + '-root').toUpperCase().replace(/\-/g, '_');
}

function getPaths() {
  var paths = (0, _assign2.default)({}, requiredPackages, supportPackages);

  return (0, _transform2.default)(paths, function (result, value, key) {
    result[(0, _camelCase2.default)(key.replace(/skypager\-/g, ''))] = value;
  }, paths);
}

function getPathsGlobal() {
  return global.$skypager = global.$skypager || getPaths();
}