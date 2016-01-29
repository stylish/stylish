'use strict';

module.exports = sourcePathReader;

function sourcePathReader(options, context) {
  var doc = options.document || options.asset;

  var _require = require('fs');

  var existsSync = _require.existsSync;
  var readFileSync = _require.readFileSync;

  var join = require('path').join;

  Object.assign(doc, {
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