import Helper from './helper'
import { DSL, ViewDefinition } from './definitions/view'

class View extends Helper {
  static fromDefinition (uri, md, options = {}) {
    options.api = md.api
    options.definition = md

    return new View(uri, options)
  }
}

View.DSL = DSL
View.Definition = ViewDefinition

module.exports = View
