module.exports = function run_snapshot_exporter (options = {}) {
  let project = options.project || this
  let entities = project.entities

  let snapshot = {
    entities,
    project: {
      paths: project.paths,
      manifest: project.manifest,
      root: project.root,
      cacheKey: project.cacheKey
    },
    assets: project.run.exporter('assets'),
    content: project.run.exporter('content')
  }

  snapshot.html = project.documents.all.reduce((memo, doc) => {
    memo[doc.id] = doc.html.content
    return memo
  }, {})

  return snapshot
}
