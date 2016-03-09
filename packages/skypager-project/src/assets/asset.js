import Skypager from '../index'
import Collection from '../collection'

import { extname, dirname, join, basename } from 'path'
import md5 from 'md5'
import * as util from '../util'

const EXTENSIONS = ['js', 'css', 'html']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

const { defineProperties } = Object

const { singularize, pluralize } = util

import pick from 'lodash/pick'

class Asset {
  static EXTENSIONS = EXTENSIONS;

  static GLOB = GLOB;

  static decorateCollection (collection) {
    if (this.collectionInterface) {
      defineProperties(collection, this.collectionInterface(collection))
    }
  }

  constructor (uri, options = {}) {
    let asset = this
    let raw

    defineProperties(this, {
      raw: {
        enumerable: false,
        get: function() { return raw },
        set: function(val) { var oldVal = raw; raw = val; asset.contentDidChange(raw, oldVal) }
      }
    })

    this.hidden('uri', uri)
    this.hidden('options', options)
    this.hidden('project', () => options.project)
    this.hidden('collection', () => options.collection)

    this.id = this.generateId()
    this.slug = this.id.replace(/\//g,'__')

    this.lazy('parsed', () => this.parse(this.raw))
    this.lazy('indexed', () => this.index(this.parsed, this))
    this.lazy('transformed', () => this.transform(this.indexed, this))
    this.lazy('data', this.getData, true)
  }

  getData() {
    return this.frontmatter || {}
  }

  get metadata() {
    return this.frontmatter
  }

  get frontmatter() {
    return {}
  }

  generateId() {
     return this.paths.relative.replace(this.extension, '')
  }

  templater (string) {
    let asset = this
    let project = asset.project

    let accessibleEnvVars = project.vault.templates.accessibleEnvVars

    return util.template(string, {
      imports: {
        get project() {
          return asset.project
        },
        get settings () {
          return asset.project && asset.project.settings
        },
        get collection () {
          return asset.collection
        },
        get self () {
          return asset
        },
        get process () {
          return {
            env: pick(process.env, ...accessibleEnvVars)
          }
        },
        get env () {
          return pick(process.env, ...accessibleEnvVars)
        }
      }
    })
  }

  pick(...args) {
    return util.pick(this, ...args)
  }

  get(...args) {
    return util.result(this, ...args)
  }

  result(...args) {
    return util.result(this, ...args)
  }

  runImporter(importer = 'disk', options = {}, callback){
    util.assign(options, {asset: this, project: this.project, collection: this.collection})
    this.project.run.importer(importer, options, callback || this.assetWasImported.bind(this))
  }

  get fingerprint () {
    return this.raw && md5(this.raw)
  }

  get idPath () {
    return this.id.replace(/-/g, '_').replace(/\//g, '.')
  }

  ensureIndexes () {
    let asset = this

    if (!asset.parsed) { asset.parsed = asset.parse(asset.raw, asset) }
    if (!asset.indexed) { asset.indexed = asset.index(asset.parsed, asset) }

    return asset.indexed
  }

  parse () {
    return this.parser && this.parser(this.raw, this)
  }

  index () {
    return this.indexer && this.indexer(this.parsed, this)
  }

  transform () {
    return this.transformer && this.transformer(this.indexed, this)
  }

  get modelClass () {
    return this.project.resolve.model(this)
  }

  get modelDefiniton () {
    return this.modelClass && this.modelClass.definition
  }

  get cacheKey () {
    return [this.id, this.fingerprint.substr(0, 6)].join('-')
  }

  get cacheFilename () {
    return [this.cacheKey, this.extension].join('')
  }

  hidden (...args) { return util.hidden.getter(this, ...args) }

  lazy (...args) { return util.lazy(this, ...args) }

  render (ast = 'transformed', options = {}) {
  }

  assetWasImported () {
  }

  assetWasProcessed () {
  }

  contentWillChange (oldContent, newContent) {
  }

  contentDidChange (asset) {

  }

  get type() {
    return singularize(this.paths.relative.split('/')[0])
  }

  get groupName() {
    return this.id == 'index'
      ? this.collection.name
      : pluralize(this.paths.relative.split('/')[0])
  }

  get assetClass () {
    return this.collection.AssetClass
  }

  get assetGroup () {
    return util.tableize(this.assetClass.name)
  }

  get assetFamily() {
    return this.categoryFolder
  }
  /**
   * If an asset belongs to a folder like components, layouts, etc.
   * then the categoryFolder would be components
   *
   * @return {String}
   */
  get categoryFolder () {
    if (this.id === 'index' || this.dirname === 'src') {
      return this.assetGroup
    }

    return this.isIndex
      ? util.tableize(basename(dirname(this.dirname)))
      : util.tableize(basename(this.dirname))
  }

  get parentdir () {
    return dirname(this.dirname)
  }

  get dirname () {
    return dirname(this.paths.absolute)
  }

  get extension () {
    return extname(this.uri)
  }

  get isIndex () {
     return !!this.uri.match(/index\.\w+$/)
  }

  get depth () {
    return this.id.split('/').length
  }

  get paths () {
    let asset = this

    return {
      // relative to the collection root
      get relative () {
        return asset.uri.replace(/^\//, '')
      },
      // relative to the project root
      get project () {
        return join(asset.collection.root, asset.uri.replace(/^\//, '')).replace(asset.project.root + '/', '')
      },
      get projectRequire () {
        return join(asset.collection.root, asset.uri.replace(/^\//, '')).replace(asset.project.root + '/', '')
      },
      get absolute () {
        return join(asset.collection.root, asset.uri.replace(/^\//, ''))
      }
    }
  }

  /**
  * Return any datasources which exist in a path
  * that is identically named to certain derivatives of ours
  */

  get related () {
    return relationshipProxy(this)
  }

  __require () {
    if (this.requireable) { return require(this.uri) }
  }

  get requireable () {
    return typeof (require.extensions[this.extension]) === 'function'
  }

  get extension () {
    return extname(this.uri)
  }

  loadWithWebpack () {
    let string = [this.loaderString, this.uri].join('!')
    return require(string)
  }

  saveSync (options = {}) {
    if (!this.raw || this.raw.length === 0) {
      if (!options.allowEmpty) {
        return false
      }
    }

    return require('fs').writeFileSync(
       this.paths.absolute,
       this.raw,
       'utf8'
    )
  }

  save (options = {}) {
    if (!this.raw || this.raw.length === 0) {
      if (!options.allowEmpty) {
        return false
      }
    }

    return require('fs-promise').writeFile(
       this.paths.absolute,
       this.raw,
       'utf8'
    )
  }

  static createCollection (project, options = {}) {
    let assetClass = this
    let root = project.paths[util.tabelize(assetClass.name)]

    return new Collection({
      root,
      project,
      assetClass,
      ...options
    })
  }
}

function relationshipProxy (asset) {
  const groups = [
    'assets',
    'data_sources',
    'documents',
    'images',
    'scripts',
    'packages',
    'projects',
    'settings_files',
    'copy_files',
    'stylesheets',
    'vectors'
  ]

  let i = {
    get count(){
      return i.all.length
    },
    get all(){
      return util.flatten(groups.map(group => i[group]))
    }
  }

  let content = asset.project.content

  groups.forEach(group => {
    util.assign(i, {
      get [group] () {
        let related = content[group].relatedGlob(asset)
        return related.filter(a => a.paths.absolute != asset.paths.absolute)
      }
    })
  })

  return i
}

exports = module.exports = Asset
