'use strict';

module.exports = updatePackageManifest;

function updatePackageManifest() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var merge = require('lodash/object/merge');
  var doc = options.document || options.asset;
  var fs = require('fs-promise');

  Object.assign(doc, {
    updateManifest: function updateManifest() {
      var changes = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var data = doc.sourcePath && doc.readManifest();
      var nextData = merge(data, changes);

      fs.writeFile(doc.manifestPath, JSON.stringify(nextData, null, 2)).then(function (result) {
        console.log('Updated ' + doc.sourcePath);
      });
    }
  });
}