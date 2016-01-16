/**
* EXPERIMENTAL
*/
export function WebpackImporter (options = {}) {
  let project = options.project = this

  if (options.asset && options.collection) {
    return AssetImporter.apply(project, arguments)
  }

  if (options.project) {
    return ProjectImporter.apply(project, arguments)
  }
}

function AssetImporter(options = {}, callback){
  let { asset, collection, compiler, project } = this
}

function ProjectImporter(options = {}){
  let path = require('path')
  let glob = require('glob')
  let project = this
  let collections = options.collections || project.content
  let autoLoad = options.autoLoad || {}

  let webpack = options.webpack

  Object.keys(collections).forEach(name => {
    let collection = collections[name]
    let pattern = collection.AssetClass.GLOB

    let paths = glob.sync(pattern, {
      cwd: collection.root
    })

    collection._willLoadAssets(paths)

    paths.forEach(rel => {
      let uri = path.join(collection.root, rel)
      let asset = new collection.AssetClass(rel, {collection: collection, project: project})

      collection.add(asset, false, true)

      if (autoLoad[name]) {
        AssetImporter.call(project, {compiler, project, collection, asset})
      }
    })

    collection._didLoadAssets(paths, false)
  })

  callback && callback(project, options)

  return project
}
