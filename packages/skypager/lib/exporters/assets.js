"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AssetManifest = AssetManifest;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AssetManifest() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project = options.project || this;

  if (options.project && !options.asset) {
    var re = ProjectExporter.call(options.project, options);
    return re;
  }

  if (options.asset) {
    return AssetExporter.call(options.asset, options);
  }
}

function ProjectExporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project;

  var keys = (0, _keys2.default)(project.content);

  var obj = {};

  keys.forEach(function (key) {
    var collection = project.content[key];

    obj[key] = collection.reduce(function (memo, asset) {
      memo[asset.paths.project] = AssetExporter.call(asset);
      return memo;
    }, {});
  });

  return obj;
}

function AssetExporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var asset = options.asset || this;

  return {
    id: asset.id,
    uri: asset.uri,
    fingerprint: asset.fingerprint,
    loaderString: asset.loaderString,
    path: asset.paths.project
  };
}

exports.default = AssetManifest;