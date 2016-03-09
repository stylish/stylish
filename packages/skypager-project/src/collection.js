import {defaults, filterQuery as query, hide, hidden, lazy, tabelize, values} from './util'
import {relative, basename, dirname, extname, resolve, join} from 'path'
import minimatch from 'minimatch'
import { get, invokeMap, mapValues, transform, groupBy, invoke, pick, set as carve } from 'lodash'

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
class Collection {
  constructor (options = {}) {
    let { root, project, assetClass } = options
    let collection = this
    collection.root = root

    if (typeof options.exclude === 'string') {
      options.exclude = [options.exclude]
    }

    if (typeof options.include === 'string') {
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

    Object.assign(this, {}, pick(options, 'include', 'exclude', 'name', 'autoLoad'))

    const assets = { }
    const index = { }

    let loaded = false

    collection.hidden('assets', () => assets )
    collection.hidden('index', () => index )

    hide.property(collection, 'expandDotPaths', () => buildAtInterface(collection, true))

    // provides access to document
    if (assetClass.groupName && !collection[assetClass.groupName]) {
      collection.hidden(tabelize(assetClass.groupName), () => collection.assets )
    }

    buildAtInterface(collection, false)

    if (options.autoLoad) {
       this.loadAssetsFromDisk()
    }
  }

  loadAssetsFromDisk (paths = this.filesInRoot){
    this._willLoadAssets(paths)

    paths.forEach(rel => {
      let asset = this.createAsset(rel)
      this.add(asset, true, true)
    })

    this._didLoadAssets(paths, false)
  }

  get categories() {
    this.pluck('categoryFolder').unique()
  }

  get idsByCategory() {
    let grouped = this.groupBy('categoryFolder')

    return Object.keys(grouped)
    .reduce((memo, group) => {
      memo[group] = grouped[group].pluck('id')
      return memo
    }, {})
  }

  get indexes() {
    return this.filter(asset => asset.isIndex())
  }

  get assetType () {
    return this.AssetClass.typeAlias
  }

  get assetGroupName () {
    return this.AssetClass.groupName
  }

  get filesInRoot() {
    return this.globFiles()
  }

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

    patterns.push('node_modules/')

    let results = require('glob-all').sync(patterns,{
      cwd: this.root
    })

    return results
  }

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

  glob (pattern) {
    var regex = minimatch.makeRe(pattern)
    return this.all.filter(asset => asset.paths.relative && regex.test(asset.paths.relative))
  }

  get assetPaths () {
    return this.all.map(a => a.uri)
  }

  get subfolderPaths () {
    return this.assetPaths.map(p => relative(this.root, dirname(p)))
    .unique()
    .filter(i => i.length > 0)
    .sort((a, b) => a.length > b.length)
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

  groupBy(...args) {
    return groupBy(this.all, ...args)
  }

  invokeMap(...args) {
    return invokeMap(this.all, ...args)
  }

  invoke(...args) {
    return invoke(this.all, ...args)
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
      //this.expandDotPaths()
    }
  }

  _willLoadAssets (paths) {
  }
}

/**
* This uses object-path however I should write a function
* which uses getters to dynamically build the path forward
* instead, since the tree can change
*/
function buildAtInterface (collection, expand = true) {
  let chain = function (needle) {
    let pointer = this.index[needle]
    return this.assets[pointer]
  }.bind(collection)

  defineProperty(collection, 'at', {
    configurable: true,
    enumerable: false,
    value: chain
  })

  if (expand) {
    let expanded = collection.available.map(idPath => idPath.split('/')).sort((a, b) => a.length > b.length)

    expanded.forEach(id => {
      let dp = id.replace(/-/g, '_').replace(/\//g, '.')
      carve(chain, dp, chain(id))
    })
  }
}

module.exports = Collection

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
