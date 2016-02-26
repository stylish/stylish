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

function loadProjectFromDirectory(directory, skypagerProject) {
  var exists = require('path-exists');
  var path = require('path');

  try {
    skypagerProject = skypagerProject || $skypager && $skypager['skypager-project'] && require($skypager['skypager-project']);
    skypagerProject = skypagerProject || require('skypager-project');
  } catch (error) {
    console.log('There was an error attempting to load the ' + 'skypager-project'.magenta + ' package.');
    console.log('Usually this means it is not installed or can not be found relative to the current directory');
    console.log();
    console.log('The exact error message we received is: '.yellow);
    console.log(error.message);
    console.log('stack trace: '.yellow);
    console.log(error.stack);
    process.exit(1);
    return;
  }

  var manifest = loadManifestFromDirectory(directory);

  if (!manifest) {
    throw 'Could not load project from ' + directory;
  }

  if (manifest.skypager && manifest.skypager.main) {
    return require(path.join(directory, manifest.skypager.main.replace(/^\.\//, '')));
  }

  if (manifest.skypager) {
    return skypagerProject.load(join(directory, 'package.json'));
  }

  if (exists(path.join(directory, 'skypager.js'))) {
    return require(path.join(directory, 'skypager.js'));
  }
}

function loadManifestFromDirectory(directory) {
  return require('findup-sync')('package.json', { cwd: directory });
}