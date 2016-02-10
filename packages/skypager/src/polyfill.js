import assign from 'object-assign'
import { access } from './util'

import pick from 'lodash/object/pick'
import flatten from 'lodash/array/flatten'
import compact from 'lodash/array/compact'

if (!Object.assign) {
  Object.assign = assign
}

if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
}

if (!Array.prototype.flatten) {
  Array.prototype.flatten = function(...args){
     return flatten(this, ...args)
  }
}

if (!Array.prototype.compact) {
  Array.prototype.compact = function(...args){
     return compact(this, ...args)
  }
}

Array.prototype.pluckAll = function (...props) {
  return this.map(function (o) {
    return props.reduce(function (m, p) {
      m[p] = o[p]
      return m
    }, {})
  })
}

Array.prototype.pluck = function (prop) {
  return this.map(function (i) { return i[prop] })
}

Array.prototype.unique = function () {
  var u = {}
  for (var i = 0, l = this.length; i < l; ++i) {
    if (u.hasOwnProperty(this[i])) {
       continue
     }
    u[this[i]] = 1
  }
  return Object.keys(u)
}

if (!Array.prototype.find) {
  Array.prototype.find = function (predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.find called on null or undefined')
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function')
    }
    var list = Object(this)
    var length = list.length >>> 0
    var thisArg = arguments[1]
    var value

    for (var i = 0; i < length; i++) {
      value = list[i]
      if (predicate.call(thisArg, value, i, list)) {
        return value
      }
    }
    return undefined
  }
}

module.exports = {}
