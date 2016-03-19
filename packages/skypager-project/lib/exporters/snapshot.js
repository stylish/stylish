'use strict';

module.exports = function run_snapshot_exporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = options.project || this;
  var entities = project.entities;

  var snapshot = {
    entities: entities,
    project: {
      paths: project.paths,
      manifest: project.manifest,
      root: project.root,
      cacheKey: project.cacheKey
    },
    assets: project.run.exporter('assets'),
    content: project.run.exporter('content'),
    settings: project.run.exporter('settings')
  };

  snapshot.html = project.documents.all.reduce(function (memo, doc) {
    memo[doc.id] = doc.html.content;
    return memo;
  }, {});

  return snapshot;
};