module.exports = function run_snapshot_exporter (options = {}) {
  let project = options.project || this;
  let entities = project.entities

  let snapshot = {
    entities,
    project: {
      paths: project.paths,
      manifest: project.manifest,
      root: project.root,
      cacheKey: project.cacheKey
    },
    assets: project.run.exporter('asset_manifest'),
    content: project.run.exporter('collection_bundle')
  }

  snapshot.html = project.documents.all.reduce((memo, doc) => {
    try {
      memo[doc.id] = doc.html.content
    } catch (error) {
      console.log('HTML Rendering Error', error.message)
    }
    return memo
  }, {})

  return snapshot
}
