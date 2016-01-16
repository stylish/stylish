/**
* A non-blocking script which consolidates all interaction with the file system.
*
* The thinking behind separating this was inspired by the desire to have the skypager
* library also work in the browser, but have swappable backends for asset and data source
* content.
*/
export function DiskImporter (options = {}) {
  let project = options.project = this

  if (options.asset && options.collection) {
    return AssetImporter.apply(project, arguments)
  }

  if (options.project) {
    return ProjectImporter.apply(project, arguments)
  }
}

/*
* This assumes an asset is in the collection already.

*/
export function AssetImporter (options = {}, callback) {
  let { asset } = options

  if (options.sync) {
    asset.raw = require('fs').readFileSync(asset.paths.absolute).toString()
    callback && callback(this)
  } else {
    assetLoader(options, callback)
  }

  return asset
}

export function ProjectImporter (options = {}, callback) {
  let path = require('path')
  let glob = require('glob')
  let project = this
  let collections = options.collections || project.content
  let autoLoad = options.autoLoad || {}

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
        AssetImporter.call(project, {project, collection, asset})
      }
    })

    collection._didLoadAssets(paths, false)
  })

  callback && callback(project, options)

  return project
}

export default DiskImporter

async function assetLoader (options = {}, callback) {
  let { readFile } = require('fs-promise')
  let { asset, collection } = options

  try {
    let raw = await readFile(asset.paths.absolute).then((buffer) => buffer.toString())
    asset.raw = raw
    asset.assetWasImported()
  } catch (error) {
    asset.error = error
    throw (error)
  }
}
