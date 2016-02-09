import Helper from './helper'
import Registry from '../registry'
import { DSL, ActionDefinition } from './definitions/action'
import { dotpath } from '../util'

class Action extends Helper {
  static registryInterface (registry) {
    return {
      actionsForCLI: {
        get () {
          return registry.query(action => dotpath.get(action, 'definition.interfaces.cli'))
        }
      }
    }
  }

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

