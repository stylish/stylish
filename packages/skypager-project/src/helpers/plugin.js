import Helper from './helper'
import { DSL, PluginDefinition } from './definitions/plugin'

class Plugin extends Helper {
  static validate (instance) {

    return true
  }

  static fromDefinition (uri, actionDef, options = {}) {
    options.api = actionDef.api
    return new Plugin(uri, options)
  }
}

Plugin.DSL = DSL
Plugin.Definition = PluginDefinition

module.exports = Plugin
