/**
 * The Skypager.Asset is an abstract container representing a single file
 * of a specific type (e.g. javascript, markdown, css).
 *
 * Assets have a `uri` property which is either a file system path or URL on a remote server.
 *
 * Assets provide metadata about files, and a mechanism for determining relationships between
 * other files in the project.
 *
 * Asset classes define a `parse`, `index`, and `transform` interface that can delegate
 * to different libraries that provide us with access to an AST for the given type of file.
 *
 * For example `mdast` or `remark` for markdown, babel for javascript, cheerio for html and svg.
 *
 * The main goal behind having access to the ASTs of different files is extracting entities
 * and references from the Asset for the purposes of building applications which allow for
 * programatic manipulation of groups of related assets.
 *
 */
import { extname, dirname, join, basename } from 'path'
import { singularize, pluralize, tableize, template, flatten, assign, hidden, lazy } from '../util'

import invariant from 'invariant'
import md5 from 'md5'
import pick from 'lodash/pick'
import result from 'lodash/result'

import Collection from '../collection'

const EXTENSIONS = ['js', 'css', 'html']
const GLOB = '**/*.{' + EXTENSIONS.join(',') + '}'

module.exports = class Asset {
  static EXTENSIONS = EXTENSIONS;

  static GLOB = GLOB;

  /**
   * Create a collection of Assets for this particular class.
   *
   * @see Skypager.Collection
   *
   * @param {Project} project which project does this collection belong to
   * @param {Object} options options for the collection
   */
  static createCollection (project, options = {}) {
    let assetClass = this
    let root = options.root || project.paths[tableize(assetClass.name)]

    return new Collection({
      root,
      project,
      assetClass,
      ...options
    })
  }

  static _decorateCollection(collection, options = {}) {
    if (typeof this.decorateCollection === 'function') {
      this.decorateCollection(collection, options)
    }
  }

  static _collectionDidLoadAssets(collection, options = {}) {
    if (typeof this.collectionDidLoadAssets === 'function') {
      this.collectionDidLoadAssets(collection, options)
    }
  }

  /**
   * @private
   *
   * Create an asset for a given uri. This will usually be handled automatically
   * by the collection or project.
   *
   * @param {String} uri A URI or file system path which can access the file
   * @param {Object} options
   */
  constructor (uri, options = {}) {
    let asset = this
    let { collection, project } = options
    let raw = options.raw || options.contents

    invariant(uri, 'Must specify a URI for an asset')
    invariant(collection, 'Must specify the collection this asset belongs to')

    if (!project) { project = collection.project }

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

    this.hidden('slug', () => this.id.replace(/\//g,'__'))

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

    return template(string, {
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
    return pick(this, ...args)
  }

  get(...args) {
    return result(this, ...args)
  }

  result(...args) {
    return result(this, ...args)
  }

  runImporter(importer = 'disk', options = {}, callback){
    assign(options, {asset: this, project: this.project, collection: this.collection})
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

  /**
   * Return the name of a file that can be used to store information for this file
   * in the project cache directory.
   */
  get cacheFilename () {
    return [this.cacheKey, this.extension].join('')
  }

  hidden (...args) { return hidden.getter(this, ...args) }

  lazy (...args) { return lazy(this, ...args) }

  render (ast = 'transformed', options = {}) { }

  assetWasImported () { }

  assetWasProcessed () { }

  contentWillChange (oldContent, newContent) { }

  contentDidChange (asset) { }

  /**
   * The groupName of an asset is the name of the folder it belongs to
   * inside of the collection.
   *
   * @example the scripts collection found at <projectRoot>/src
   *
   *    Given the following folder structure:
   *
   *    - src/
   *      - components/
   *        - TableView/
   *          - index.js
   *      - screens/
   *        - HomePage/
   *          - index.js
   *
   *    The asset components/TableView has a groupName of "components"
   *
   *    The asset screens/HomePage has a groupName of "screens"
   */
  get groupName() {
    return this.id == 'index'
      ? this.collection.name
      : pluralize(
          this.paths.relative.split('/')[0]
        )
  }

  /**
   * A singularized version of Asset#groupName
   *
   */
  get type() {
    return singularize(this.paths.relative.split('/')[0])
  }

  get assetClass () {
    return this.collection.AssetClass
  }

  get assetGroup () {
    return tableize(this.assetClass.name)
  }

  /**
   * If an asset belongs to a folder like components, layouts, etc.
   * then the categoryFolder would be components
   *
   * @return {String}
   */
  get category () {
    if (this.id === 'index' || this.dirname === 'src') {
      return this.assetGroup
    }

    let result = this.isIndex
      ? tableize(basename(dirname(this.dirname)))
      : tableize(basename(this.dirname))

    switch(result) {
      case 'srcs':
        return 'scripts'
      default:
        return result
    }
  }

  /**
   * @alias Asset#category
   */
  get assetFamily() {
    return this.categoryFolder
  }

  /**
   * @alias Asset#category
   */
  get categoryFolder() {
    return this.category
  }


  /**
   * Returns the parent folder of this asset
   *
   * @return {String}
   */
  get parentdir () {
    return dirname(this.dirname)
  }

  /**
   * Returns the folder this asset belongs to
   *
   * @return {String}
   */
  get dirname () {
    return dirname(this.paths.absolute)
  }

  /**
   * Returns this assets extension
   *
   * @return {String}
   */
  get extension () {
    return extname(this.uri)
  }

  /**
   * Returns true if this asset is an index
   */
  get isIndex () {
     return !!this.uri.match(/index\.\w+$/)
  }

  /**
   * How many folders deep is this asset inside of the collection
   *
   * @return {Number}
   */
  get depth () {
    return this.id.split('/').length
  }

  /**
   * Return different path values for this asset.
   *
   * - absolute,
   * - relative to collection,
   * - relative to the project
   *
   * @return {Object}
   */
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
   * Return an object which provides access to all assets related to this one.
  */
  get related () {
    return relationshipProxy(this)
  }

  /**
  * Require this asset by its absolute path.
  */
  require () {
    if (this.requireable) { return require(this.paths.absolute) }
  }

  /**
   * can this asset be natively required? checks require.extensions
   *
   * @return {Boolean}
   */
  get requireable () {
    return typeof (require.extensions[this.extension]) === 'function'
  }

  /**
  *
  * @param {Boolean} options.allowEmpty
  *
  * Save this asset by flushing the raw contents
  * of the asset to disk.  If there is no raw content, or if it is
  * zero length, you must pass a truthy value for allowEmpty
  *
  * @return {Promise}
  *
  */
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

  /**
   * Synchronously save this asset by flushing the raw contents
   * of the asset to disk.  If there is no raw content, or if it is
   * zero length, you must pass a truthy value for allowEmpty
   *
   * @param {Boolean} options.allowEmpty
   */
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
      return flatten(groups.map(group => i[group]))
    }
  }

  let content = asset.project.content

  groups.forEach(group => {
    assign(i, {
      get [group] () {
        let related = content[group].relatedGlob(asset)
        return related.filter(a => a.paths.absolute != asset.paths.absolute)
      }
    })
  })

  return i
}

const { defineProperties } = Object
