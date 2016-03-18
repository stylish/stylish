import DataSource from './data_source'

const EXTENSIONS = ['json']
const GLOB = '*/package.json'

import pickBy from 'lodash/pickBy'
import mapValues from 'lodash/mapValues'

export class ProjectManifest extends DataSource {

  static EXTENSIONS = EXTENSIONS;
  static GLOB = GLOB;

  static decorateCollection(collection, options = {}) {
    let assetClass = this

    defineProperty(collection, 'findDependentsOf', {
      enumerable: false,
      configurable: true,
      value: function(utility) {
        return assetClass.findDependentsOf(utility, collection)
      }
    }),

    defineProperty(collection, 'findProvidersOf', {
      enumerable: false,
      configurable: true,
      value: function(utility) {
        return assetClass.findProvidersOf(utility, collection)
      }
    })
  }

  /**
   * Find all packages that depend on the specific package.
   *
   * This will look in allDependencies
   *
   * @param {String} packageName the name of an npm module
   *
  */
  static findDependentsOf(packageName, collection) {
    return collection.query(p => {
      return p.allDependencies[packageName]
    })
  }

  /**
   * Find all packages that provide the specified utility.
   *
   * This will search the skypager.provides value for a given utility,
   * e.g. devtools, ui components, themes, etc.
  */
  static findProvidersOf(utility, collection) {
    return collection.query(p => {
      return p.provides.indexOf(utility) >= 0
        || p.provides.indexOf(`${ utility }s`) >= 0
        || p.provides.indexOf(`${utility}`.replace(/s$/i,'')) > 0
    })
  }

  constructor (uri, options = {}) {
    super(uri, options)
  }

  get name() {
    return this.data.name
  }

  generateId() {
     return this.paths.relative.replace(this.extension, '').replace('/package','')
  }

  get version() {
    return this.data.version
  }

  get repository() {
    return this.data.repository
  }

  get scripts() {
    return this.data.scripts
  }

  get dependencies() {
    return this.data.dependencies || {}
  }

  get devDependencies() {
    return this.data.devDependencies || {}
  }

  get optionalDependencies() {
    return this.data.optionalDependencies || {}
  }

  get peerDependencies() {
    return this.data.peerDependencies || {}
  }

  get allDependencies() {
    return Object.assign({}, {
      ...(this.dependencies),
      ...(this.devDependencies),
      ...(this.peerDependencies),
      ...(this.optionalDependencies)
    })
  }

  get allDependencyNames() {
     return Object.keys(this.allDependencies)
  }

  get skypagerDependencies() {
     return pickBy(this.allDependencies, (value, key) => key.match(/^skypager/))
  }

  get skypager() {
    return this.data.skypager
  }

  get provides() {
    return this.skypager && this.skypager.provides || []
  }
}

export default ProjectManifest

const { defineProperty } = Object
