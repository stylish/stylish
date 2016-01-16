import {assign, noConflict, tabelize, parameterize, singularize, underscore} from '../../util'

let tracker = { }
let _curr

function current () { return tracker[_curr] }
function clearDefinition () { _curr = null; delete tracker[_curr] }

export class ContextDefiniton {
  constructor (contextName) {
    this.name = contextName
    this.config = { }
    this.version = '0.0.1'
    this.generator = (() => ({}))
  }

  get api () {
    return {
      name: this.name,
      generator: this.generator,
      create (...args) {
        return this.create(...args)
      }
    }
  }

  create () {
    return {
      data: this.generator
    }
  }
}

ContextDefinition.current = current
ContextDefinition.clearDefinition = clearDefinition

export function DSL (fn) {
  noConflict(fn, DSL)()
}

export function lookup(contextName) {
  return tracker[(_curr = tabelize(parameterize(contextName)).toLowerCase())]
}

assign(DSL, {
  context: function (contextName) {
    tracker[(_curr = tabelize(parameterize(contextName)))] = new ContextDefinition(contextName)
  },
  generate: function (...args) { tracker[_curr].generate(...args) }
})
