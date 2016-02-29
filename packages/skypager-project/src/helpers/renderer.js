/**
*
* Renderers are functions which turn an entity into something like HTML
*
*/

import Helper from './helper'

export default class Renderer extends Helper {
  get helperType () {
    return 'renderer'
  }

  get helperClass () {
    return Renderer
  }
}
