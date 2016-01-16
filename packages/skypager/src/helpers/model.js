import Helper from './helper'
import { DSL, ModelDefinition } from './definitions/model'
import { basename } from 'path'

import { hide } from '../util'

class Model extends Helper {
  constructor (...args) {
    super(...args)

    this.entities = {}
  }

  get config () {
    return this.definition && this.definition.config || {}
  }

  get attributes(){
    let base = this.required.attributes || {}
    return Object.assign(base, this.config.attributes || {})
  }

  get name () {
    return (this.definition && this.definition.name) || this.id
  }

  static validate (instance) {
    return true
  }
}

Model.DSL = DSL
Model.Definition = ModelDefinition

module.exports = Model
