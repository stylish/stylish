module.exports = function run_entities_exporter (...args) {
  let context = args[args.length - 1] || {}
  let project = context.project || this

  if (!project) {
    console.log(arguments)
    throw('wtf')
  }

  project.eachAsset(asset => {
    if(!asset.raw) { asset.runImporter('disk', {sync: true}) }
  })

  let entities = project.entities || {}

  return entities
}

