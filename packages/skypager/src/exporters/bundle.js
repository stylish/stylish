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
  let fs = require('fs')
  let exists = fs.existsSync
  let project = this
  let { asset } = options

  if (!asset.raw) {
    asset.runImporter('disk', {sync: true})
  }

  let requirePath = asset.fingerprint ? asset.paths.project.replace(/\.\w+$/,`-${ asset.fingerprint }.js`) : asset.paths.project.replace(/\.\w+$/,'.js')
  let outPath = project.path('build','bundle', requirePath)

  let write = fs.writeFileSync
  let mkdir = require('mkdirp').sync
  let dirname = require('path').dirname

  let output = {
    id: asset.id,
    paths: asset.paths,
    assetGroup: asset.assetGroup,
    fingerprint: asset.fingerprint
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

  return {
    requirePath
  }
}

export function ProjectExporter (options = {}, callback) {
  let project = options.project

  let mkdir = require('mkdirp').sync

  const keys = Object.keys(project.content)

  let src = [
    `exports = module.exports = require('./__project.js');`,
    `exports.entities = require('./__entities.js');`,
    `exports.assets = require('./__assets.js');`,
    `exports.content = {}`
  ]

  keys.forEach(key => {
    let collection = project.content[key]

    src.push(`var _${ key } = exports.content.${ key } = {};`)

    collection.forEach(asset => {
      let { requirePath } = AssetExporter.call(project, { asset, options, key })
      src.push(`_${ key }['${ asset.id }'] = require('./${requirePath}');`)
    })
  })

  let write = require('fs').writeFileSync
  var content = src.join("\n")

  write(project.path('build','bundle','index.js'), content, 'utf8')

  return content
}

export default BrowserBundle
