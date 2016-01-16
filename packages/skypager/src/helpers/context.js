import Helper from './helper'
import ContextDefinition from './definitions/context'

export default class Context extends Helper {
  get helperType () {
    return 'context'
  }

  get helperClass () {
    return Context
  }

  get definitionClass () {
    return ContextDefinition
  }
}
