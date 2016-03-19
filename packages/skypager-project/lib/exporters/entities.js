'use strict';

module.exports = function run_entities_exporter() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var context = args[args.length - 1] || {};
  var project = context.project || this;

  if (!project) {
    console.log(arguments);
    throw 'wtf';
  }

  project.eachAsset(function (asset) {
    if (!asset.raw) {
      asset.runImporter('disk', { sync: true });
    }
  });

  var entities = project.entities || {};

  return entities;
};