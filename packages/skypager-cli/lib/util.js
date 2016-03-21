'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.findPackageSync = findPackageSync;
exports.findPackage = findPackage;
exports.splitPath = splitPath;
exports.skypagerBabel = skypagerBabel;
exports.pathExists = pathExists;
exports.loadSkypagerFramework = loadSkypagerFramework;
exports.loadProjectFromDirectory = loadProjectFromDirectory;
exports.loadManifestFromDirectory = loadManifestFromDirectory;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _findNodeModules = require('find-node-modules');

var _findNodeModules2 = _interopRequireDefault(_findNodeModules);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var join = _path2.default.join;

function findPackageSync(packageName) {
  var root = arguments.length <= 1 || arguments[1] === undefined ? process.env.PWD : arguments[1];

  var moduleDirectories = (0, _findNodeModules2.default)(root, { relative: false });

  var directory = moduleDirectories.find(function (p) {
    var exists = pathExists(join(p, packageName));
    return exists;
  });

  if (!directory) {
    try {
      var resolvedPath = _path2.default.dirname(require.resolve(packageName));
      return resolvedPath;
    } catch (error) {
      console.log('Error looking up package', packageName, error.message);
    }
  }

  return directory && _path2.default.resolve(_path2.default.join(directory, packageName));
}

function findPackage(packageName) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new _promise2.default(function (resolve, reject) {
    var moduleDirectories = (0, _findNodeModules2.default)(process.env.PWD, { relative: false });
    var directory = moduleDirectories.find(function (p) {
      var exists = pathExists(join(p, packageName));
      return exists;
    });

    if (!directory) {
      try {
        var resolvedPath = _path2.default.dirname(require.resolve(packageName));
        resolve(resolvedPath);
        return;
      } catch (error) {}
    }

    if (!directory) {
      reject(packageName);
    }

    var result = _path2.default.resolve(_path2.default.join(directory, packageName));

    if (result) {
      resolve(result);
    }
  });
}

function splitPath() {
  var p = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  return _path2.default.resolve(p).split(_path2.default.sep);
}

function skypagerBabel() {
  var presets = findPackageSync('babel-preset-skypager');

  try {
    presets ? require('babel-register')({ presets: presets }) : require('babel-register');
  } catch (error) {
    abort('Error loading the babel-register library. Do you have the babel-preset-skypager package?');
  }
}

function pathExists(fp) {
  var fn = typeof _fs2.default.access === 'function' ? _fs2.default.accessSync : _fs2.default.statSync;

  try {
    fn(fp);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Frameworks which extend from Skypager can use this to make sure
 * they have a chance to be the framework responsible for loading projects
 */
function loadSkypagerFramework(id) {
  try {
    return typeof $skypager !== 'undefined' && !id ? require($skypager.project || 'skypager-project') : require(id);
  } catch (error) {
    console.log('Error loading skypager framework module from the CLI. id ' + id);
    throw error;
  }
}

function loadProjectFromDirectory(directory) {
  var frameworkHost = arguments.length <= 1 || arguments[1] === undefined ? 'skypager-project' : arguments[1];

  var exists = require('path-exists');
  var path = require('path');

  var skypagerFramework = typeof frameworkHost === 'string' ? loadSkypagerFramework(frameworkHost) : frameworkHost;

  var manifest = loadManifestFromDirectory(directory) || {};
  var pathToMain = path.join(directory, 'skypager.js');

  if (manifest.skypager && manifest.skypager.main) {
    pathToMain = path.join(directory, manifest.skypager.main.replace(/^\.\//, ''));

    if (!exists(pathToMain)) {
      console.log('The skypager.main value in the package manifest points to a non existing file'.red);
      console.log('Value: ' + manifest.skypager.main + ' Path: ' + pathToMain);
      throw 'Invalid skypager package main';
    }
  }

  if (!exists(pathToMain) && manifest.skypager) {
    pathToMain = join(directory, 'package.json');
  }

  try {
    var projectExport = skypagerFramework.load(pathToMain);

    return typeof projectExport === 'function' ? projectExport.call(skypagerFramework) : projectExport;
  } catch (error) {
    console.log('There was an ' + 'error'.red + ' loading the skypager project from: ' + pathToMain.yellow);
    console.log('Using the skypager framework:', skypagerFramework);
    throw error;
  }
}

function loadManifestFromDirectory(directory) {
  return require('findup-sync')('package.json', { cwd: directory });
}