'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.DocumentParserCache = DocumentParserCache;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DocumentParserCache(document, method) {
  var buckets = {
    parse: document.asts.parsed,
    transform: document.asts.transformed,
    index: document.asets.indexed
  };

  var folder = document.project.paths.parser_cache;
  var cache_path = _path2.default.join(folder, document.cacheKey) + '.json';

  var data = undefined;

  try {
    data = require(_path2.default.resolve(cache_path));
    return data[method];
  } catch (e) {
    buckets[method] = document[method].call(document);

    var cachePayload = (0, _stringify2.default)(buckets);

    _fs2.default.writeFile(_path2.default.resolve(cache_path), cachePayload, function (err, result) {
      if (err) {
        throw err;
      }
    });

    return buckets[method];
  }
}