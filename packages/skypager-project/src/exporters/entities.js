module.exports = function run_entities_exporter (options = {}) {
  let project = options.project || this

  project.eachAsset(asset => {
    if(!asset.raw) { asset.runImporter('disk', {sync: true}) }
  })

  let entities = project.entities || {}

  return entities
}

