'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = sourcePathReader;

function sourcePathReader(options, context) {
  var doc = options.document || options.asset;

  var _require = require('fs');

  var existsSync = _require.existsSync;
  var readFileSync = _require.readFileSync;

  var join = require('path').join;

  (0, _assign2.default)(doc, {
    readManifest: function readManifest() {
      if (doc.sourcePath && doc.sourcePath.length > 0 && existsSync(doc.manifestPath)) {
        return JSON.parse(readFileSync(doc.manifestPath).toString());
      }
    },

    get manifestPath() {
      return this.sourcePath + '/package.json';
    },

    get sourcePath() {
      var data = doc.data;
      var sourcePath = data.sourcePath;

      if (sourcePath && sourcePath.length > 0) {
        return project.join(sourcePath);
      }
    }
  });

  return doc;
}