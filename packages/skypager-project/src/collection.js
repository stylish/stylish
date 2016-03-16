/**
 * The Skypager.Collection is a wrapper around local file folders
 * which is responsible for assigning different types of Asset Classes
 * to handle different types of source files in the project, which are used to parse,
 * index, and transform these files so that they can be manipulated programmatically
 * loaded into a collection, they can easily be searched, queried, aggregated, related,
 * or whatever.
 *
 * Collections work through simple file extensions and folder naming conventions,
 * however they can be configured to use different patterns and paths to suit your liking.
 */

import {defaults, filterQuery as query, hide, hidden, lazy, tabelize, values} from './util'
import {relative, basename, dirname, extname, resolve, join} from 'path'
import minimatch from 'minimatch'

import get from 'lodash/result'
import groupBy from 'lodash/groupBy'
import invokeMap from 'lodash/invokeMap'
import mapValues from 'lodash/mapValues'
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import transform from 'lodash/transform'
import set from 'lodash/set'

const carve = set

export default class Collection {
  /**
  * Create a Collection for a subfolder of a Skypager Project.
  */
  constructor (options = {}) {
    const { assetClass, project, root } = options
    const collection = this

    collection.root = root

    if (options.exclude && typeof options.exclude === 'string') {
      options.exclude = [options.exclude]
    }

    if (options.include && typeof options.include === 'string') {
      options.include = [options.include]
    }

    defaults(options, {
      autoLoad: false,
      include: [ assetClass.GLOB ],
      exclude: [ '**/node_modules' ],
      name: basename(root)
    })

    collection.name = options.name || basename(root)

    collection.hidden('project', project)
    collection.hidden('AssetClass', () => assetClass)

    Object.assign(this, pick(options, 'include', 'exclude', 'name', 'autoLoad'))

    const assets = { }
    const index = { }

    let loaded = false

    collection.hidden('assets', () => assets )
    collection.hidden('index', () => index )

    // create a way of accessing a collections assets that matches the name of the collection
    if (assetClass.groupName && !collection[assetClass.groupName]) {
      collection.hidden(tabelize(assetClass.groupName), () => collection.assets )
    }

    buildAtInterface(collection, false)

    if (options.autoLoad) {
       this.loadAssetsFromDisk()
    }
  }

  /**
   * Load assets into the collection. By default will load all files which match the include / exclude rules.
   *
   * This will get called automatically if the collection was created with autoLoad set to true.
   *
   * @param {Array} paths an array of paths relative to the collection root
   */
  loadAssetsFromDisk (paths = this.filesInRoot){
    this._willLoadAssets(paths)

    paths.forEach(rel => {
      let asset = this.createAsset(rel)
      this.add(asset, true, true)
    })

    this._didLoadAssets(paths, false)
  }

  /**
   * Returns a unique list of the asset categories in this collection.
   *
   * @return {Array}
   */
  get categories() {
    return this.pluck('categoryFolder').unique()
  }

  /**
   * Returns an object whose keys are the asset category, and value
   * is an array of the asset ids which belong to that category.
   *
   * @return {Object}
   */
  get idsByCategory() {
    let grouped = this.groupBy('categoryFolder')

    return Object.keys(grouped)
    .reduce((memo, group) => {
      memo[group] = grouped[group].pluck('id')
      return memo
    }, {})
  }

  /**
   * Returns all of the assets which are indexes in their folder.
   *
   * This is useful for example when you want to get all of javascript files which are
   * the main entry points for a particular component.
   *
   * @example
   *
   *    project.scripts.query(asset => asset.isIndex && asset.categoryFolder === 'components')
   *
   * @return {Array}
   */
  get indexes() {
    return this.filter(asset => asset.isIndex())
  }

  /**
   * The asset type alias for this collection's Asset Class name.
   *
   * @example
   *
   *    project.docs.assetType // => 'document'
   *
   * @return {String}
   */
  get assetType () {
    return this.AssetClass.typeAlias
  }

  /**
   * A pluralized version of this collection's Asset Class name
   *
   * @return {String}
   */
  get assetGroupName () {
    return this.AssetClass.groupName
  }

  /**
   * A getter that returns all of the files within this collection's root folder.
   *
   * @see globFiles
   *
   * @return {Array}
   *
   */
  get filesInRoot() {
    return this.globFiles()
  }

  /**
   * Returns a list of file paths within this collection's root folder.
   *
   * Will respect the collection's `include` and `exclude` options.
   *
   * @return {Array}
   */
  globFiles() {
    let patterns = this.include

    if (this.project.exists('.skypagerignore')) {
      /*patterns = patterns.concat(
        require('gitignore-globs')(this.project.join('.skypagerignore'), {
          negate: true
        })
      )*/
    } else {

    }

    /*patterns = patterns.concat(
      this.exclude.map(p => '!' + p)
    )*/

    patterns.push('!node_modules/')

    let results = require('glob-all').sync(patterns,{
      cwd: this.root
    })

    return results
  }

  /**
   * Returns different paths for this collection.
   *
   * @example
   *
   *   project.root // => /Users/jonathan/Skypager/example
   *   project.docs.root // => /Users/jonathan/Skypager/example/docs
   *   project.docs.paths.absolute // => /User/jonathan/Skypager/example/docs
   *   project.docs.paths.relative // => docs
   */
  get paths() {
    let c = this

    return {
      get absolute(){
        return c.root
      },
      get relative(){
        return relative(c.project.root, c.root)
      },
      get glob() {
        return join(relative(c.project.root, c.root), c.AssetClass.GLOB)
      }
    }
  }

  /**
  * Utility function to create a RegExp for a given glob pattern
  *
  * @param {String} pattern a glob pattern to pass to minimatch
  *
  * @return {RegExp}
  */
  makeGlobRegex(pattern) {
    return minimatch.makeRe(pattern)
  }

  /**
  * RegExp patterns for each of this collections include patterns
  *
  * @return {Array, RegExp}
  */
  get includeRegexes() {
    return this.include.map(pattern => minimatch.makeRe(pattern))
  }

  /**
  * RegExp patterns for each of this collections exclude patterns
  *
  * @return {Array, RegExp}
  */
  get excludeRegexes() {
    return this.exclude.map(pattern => minimatch.makeRe(pattern))
  }

  glob (pattern) {
    var regex = minimatch.makeRe(pattern)
    return this.all.filter(asset => asset.paths.relative && regex.test(asset.paths.relative))
  }

  get assetPaths () {
    return this.all.map(a => a.uri)
  }

  relatedGlob (target) {
    let patterns = [
      target.id + '.{' + this.AssetClass.EXTENSIONS.join(',') + '}',
      target.id + '/**/*.{' + this.AssetClass.EXTENSIONS.join(',') + '}'
    ]

    return patterns.reduce((m, a) => {
      return m.concat(this.glob(a))
    }, [])
  }

  mapPick(...args) {
    return this.map(asset => asset.pick(...args))
  }

  mapResult(...args) {
    return this.map(asset => asset.result(...args))
  }

  transform(...args) {
    return transform(this.assets, ...args)
  }

  mapValues(...args) {
    return mapValues(this.assets, ...args)
  }

  pickBy(...args) {
    return pickBy(this.assets, ...args)
  }

  groupBy(...args) {
    return groupBy(this.all, ...args)
  }

  invokeMap(...args) {
    return invokeMap(this.all, ...args)
  }

  get all () {
    return values(this.assets)
  }

  get indexes () {
    return keys(this.index)
  }

  get available () {
    return keys(this.assets)
  }

  pluck(prop) {
    return this.all.map(asset => get(asset, prop))
  }

  query(params = {}, options = {}) {
    return wrapCollection(this, query(this.all, params))
  }

  reduce(...args){
    return this.all.reduce(...args)
  }

  map(...args){
    return wrapCollection(this, this.all.map(...args))
  }

  forEach(...args){
    return this.all.forEach(...args)
  }

  filter(...args){
    return wrapCollection(this, this.all.filter(...args))
  }

  createAsset(relativePath) {
    return new this.AssetClass(relativePath, {
      collection: this,
      project: this.project
    })
  }

  add (asset, autoLoad = false, expandDotPath = false) {
    try {
      this.index[asset.paths.relative] = asset.id
      this.index[asset.paths.absolute] = asset.id
      this.index[asset.id] = asset.id
      this.assets[asset.id] = asset

      if (autoLoad) { asset.runImporter() }

      // expand the dot path when a collection is already loaded and a new asset is added
      if (expandDotPath) {
        //carve(this.at, asset.idPath, asset)
      }
    } catch(error) {
       console.log('Error adding asset', error.message)
    }
  }

  hidden (...args) { return hidden.getter(this, ...args) }

  lazy (...args) { return lazy(this, ...args) }

  _didLoadAssets (paths, expand) {
    if (expand) {
      buildAtInterface(this, true)
    }
  }

  _willLoadAssets (paths) {

  }

  at(assetId) {
    let pointer = this.index[assetId]
    return this.assets[pointer]
  }
}

/**
* This uses object-path however I should write a function
* which uses getters to dynamically build the path forward
* instead, since the tree can change
*/
function buildAtInterface (collection, expand = true) {
  if (expand) {
    let expanded = collection.available
      .map(assetId => assetId.split('/'))
      .sort((a, b) => a.length > b.length)
      .map(id => id.join('/'))

    expanded.forEach(id => {
      let dp = id.replace(/-/g, '_').replace(/\//g, '.')
      carve(collection.at, dp, collection.at(id))
    })
  }
}

function wrapCollection(collection, array) {
  defineProperty(array, 'condense', {
    enumerable: false,
    value: function condense(options = {}) {
      let {prop,key} = options

      if (typeof key === 'undefined') {
        key = 'id'
      }

      return array.reduce((memo,a) => {
        let asset = prop ? a[prop] : a

        if (key === 'idpath') {
          carve(memo, a.id.replace(/\//g,'.'), asset)
          return memo
        }

        let payload = key ? { [a[key]]: asset } : asset

        return assign(memo, payload)
      }, {})
    }
  })

  defineProperty(array, 'merge', {
    enumerable: false,
    value: function merge(options = {}) {
      return array.condense({key: false, prop: options.prop || 'data'})
    }
  })

  defineProperty(array, 'mapPick', {
    enumerable: false,
    value: function(...args) {
      return array.map(asset => asset.pick(...args))
    }
  })

  defineProperty(array, 'groupBy', {
    enumerable: false,
    value: function(...args) {
      return groupBy(array, ...args)
    }
  })

  return array
}

const { assign, keys, defineProperty } = Object
