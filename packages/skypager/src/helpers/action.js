import Helper from './helper'
import Registry from '../registry'
import { DSL, ActionDefinition } from './definitions/action'

class Action extends Helper {
  static validate (instance) {
    try {
      instance.name.should.be.a.String
      instance.aliases.should.be.a.Array
      instance.validate.should.be.a.Function
      instance.parameters.should.be.a.Object
    } catch (error) {
      return error.message
    }

    return true
  }

  get definitionClass () {
     return ActionDefinition
  }
}

Action.DSL = DSL
Action.Definition = ActionDefinition
Action.apiMethods = ActionDefinition.apiMethods

module.exports = Action
