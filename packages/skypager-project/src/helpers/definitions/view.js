import {assign, hide, noConflict, tableize, parameterize, singularize, underscore} from '../../util'

let tracker = { }
let _curr

function current () { return tracker[_curr] }
function clearDefinition () { _curr = null; delete tracker[_curr] }

export class ViewDefinition {
  constructor (name, options = {type}) {
    this.name = name
    this.options = options
    this.type = type
  }

  toReactComponent () {

  }
}

ViewDefinition.current = current
ViewDefinition.clearDefinition = clearDefinition

export function DSL (fn) {
  return noConflict(fn, DSL)()
}

export function lookup(viewName) {
  return tracker[(_curr = tabelize(parameterize(viewName)).toLowerCase())]
}

assign(DSL, {
  layout (viewName) {
    tracker[(_curr = tabelize(parameterize(viewName)).toLowerCase())] = new ViewDefinition(viewName, fn)
  },

  page (viewName) {
    tracker[(_curr = viewName)] = new ViewDefinition(viewName, {type: 'page'})
  },

  view (viewName) {
    tracker[(_curr = viewName)] = new ViewDefinition(viewName, {type: 'component'})
  },

  component (viewName) {
    tracker[(_curr = viewName)] = new ViewDefinition(viewName, {type:'component'})
  }
})
