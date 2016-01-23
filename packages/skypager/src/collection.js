import Skypager from './index'
import * as util from './util'
import {relative, basename, dirname, extname, resolve, join} from 'path'
import minimatch from 'minimatch'
import carve from 'object-path'

class Collection {
  constructor (root, project, assetClass) {
    this.root = root

    this.name = basename(root)

    this.hidden('project', project)
    this.hidden('AssetClass', () => assetClass)

    const assets = { }
    const index = { }

    let loaded = false

    this.hidden('assets', () => assets )
    this.hidden('index', () => index )
    util.hide.property(this, 'expandDotPaths', () => buildAtInterface(this, true))

    // provides access to document
    if (assetClass.groupName && !this[assetClass.groupName]) {
      this.hidden(util.tabelize(assetClass.groupName), () => this.assets )
    }

    buildAtInterface(this, false)
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
    return util.values(this.assets)
  }

  get indexes () {
    return Object.keys(this.index)
  }

  get available () {
    return Object.keys(this.assets)
  }

  query(params) {
    return util.filterQuery(this.all, params)
  }

  reduce(...args){
    return this.all.reduce(...args)
  }

  map(...args){
    return this.all.map(...args)
  }

  filter(...args){
    return this.all.filter(...args)
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

  hidden (...args) { return util.hidden.getter(this, ...args) }

  lazy (...args) { return util.lazy(this, ...args) }

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

  Object.defineProperty(collection, 'at', {
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
