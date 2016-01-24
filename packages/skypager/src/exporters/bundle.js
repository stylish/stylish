export function BrowserBundle (options = {}) {
  let project = options.project = this

  if (options.asset && options.collection) {
    return AssetExporter.apply(project, arguments)
  }

  if (options.project) {
    return ProjectExporter.apply(project, arguments)
  }
}

export function AssetExporter (options = {}, callback) {
  let write = require('fs').writeFileSync
  let mkdir = require('mkdirp').sync
  let dirname = require('path').dirname

  let project = this
  let { asset, inPath, outPath } = options

  if (!asset.raw) {
    asset.runImporter('disk', {sync: true})
  }

  let output = {
    id: asset.id,
    paths: asset.paths,
    assetGroup: asset.assetGroup
  }

  if (asset.assetGroup === 'data_sources') {
    output = Object.assign(output, {
      data: asset.data
    })
  }

  if (asset.assetGroup === 'documents') {
    output = Object.assign(output, {
      markdown: asset.raw,
      ast: asset.indexed,
      indexes: asset.indexes,
      html: asset.html.content
    })
  }

  mkdir(dirname(outPath))
  write(outPath, `var data = module.exports = ${ JSON.stringify(output) };`)

  return outPath
}

export function ProjectExporter (options = {}, callback) {
  let project = options.project

  project.allAssets.forEach(asset => {
    try {
    } catch (error) {
      console.log(`error importing asset: ${ asset.id }`)
      throw(error)
    }
  })

  let mkdir = require('mkdirp').sync

  const keys = Object.keys(project.content)

  keys.forEach(key => {
    mkdir(project.path('build', 'bundle', key))
  })

  let src = [`exports = module.exports = {}`]

  keys.forEach(key => {
    let collection = project.content[key]

    src.push(`var _${ key } = exports.${ key } = {};`)

    collection.forEach(asset => {
      options.asset = asset

      var requirePath = AssetExporter.call(this, {
        outPath: project.path('build', 'bundle', asset.paths.project.replace(/\.\w+$/,'.js')),
        inPath: asset.paths.project,
        asset: asset
      })

      src.push(`_${ key }['${ asset.id }'] = require('${requirePath}');`)
    })
  })

  let write = require('fs').writeFileSync
  var content = src.join("\n")

  write(project.path('build','bundle','index.js'), content, 'utf8')

  return content
}

export default BrowserBundle
