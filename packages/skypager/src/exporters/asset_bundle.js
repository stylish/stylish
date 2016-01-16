export function CollectionBundle(options = {}){
  let project = options.project = options.project || this

  if (options.project && !options.asset) {  
    let re = ProjectExporter.call(options.project, options)
    return re
  }

  if (options.asset) {
    return AssetExporter.call(options.asset, options)
  }

}

function ProjectExporter(options = {}){
  let project = options.project

  const keys = Object.keys(project.content)
  
  let obj =  {}
  
  keys.forEach(key => {
    let collection = project.content[key]
    
    obj[key] = collection.reduce((memo,asset) => {
      memo[asset.paths.project] = AssetExporter.call(asset)
      return memo
    }, {})
  })
  
  return obj
}

function AssetExporter(options = {}){
  let asset = options.asset || this

  return {
    id: asset.id,
    uri: asset.uri,
    fingerprint: asset.fingerprint,
    loaderString: asset.loaderString,
    path: asset.paths.project
  }
}

export default AssetManifest
