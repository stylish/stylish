import Helper from './helper'
import Registry from '../registry'
import { DSL, ActionDefinition } from './definitions/action'

class Action extends Helper {
  get helperClass () {
    return Action
  }

  get definitionClass () {
     return ActionDefinition
  }
}

Action.DSL = DSL
Action.Definition = ActionDefinition
Action.apiMethods = ActionDefinition.apiMethods

module.exports = Action
