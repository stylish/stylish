var debug = require('debug')('skypager:exporters')

function CollectionBundle(options = {}){
  try {

  } catch(e) {

  }

  let project = options.project || this

  let bundle = { }

  let allAssets = project.allAssets || []

    allAssets.forEach(asset => {
      try {
        if(!asset.raw) { asset.runImporter('disk', {sync:true}) }
      } catch(e) {
        debug('collection bundle error: ' + asset.uri)
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

      if (asset.assetClass.name == 'DataSource') {
        delete(entry.raw)
        entry.data = asset.data
      }

    } catch(e) {
      debug("Collection Bundle Asset Error", e.message)
      throw(e)
    }
  })

  return bundle
}

module.exports = CollectionBundle
