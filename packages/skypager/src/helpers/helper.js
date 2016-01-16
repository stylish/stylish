import * as util from '../util'
import path from 'path'

import { dirname, extname, resolve, join } from 'path'

export default class Helper {
  static fromDefinition (uri, definition, options) {
    if(definition && options.required) {
      definition.helperExport = options.required
    }

    let helper = new this(uri, Object.assign(options, {definition}))

    return helper
  }

  constructor (uri, options = {}) {
    let helper = this
    let raw

    util.assign(this, {
      get raw () { return raw },

      set raw (val) {
        raw = val
        //helper.contentDidChange(helper)
      }
    })

    this.hidden('uri', uri)
    this.hidden('options', options)
    this.hidden('project', () => options.project)
    this.getter('owner', () => options.owner)
    this.getter('required', (() => options.required || this.require(uri)), true)

    let definition = options.definition

    this.getter('definition', function () {
      let d = options.definition || this.required.definition

      if (d && d.configure) { d.configure() }

      if(this.required && this.required.config){
        Object.keys(this.required.config).forEach(key => {
          if(d && d.config && d.config[key]){
            d.config[key] = Object.assign(this.required.config[key], d.config[key])
          } else {
            d.config[key] = this.required.config[key]
          }
        })
      }

      return d
    })

    this.id = this.paths.relative.replace(this.extension, '')

    this.hidden('api', () => this.buildAPI(options.api, this.required))
  }

  /**
  * Every helper should expose an api with a function which is responsible
  * for handling calls to the run function that get dispatched to the helper.
  *
  */
  run (...args) {
    return this.project ? this.runner.call(this.project, ...args) : this.runner(...args)
  }

  get idPath () {
    return this.id.replace('-', '_').replace('/', '.')
  }

  hidden (...args) { return util.hidden.getter(this, ...args) }

  lazy (...args) { return util.lazy(this, ...args) }

  buildAPI (api) {
    let mod = this.required

    if (api) { return api }

    let runner

    if ( typeof mod === 'function' ) {
      runner = this.project ? mod.bind(this.project) : mod

      return Object.assign(runner, {
        runner,
        id: this.id,
        definition: this.definition
      })
    }

    if (typeof mod === 'object' && typeof mod.default === 'function') {
      return Object.assign(mod, {
        runner: this.project ? mod.default.bind(this.project) : mod.default,
        id: this.id,
        definition: this.definition
      })
    }

    if (typeof mod === 'object') {
      return Object.assign(this.definition.api || {}, mod)
    }

    throw ('There was a problem building an API for the helper id: ' + this.id + ' at ' + this.uri)
  }

  get runner () {
    return this.api.runner
  }

  require (uri) {
    let result = module.require(uri)
    return result
  }

  get paths () {
    let asset = this
    return {
      get relative () {
        return asset.uri.replace(asset.owner.root + '/', '')
      },
      get absolute () {
        return resolve(asset.uri)
      }
    }
  }

  contentWillChange (oldContent, newContent) {

  }

  contentDidChange (asset) {

  }

  get extension () {
    return extname(this.uri)
  }

  getter (name, obj, configurable) {
    util.hide.getter(this, name, obj, configurable)
  }
}

Helper.apiMethods = [ ]
