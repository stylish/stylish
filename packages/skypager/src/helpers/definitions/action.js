import {
  assign,
  noConflict,
  tabelize,
  parameterize,
  singularize,
  underscore
} from '../../util'

let tracker = { }
let _curr

function current () { return tracker[_curr] }
function clearDefinition () { _curr = null; delete tracker[_curr] }

export class ActionDefinition {
  constructor (actionName) {
    this.name = actionName
    this.description = ''
    this.config = {}
    this.interfaces = {}
    this.parameters = { }
    this.aliases = {}
    this.validator = function () { return true }
    this.executor = function () { throw ('Define your own executor function') }
  }

  describe(value) {
    this.description = value
  }

  expose (platform, configurator) {
    this.interfaces[platform] = configurator
  }

  get api () {
    let def = this

    return {
      name: this.name,
      aliases: this.aliases,
      execute: this.executor,
      validate: this.validator,
      parameters: this.parameters,
      runner: function (params, action) {
        if (def.api.validate(params, action)) {
          return def.api.execute(params, action)
        }
      }
    }
  }

  aka (...list) {
    list.forEach(alias => {
      this.aliases[ parameterize(underscore(alias.toLowerCase())) ] = true
    })
  }

  aliases (...list) {
    this.aka(...list)
  }

  params (fn) {
    this.paramBuilder(fn)
  }

  required (fn) {
    this.paramBuilder(fn, false)
  }

  optional (fn) {
    this.paramBuilder(fn)
  }

  validate (fn) {
    this.validator = fn
  }

  execute (fn) {
    this.executor = fn
  }

  paramBuilder (fn, required) {
  }
}

ActionDefinition.current = current
ActionDefinition.clearDefinition = clearDefinition

export function DSL (fn) {
  noConflict(fn, DSL)()
}

export function lookup(actionName) {
  return tracker[(_curr = tabelize(parameterize(actionName)).toLowerCase())]
}

assign(DSL, {
  action: function (actionName) {
    tracker[(_curr = tabelize(parameterize(actionName)))] = new ActionDefinition(actionName)
  },
  describe: function (...args) { tracker[_curr].describe(...args) },
  aliases: function (...args) { tracker[_curr].aliases(...args) },
  aka: function (...args) { tracker[_curr].aka(...args) },
  validate: function (...args) { tracker[_curr].validate(...args) },
  execute: function (...args) { tracker[_curr].execute(...args) },
  required: function (...args) { tracker[_curr].required(...args) },
  optional: function (...args) { tracker[_curr].optional(...args) },
  params: function (...args) { tracker[_curr].params(...args) },
  expose: function(...args) { tracker[_curr].expose(...args) },
  cli: function(...args) { tracker[_curr].expose('cli', ...args) },
  ipc: function(...args) { tracker[_curr].expose('ipc', ...args) },
  web: function(...args) { tracker[_curr].expose('web', ...args) }
})
