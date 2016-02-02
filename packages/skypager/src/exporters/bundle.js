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
  let project = this
  let { asset } = options

  if (!asset.raw) {
    asset.runImporter('disk', {sync: true})
  }

  // temp disable
  let requirePath = asset.fingerprint && false
    ? asset.paths.project.replace(/\.\w+$/,`-${ asset.fingerprint.substr(0,6) }.js`)
    : asset.paths.project.replace(/\.\w+$/,'.js')

  let outPath = project.path('build','bundle', requirePath)

  /*if (exists(outPath)) {
    return { requirePath }
  }*/

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

  write(outPath, `module.exports = ${ JSON.stringify(output) };`)

  return {
    requirePath
  }
}

const IncludeExporters = ['assets', 'entities', 'project', 'models' ]

export function ProjectExporter (options = {}, callback) {
  let project = options.project


  if (options.runIncluded !== false) {
    IncludeExporters.forEach(exporter =>
      runAndSave(project, exporter, options)
    )
  }

  let lines = [
    `exports.project = require('./project-export.json');`,
    `exports.entities = require('./entities-export.json');`,
    `exports.assets = require('./assets-export.json');`,
    `exports.models = require('./models-export.json');`,
    `
    exports.requireContexts = {
      scripts: require.context('${ project.scripts.paths.absolute }', true, /\.js$/i),
      stylesheets: require.context('${ project.stylesheets.paths.absolute }', true, /\..*ss$/i)
    };
    exports.content = {}`
  ]

  keys(project.content).forEach(key => {
    lines.push(`var _${ key } = exports.content.${ key } = {};`)

    project.content[key].forEach(asset => {
      let { requirePath } = AssetExporter.call(project, { asset, options, key })
      lines.push(`_${ key }['${ asset.id }'] = require('./${requirePath}');`)
    })
  })

  return write(
    project.path('build','bundle','index.js'), lines.join("\n")
  )
}

export default BrowserBundle

function runAndSave(project, exporter, options) {
  write (
    project.path('build', 'bundle', `${ exporter }-export.json`),
    JSON.stringify(project.run.exporter(exporter, options))
  )
}

function mkdir(...args) {
   return require('mkdirp').sync(...args)
}

function write(path, contents) {
  mkdir(require('path').dirname(path))
  require('fs').writeFileSync(path, contents, 'utf8')

  return contents
}

function exists(...args) {
   return require('fs').existsSync(...args)
}

function generateRequireContexts (project) {

}

const { keys } = Object
