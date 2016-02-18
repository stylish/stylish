import {assign, noConflict, tabelize, parameterize, singularize, underscore} from '../../util'

let tracker = { }
let _curr

function current (clear = false) {
  let c = tracker[_curr]

  if (clear) { delete (tracker[_curr]) }

  return c
}

export class PluginDefinition {
  constructor (pluginName, options = {}) {
    this.name = pluginName

    this.config = {
      aliases: [ ],
      dependencies: [],
      modifiers: [],
      provides: { },
      supportChecker: function () {
        return true
      }
    }

    this.version = '0.0.1'
  }

  get api () {
    return {
      name: this.name,
      aliases: this.config.aliases,
      dependencies: this.config.dependencies,
      modifiers: this.config.modifiers,
      modify: this.config.modifiers[0],
      version: this.version,
      runner: this.runner,
      provides: this.provides
    }
  }

  /**
  * What does this plugin provide? Valid options are:
  * - helpers: action, exporter, importer, model, view, store
  * - configuration: additions to the configuration schema
  */
  provides (what, value) {
    if (typeof what === 'object' && !value) {
      return this.config.provides = Object.assign(this.config.provides, what)
    }

    if (value) {
      this.config.provides[what] = value
    }

    return this.config.provides[what]
  }

  runner (...args) {
    if (this.config.supportChecker(...args)) {
      this.modifiers.forEach(fn => fn(...args))
    }
  }

  aka (...list) {
    this.config.aliases = this.config.aliases.concat(list)
  }

  aliases (...list) {
    this.aka(...list)
  }

  dependencies (...list) {
    this.config.dependencies = this.config.dependencies.concat(list)
  }

  modify (...modifiers) {
    this.config.modifiers = this.config.modifiers.concat(modifiers)
  }

  isSupported (fn) {
    this.config.supportChecker = fn
  }

}

PluginDefinition.current = current
PluginDefinition.clearDefinition = function() { current(true) }

export function DSL (fn) {
  noConflict(fn, DSL)()
}

export function lookup(pluginName) {
  return tracker[(_curr = tabelize(parameterize(pluginName)).toLowerCase())]
}

assign(DSL, {
  plugin: function (pluginName) {
    tracker[(_curr = tabelize(parameterize(pluginName)))] = new PluginDefinition(pluginName)
  },
  aliases: function (...args) { tracker[_curr].aliases(...args) },
  aka: function (...args) { tracker[_curr].aka(...args) },
  dependencies: function (...args) { tracker[_curr].dependencies(...args) },
  isSupported: function (...args) { tracker[_curr].isSupported(...args) },
  modify: function (...args) { tracker[_curr].modify(...args) }
})
