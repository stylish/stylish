import pick from 'lodash/pick'

const IncludeData = ['data_sources','settings_files','copy_files','documents']
const IncludeExporters = ['entities','settings', 'copy']
const AssetFields = ['id','assetGroup', 'categoryFolder', 'fingerprint', 'paths']
const IncludeCollections = [
 'documents',
 'data_sources',
 'copy_files',
 'settings_files',
 'scripts',
 'stylesheets',
 'packages',
 'projects',
 'vectors'
]


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

  let output = pick(asset, AssetFields)

  if (IncludeData.indexOf(asset.assetGroup) >= 0) {
    output = Object.assign(output, {
      data: asset.data
    })
  }

  if (asset.assetGroup === 'vectors') {
    output = Object.assign(output, {
      raw: asset.raw.replace(/^\uFEFF/,'')
    })
  }

  if (asset.assetGroup === 'documents') {
    output = Object.assign(output, {
      markdown: asset.raw,
      ast: asset.indexed,
      indexes: asset.indexes,
      html: asset.html.content,
      data: asset.data || asset.metadata,
      title: attempt(() => asset.documentTitle),
      mainCopy: attempt(() => asset.mainCopy)
    })
  }

  write(outPath, `module.exports = ${ JSON.stringify(output) };`)

  return {
    requirePath
  }
}


export function ProjectExporter (options = {}, callback) {
  let project = options.project

  if (options.runIncluded !== false) {
    IncludeExporters.forEach(exporter =>
      runAndSave(project, exporter)
    )
  }

  let lines = [
    contextPolyfill(),
    `var bundle = module.exports = {bundleApi:2, content: {}};`,
  ]

  lines.push(
    `try { bundle.entities = require('./entities-export.json'); } catch(error) { bundle.entities = {error: error.message} }`,
    `try { bundle.settings = require('./settings-export.json'); } catch(error) { bundle.settings = {error: error.message} }`,
    `try { bundle.copy = require('./copy-export.json'); } catch(error) { bundle.copy = {error: error.message} }`,

    `bundle.requireContexts = {
      scripts: require.context('${ project.scripts.paths.absolute }', true, /\.js$/i),
      stylesheets: require.context('${ project.stylesheets.paths.absolute }', true, /\..*ss$/i)
    };`,
  )

   IncludeCollections.forEach(key => {
    lines.push(`var _${ key } = bundle.content.${ key } = {};`)

    if (!project.content[key]) {
      console.error('No such content colection', key, Object.keys(project.content))
      throw('No such content collection ' + key)
    }

    project.content[key].forEach(asset => {
      let { requirePath } = AssetExporter.call(project, { asset, options, key })
      lines.push(`_${ key }['${ asset.id }'] = require('./${requirePath}');`)
    })
  })

  lines.push(`module.exports = bundle`)

  return write(
    project.path('build','bundle','index.js'), lines.join("\n")
  )
}

export default BrowserBundle

function runAndSave(project, exporter) {
  write (
    project.path('build', 'bundle', `${ exporter }-export.json`),
    JSON.stringify(project.run.exporter(exporter))
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

function contextPolyfill(){
return
`if (typeof require.context === 'undefined') {
  require.context = function(){
    return {
      keys:function(){ return [] },
      req:function(){}
    }
  }
}`
}

function attempt(fn) {
  try { return fn() } catch(error) {}
}
