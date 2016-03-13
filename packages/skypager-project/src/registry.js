import Skypager from './index'
import * as util from './util'
import { get, set } from 'lodash'
import { basename, join, resolve, dirname, relative } from 'path'

const Fallbacks = {}

class Registry {
  static build (host, helper, options) {
    let registry = new Registry(host, helper, options)

    if (helper && helper.decorateRegistry) {
      helper.decorateRegistry(registry)
    }

    return registry
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
   * run a helper's main function.
   *
   * using the helperId 'loader' and passing it a function is a convenient way
   * of running a special loader function. @see runLoader
   *
   * @param {Helper.id} helperId
   * @param {Whatever} ...args
  */
  run (helperId, options = {}, context = {}) {
    if ( helperId === 'loader' ) {
      return this.runLoader(options, context)
    }

    if (this.host.type === 'project') {
      context.project = context.project || this.host
    }

    return this.lookup(helperId).run(options, context)
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

  /**
   * Query this helper registry and return only helpers which match
   *
   * @example return actions that expose a CLI interface
   *
   *  skypager.actions.query((helper) => {
   *    return ('cli' in helper.definition.interfaces)
   *  })
  */
  query (params) {
    return util.filterQuery(this.allHelpers(true), params)
  }

  /**
   * Lookup a helper by id
   *
   * @param {Helper.id} needle the id of the helper you want
   * @param {Boolean} strict throw an error when it is not found
   * @param {Project} fromProject only return helpers that were registered by a particular project
   *
   */
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

  /**
   * Register a helper instance
   *
   * @param {Helper.id} helperId the id to reference this helper by
   * @param {Helper} helperInstance a helper object that wraps this helper file with metadata
  */
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

  /**
   * build a Helper.id for a given helper path
   *
   * @param {Path} helperURL the absolute path to this helper
   * @param {Boolean} keepExtension - keep the file extension as part of the Helper.id
  */
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

  /**
   * Run a helper loader function for this registry.
   *
   * @param {Function} fn a function which is about to load helpers for us
   * @param {Object} locals an object containing variables to inject into scope
   *
   * This will run the required function in a special context
   * where certain sugar is injected into the global scope.
   *
   * These loader functions can expect to have the following in scope:
   *
   * - registry - this
   * - [helperType] - a variable named action, model, exporter, plugin, or whatever
   * - load - a function to load in a uri. this.load.bind(registry)
   *
  */
  runLoader (fn, locals = {}) {
    let registry = this
    let host = this.host

    locals = Object.assign(locals, (this.helper.DSL ? this.helper.DSL : {}))
    locals.load = registry.load.bind(registry)

    util.noConflict(function() {
      fn.call(host, registry, host.type)
    }, locals)()
  }

  /**
   * Load a helper by its URI or Path.
   *
   * @description
   *
   * This will require the helper in a special context where certain
   * objects and functions are injected in the global scope. This makes it easier to
   * write helpers by providing them with a specific DSL based on the helper type.
   *
   * @param {String} uri the absolute path to the helper
   * @param {Helper.id} id what id to register this helper under?
   *
   * @see helpers/definitions/model.js for example
   *
   * NOTE: Need to refactor this if im going to use webpack as a build
   * since it doesnt like dynamic require.
  */
  load (uri, id) {
    if (typeof uri !== 'string') {
      return this.loadModule.apply(this, arguments)
    }

    return this.loadPath.apply(this, arguments)
  }

  loadModule (required, options = {}) {
    if(typeof required === 'string') {
      return this.loadPath.apply(this, arguments)
    }

    let { id, uri } = options

    id = id || this.buildId(uri)

    let owner = this
    let HelperClass = this.helper

    let helperInstance
    let empty = typeof(required) === 'object' && Object.keys(required).length === 0
    let definition = this.helper.Definition && this.helper.Definition.current()

    if (definition) {
      helperInstance = HelperClass.fromDefinition(uri, definition, {owner, id, required})
    } else {
      helperInstance = new HelperClass(uri, {owner, id, required})
    }

    this.register(id, helperInstance)

    // todo: should just be a method on definition
    if (this.helper.Definition && this.helper.Definition.clearDefinition) {
       this.helper.Definition.clearDefinition()
    }

    return helperInstance
  }

  loadPath (uri, id) {
    const HelperClass = this.helper

    let owner = this

    id = id || this.buildId(uri)

    let helperInstance

    try {
      let required = require(uri)
      let empty = typeof(required) === 'object' && Object.keys(required).length === 0
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

      // todo: should just be a method on definition
      if (this.helper.Definition && this.helper.Definition.clearDefinition) {
         this.helper.Definition.clearDefinition()
      }

      return helperInstance
    } catch (error) {
      console.log('Error loading: ' + uri, error.message)
      console.log(error.stack)
    }
  }

  filter (...args) {
     return this.allHelpers(true).filter(...args)
  }

  map(...args) {
    return this.allHelpers(true).map(...args)
  }

  forEach(...args){
    return this.allHelpers(true).forEach(...args)
  }

  allHelpers (includeFallback = true) {
    let mine = util.values(this.registry)

    if (this.fallback && includeFallback) {
      return mine.concat(this.fallback.all)
    }

    return mine
  }

  get all () {
     return this.allHelpers(false)
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

    invariant(root, 'root should exist')
    invariant(c, 'cache should exist')
    invariant(helpers, 'helpers should exist')

    Object.keys(helpers).filter(type => type !== 'default').forEach(type => {
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
        let target = get(chain, idPath) || { }

        util.assign(target, {
          get [getter] () {
            return host.lookup(id)
          }
        })

        set(chain, idPath, target)
      }
    })
  }
}
