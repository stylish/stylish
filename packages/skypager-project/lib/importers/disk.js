'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.DiskImporter = DiskImporter;
exports.AssetImporter = AssetImporter;
exports.ProjectImporter = ProjectImporter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* A non-blocking script which consolidates all interaction with the file system.
*
* The thinking behind separating this was inspired by the desire to have the skypager
* library also work in the browser, but have swappable backends for asset and data source
* content.
*/
function DiskImporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var project = options.project = options.project || this;

  if (options.asset && options.collection) {
    return AssetImporter.apply(project, arguments);
  }

  if (options.project) {
    return ProjectImporter.apply(project, arguments);
  }
}

/*
* This assumes an asset is in the collection already.

*/
function AssetImporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var asset = options.asset;

  var callback = options.onComplete;

  if (typeof context === 'function') {
    callback = context;
  }

  if (options.sync) {
    asset.raw = require('fs').readFileSync(asset.paths.absolute).toString();
    callback && callback(this);
  } else {
    assetLoader(options, callback);
  }

  return asset;
}

function ProjectImporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var path = require('path');
  var project = this;
  var collections = options.collections || project.content;
  var autoLoad = options.autoLoad || {};

  (0, _keys2.default)(collections).forEach(function (name) {
    var collection = collections[name];
    collection.loadAssetsFromDisk();
  });

  var callback = options.onComplete;

  callback && callback(project, options);

  return project;
}

exports.default = DiskImporter;

function assetLoader() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var callback = arguments[1];

  var _require, readFile, asset, collection, raw;

  return _regenerator2.default.async(function assetLoader$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _require = require('fs-promise');
          readFile = _require.readFile;
          asset = options.asset;
          collection = options.collection;
          _context.prev = 4;
          _context.next = 7;
          return _regenerator2.default.awrap(readFile(asset.paths.absolute).then(function (buffer) {
            return buffer.toString();
          }));

        case 7:
          raw = _context.sent;

          asset.raw = raw;
          asset.assetWasImported();
          _context.next = 16;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context['catch'](4);

          asset.error = _context.t0;
          throw _context.t0;

        case 16:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[4, 12]]);
}