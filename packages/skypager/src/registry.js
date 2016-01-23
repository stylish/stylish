/**
* Refactoring notes:
*
* Currently there is a registry for the skypager framework and then per project rregistries
*
* I should make one registry for the framework, and then helpers register themselves with the project they belong to
* and by default only get framework helpers and project helpers available to them.
*
*/
import Skypager from './index'
import * as util from './util'
import carve from 'object-path'

import { basename, join, resolve, dirname, relative } from 'path'


import _debug from 'debug'
const debug = _debug('skypager:registry')

const Fallbacks = {}

class Registry {
  static build (host, helper, options) {
    return new Registry(host, helper, options)
  }

  constructor (host, helper, options = {}) {
    if (!host || !helper) {
      throw ('Must supply a registry with a host and a helper class')
    }

    this.name = options.name || util.tabelize(helper.name || '')
    this.root = join((options.root || host.root), this.name)

    let registry = { }
    let aliases = { }

    util.hide.getter(this, 'host', () => host)
    util.hide.getter(this, 'aliases', () => aliases)
    util.hide.getter(this, 'registry', () => registry)
    util.hide.getter(this, 'helper', () => helper)

    if (host.type === 'framework') {
      Fallbacks[this.name] = this
    }

    let indexScript

    this.loaded = false

    try {
      indexScript = require.resolve(join(this.root, 'index.js'))
    } catch (error) {

    }

    if (indexScript) {
      this.loaded = true
      this.runLoader(require(indexScript))
    }

    buildAtInterface(this)

    this.loaded = true
  }

  /**
   * Remove a helper from this registry
   *
   * @param {Helper.id} helperId - the id the helper was registered with
  */
  remove (helperId) {
    let instance = this.lookup(helperId, false)
    if (instance) {
      if (instance.name) {
        delete (this.aliases, instance.name)
      }

      if (instance.aliases) {
        instance.aliases.forEach(a => delete (this.aliases[a]))
      }

      delete (this.aliases[instance.id])
      delete (this.registry[instance.id])
    }
  }

  /**
   * run a helper's main function
   *
   * @param {Helper.id} helperId
   * @param {Whatever} ...args
  */
  run (helperId, ...args) {
    let fn = this.lookup(helperId).runner
    return fn(...args)
  }

  /**
   * The Fallback registry for now will always be Skypager
   *
   * @private
  */
  get fallback () {
    if (this.host.type !== 'framework') {
      return Fallbacks[this.name]
    }
  }

  query (params) {
    return util.filterQuery(this.all, params)
  }

  lookup (needle, strict = true, fromProject) {
    let helperId = this.aliases[needle]

    if (typeof (helperId) === 'undefined') {
      if (this.fallback) { return this.fallback.lookup(needle, strict, this.host) }
      if (strict) { throw ('Could not find helper with id:' + needle) }
    }

    let result = this.registry[helperId]

    if (result && fromProject) { result.options.project = fromProject }

    return result
  }

  register (helperId, helperInstance) {
    if (!helperInstance) {
      throw ('Error registering ' + helperId)
    }

    this.aliases[helperId] = helperId

    if (helperInstance.name) {
      this.aliases[helperInstance.name] = helperId
    }

    this.registry[helperId] = helperInstance

    helperInstance.aliases && helperInstance.aliases.forEach(alias => {
      this.aliases[alias] = helperId
    })

    return helperInstance
  }

  buildId (helperURL, keepExtension = false) {
    let reg = new RegExp('^' + this.root + '/', 'i')

    if (!helperURL.match(reg)) {
      helperURL = basename(helperURL)
    }

    let base = helperURL.replace(reg, '')

    if (base.match(/\/index$/i)) {
      base = base.replace(/\/index$/i, '')
    }

    return keepExtension ? base : base.replace(/\.\w+$/i, '')
  }

  runLoader (fn) {
    let locals = Object.assign({}, (this.helper.DSL ? this.helper.DSL : { }))

    locals.util = util

    if (this.host && this.host.type && !locals[this.host.type]) {
      locals[this.host.type] = this.host
    }

    if (this.helper && this.helper.name) {
      locals[this.helper.name] = this.helper
    }

    locals.registry = this
    locals.load = this.load.bind(this)

    util.noConflict(fn, locals)()
  }

  load (uri, id) {
    const HelperClass = this.helper

    let owner = this

    id = id || this.buildId(uri)

    let helperInstance

    try {
      let required = require(uri)
      let cached = require.cache[uri]
      let empty = Object.keys(cached.exports).length === 0
      let definition = this.helper.Definition && this.helper.Definition.current()

      if (empty && definition) {
        helperInstance = HelperClass.fromDefinition(uri, definition, {owner, id, required})
      } else if (definition) {
        helperInstance = HelperClass.fromDefinition(uri, definition, {owner, id, required})
      } else {
        helperInstance = new HelperClass(uri, {owner, id, definition, required})
      }

      if (!helperInstance) {
        throw ('Uh oh')
      }

      id = id.replace(/\/index$/i, '')

      this.register(id, helperInstance)

      if (this.helper.Definition && this.helper.Definition.clearDefinition) {
         this.helper.Definition.clearDefinition()
      }

      return helperInstance
    } catch (error) {
      console.log('Error loading: ' + uri, error.message)
      console.log(error.stack)
    }
  }

  get all () {
    return util.values(this.registry)
  }

  filter (...args) {
     return this.all.filter(...args)
  }

  get available () {
    let keys = Object.keys(this.registry)

    if (this.fallback) {
      return keys.concat(this.fallback.available)
    }

    return keys
  }
}

const _CACHE = { }

class Builder {
  constructor (cache) {
    this.cache = cache || {}
  }

  build (...args) {
    return Registry.build(...args)
  }

  buildAll (host, helpers, options = {}) {
    let root = options.root || host.root
    let c = this.cache[host.root] = this.cache[host.root] || { }

    root.should.not.be.empty()
    c.should.be.an.Object
    helpers.should.not.be.empty()

    Object.keys(helpers).forEach(type => {
      let name = util.tabelize(type)
      c[name] = c[name] || Registry.build(host, helpers[type], {name, root: host.root})
    })

    return c
  }
}

module.exports = new Builder(_CACHE)

function buildAtInterface (host) {
  let chain = function (id) {
    return host.lookup(id)
  }

  let expand = host.loaded

  Object.defineProperty(host, 'at', {
    configurable: true,
    enumerable: false,
    value: chain
  })

  let idPaths = host.available.concat([])

  if (expand) {
    let expanded = idPaths.map(idPath => idPath.split('/')).sort((a, b) => a.length > b.length)

    expanded.forEach(parts => {
      let id = parts.join('/')
      let first = parts[0]

      if (parts.length === 1) {
        util.assign(chain, {
          get [first] () {
            return host.lookup(id)
          }
        })
      }

      if (parts.length > 1) {
        let getter = parts.pop()
        let idPath = parts.join('.').replace(/-/g, '_')
        let target = carve.get(chain, idPath) || { }

        util.assign(target, {
          get [getter] () {
            return host.lookup(id)
          }
        })
        carve.set(chain, idPath, target)
      }
    })
  }
}
