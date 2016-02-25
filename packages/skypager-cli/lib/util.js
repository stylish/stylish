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
    } catch (error) {}
  }

  return _path2.default.resolve(_path2.default.join(directory, packageName));
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
  findPackage('babel-preset-skypager').then(function (path) {
    require('babel-register')({
      presets: [require(path)]
    });
  }, function (err) {
    console.log('Missing the babel-preset-skypager project');
  });
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
  var exists = require('fs').existsSync;
  var path = require('path');

  skypagerProject = skypagerProject || require('skypager-project');

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