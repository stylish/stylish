function CollectionBundle(options = {}){
  let project = options.project || this

  let error = project.logger.error

  let bundle = { }

  let allAssets = project.allAssets || []

    allAssets.forEach(asset => {
      try {
        if(!asset.raw) { asset.runImporter('disk', {sync:true}) }
      } catch(e) {
        error('collection bundle error: ' + asset.uri)
        throw(e)
      }
    })

  allAssets.forEach(asset => {
    try {
      let entry = bundle[asset.paths.projectRequire] = {
        id: asset.id,
        uri: asset.uri,
        raw: asset.raw,
        fingerprint: asset.fingerprint,
        path: asset.paths.projectRequire
      }

      if (asset.assetClass.name === 'DataSource' || asset.assetClass.name === 'Document') {
        entry.data = asset.data
      }

    } catch(e) {
      error("Collection Bundle Asset Error", e.message)
      throw(e)
    }
  })

  return bundle
}

module.exports = CollectionBundle
