import Skypager from './index'
import {filterQuery as query, hide, hidden, lazy, tabelize, values} from './util'
import {relative, basename, dirname, extname, resolve, join} from 'path'
import minimatch from 'minimatch'
import carve from 'object-path'

class Collection {
  constructor (root, project, assetClass) {
    let collection = this

    collection.root = root

    collection.name = basename(root)

    collection.hidden('project', project)
    collection.hidden('AssetClass', () => assetClass)

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

  get all () {
    return values(this.assets)
  }

  get indexes () {
    return keys(this.index)
  }

  get available () {
    return keys(this.assets)
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

  add (asset, autoLoad = false, expandDotPath = false) {
    this.index[asset.paths.relative] = asset.id
    this.index[asset.paths.absolute] = asset.id
    this.index[asset.id] = asset.id
    this.assets[asset.id] = asset

    if (autoLoad) { asset.runImporter() }

    // expand the dot path when a collection is already loaded and a new asset is added
    if (expandDotPath) {
      carve.set(this.at, asset.idPath, asset)
    }
  }

  hidden (...args) { return hidden.getter(this, ...args) }

  lazy (...args) { return lazy(this, ...args) }

  _didLoadAssets (paths, expand) {
    if (expand) {
      this.expandDotPaths()
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
      carve.set(chain, dp, chain(id))
    })
  }
}

module.exports = Collection

function wrapCollection(collection, array) {
  Object.defineProperty(array, 'condense', {
    enumerable: false,
    value: function condense(options = {}) {
      let {prop,key} = options

      if (typeof key === 'undefined') {
        key = 'id'
      }

      return array.reduce((memo,a) => {
        let asset = prop ? a[prop] : a
        let payload = key ? { [a[key]]: asset } : asset

        return assign(memo, payload)
      }, {})
    }
  })

  Object.defineProperty(array, 'merge', {
    enumerable: false,
    value: function merge(options = {}) {
      return array.condense({key: false, prop: options.prop || 'data'})
    }
  })

  return array
}

const { assign, keys, defineProperty } = Object
