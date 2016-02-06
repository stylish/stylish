'use strict';

module.exports = function run_entities_exporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project || this;

  project.eachAsset(function (asset) {
    if (!asset.raw) {
      asset.runImporter('disk', { sync: true });
    }
  });

  var entities = project.entities || {};

  return entities;
};