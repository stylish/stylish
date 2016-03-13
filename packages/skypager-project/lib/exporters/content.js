'use strict';

function CollectionBundle() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project || this;

  var error = project.logger.error;

  var bundle = {};

  var allAssets = project.allAssets || [];

  allAssets.forEach(function (asset) {
    try {
      if (!asset.raw) {
        asset.runImporter('disk', { sync: true });
      }
    } catch (e) {
      error('collection bundle error: ' + asset.uri);
      throw e;
    }
  });

  allAssets.forEach(function (asset) {
    try {
      var entry = bundle[asset.paths.projectRequire] = {
        id: asset.id,
        uri: asset.uri,
        raw: asset.raw,
        fingerprint: asset.fingerprint,
        path: asset.paths.projectRequire
      };

      if (asset.assetClass.name === 'DataSource' || asset.assetClass.name === 'Document') {
        entry.data = asset.data;
      }
    } catch (e) {
      error("Collection Bundle Asset Error", e.message);
      throw e;
    }
  });

  return bundle;
}

module.exports = CollectionBundle;