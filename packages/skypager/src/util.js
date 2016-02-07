import visit from 'unist-util-visit'
import assign from 'object-assign'
import dotpath from 'object-path'
import utile from 'utile'
import _debug from 'debug'
import any from 'lodash/collection/some'
import defaults from 'lodash/object/defaultsDeep'
import result from 'lodash/object/result'

import { join } from 'path'

const inflections = utile.inflect
const debug = _debug('skypager')
const DOMAIN_REGEX = /^[a-zA-Z0-9_-]+\.[.a-zA-Z0-9_-]+$/

module.exports.visit = visit
module.exports.assign = assign
module.exports.defaults = defaults
module.exports.any = any
module.exports.result = result
module.exports.dotpath = dotpath

let hidden = {
  getter: function (target, name, fn, configurable = false) {
    Object.defineProperty(target, name, {
      configurable: configurable,
      enumerable: false,
      get: function () {
        return (typeof (fn) === 'function') ? fn.call(target) : fn
      }
    })
  },

  property: function (target, name, value, configurable = false) {
    Object.defineProperty(target, name, {
      configurable: configurable,
      enumerable: false,
      value: value
    })
  }
}


module.exports.hidden = hidden
module.exports.hide = hidden

hidden.getter(module.exports, 'inflections', inflections)

/**
* clone an object
*
*/
export function clone (base) {
  return JSON.parse(JSON.stringify(base))
}

export function humanize (s) {
  return inflections.humanize(s).replace(/-|_/g, ' ')
}

export function titleize (s) {
  return inflections.titleize(humanize(s))
}

export function classify (s) {
  return inflections.classify(s)
}

export function tableize (s) {
  return inflections.tableize(s)
}

export function tabelize (s) {
  return inflections.tableize(s)
}

export function underscore (s) {
  s = s.replace(/\\|\//g, '-', '')
  s = s.replace(/[^-\w\s]/g, '')  // remove unneeded chars
  s = s.replace(/^\s+|\s+$/g, '') // trim leading/trailing spaces
  s = s.replace('-', '_')
  s = s.replace(/[-\s]+/g, '_')   // convert spaces to hyphens
  s = s.toLowerCase()             // convert to lowercase
  return s
}

export function parameterize (s) {
  s = s.replace(/\\|\//g, '-', '')
  s = s.replace(/[^-\w\s]/g, '')  // remove unneeded chars
  s = s.replace(/^\s+|\s+$/g, '') // trim leading/trailing spaces
  s = s.replace(/[-\s]+/g, '-')   // convert spaces to hyphens
  s = s.toLowerCase()             // convert to lowercase
  return s
}

export function slugify (s) {
  s = s.replace(/\\|\//g, '-', '')
  s = s.replace(/[^-\w\s]/g, '')  // remove unneeded chars
  s = s.replace(/^\s+|\s+$/g, '') // trim leading/trailing spaces
  s = s.replace(/[-\s]+/g, '-')   // convert spaces to hyphens
  s = s.toLowerCase()             // convert to lowercase
  return s
}

export function singularize (word) {
  return inflections.singularize(word)
}

export function pluralize (word) {
  return inflections.pluralize(word)
}

export function lazy (target, attribute, fn, enumerable = false) {
  Object.defineProperty(target, attribute, {
    configurable: true,
    enumerable: enumerable,
    get: function () {
      delete (target[attribute])

      if (enumerable) {
        return target[attribute] = fn.call(target)
      } else {
        let value = fn.call(target)

        Object.defineProperty(target, attribute, {
          enumerable: false,
          configurable: true,
          value
        })

        return value
      }
    }
  })
}

export function lazyAsync (target, attribute, fn) {
  Object.defineProperty(target, attribute, {
    configurable: true,
    get: function () {
      delete (target[attribute])

      let result

      (async(() => { result = fn() }))()

      return target[attribute] = result
    }
  })
}

export function flatten (array) {
  return array.reduce((a, b) => a.concat(b), [])
}

export function singularize (string) {
  return inflections.singularize(string)
}

export function createDelegators (target, source, options = {}) {
  let excludeKeys = options.exclude || options.except || []
  let sourceKeys = Object.keys(source).filter(key => excludeKeys.indexOf(key) === -1)

  sourceKeys.forEach(key => Object.defineProperty(target, key, {
    get: function () {
      return source[key]
    }
  }))
}

export function values (object) {
  return Object.keys(object).map(key => object[key])
}

export function mixin (target, source) {
  target = target.prototype; source = source.prototype

  Object.getOwnPropertyNames(source).forEach(function (name) {
    if (name !== 'constructor') Object.defineProperty(target, name,
      Object.getOwnPropertyDescriptor(source, name))
  })
}

export function access (object, dotted) {
  return dotted.split('.').reduce((memo, current) => {
    return memo[current]
  }, object)
}

export function copyProp (property) {
  return {
    from (source) {
      return {
        to (target) {
          let desc = Object.getOwnPropertyDescriptor(source, property)

          if (typeof (desc) !== 'undefined' && desc.configurable) {
            Object.defineProperty(target, property, desc)
          }
        }
      }
    }
  }
}

export function noConflict (fn, provider = {}, scope) {
  fn.should.be.a.Function
  provider.should.be.an.Object

  let safe = { }

  return function () {
    Object.keys(provider).forEach(globalProp => {
      if (global.hasOwnProperty(globalProp)) {
        let descriptor = Object.getOwnPropertyDescriptor(global, globalProp)

        if (descriptor && descriptor.configurable) {
          Object.defineProperty(safe, globalProp, descriptor)
        }
      }

      Object.defineProperty(global, globalProp, Object.getOwnPropertyDescriptor(provider, globalProp))
    })

    let result

    try {
      result = scope ? fn.call(scope) : fn()
    } catch (e) {
      result = 'error'
      console.log(e.message)
      console.error('Error in no conflict fn', e.message, e.stack)
    }

    Object.keys(provider).forEach(remove => delete (global[remove]))

    Object.keys(safe).forEach(restore => {
      delete (global[restore])
      Object.defineProperty(global, restore, Object.getOwnPropertyDescriptor(safe, restore))
    })

    return result
  }
}

export function carve (dataPath, resultValue, initialValue = {}) {
  dotpath.set(initialValue, dataPath, resultValue)
  return initialValue
}

export function loadManifestFromDirectory (directory) {
  var path = require('path')
	var manifest = require(path.join(directory,'package.json')) || {}
	return manifest
}

export function isDomain(value) { return value.match(DOMAIN_REGEX) }

export function loadProjectFromDirectory (directory) {
  var exists = require('fs').existsSync
  var path = require('path')

	var manifest = loadManifestFromDirectory(directory)

	if (manifest.skypager && manifest.skypager.main) {
		return require(
			path.join(
				directory,
				manifest.skypager.main.replace(/^\.\//, '')
			)
		)
	}

	if (exists(path.join(directory, 'skypager.js'))) {
		return require(
			path.join(directory, 'skypager.js')
		)
	}

	if (exists(path.join(directory, 'index.js'))) {
		var p = require(
			 path.join(directory, 'index.js')
		)

		if (!p.registries && !p.docs) {
			abort('This project does not seem to have a skypager project')
		}

		return p
	}
}

export function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

export function isRegex(val) {
  if ((typeof val === 'undefined' ? 'undefined' : typeof(val)) === 'object' && Object.getPrototypeOf(val).toString() === '/(?:)/') {
    return true;
  }

  return false;
}

export function filterQuery (nodeList = [], params) {
  if ( typeof params === 'function' ) {
    return nodeList.filter(params)
  }

  return (nodeList || []).filter(node => {
    return Object.keys(params).every(key => {
      let param = params[key]
      let value = node[key]

      if (isRegex(param) && param.test(value)) {
        return true
      }

      if (typeof (param)==='string' && value === param) {
        return true
      }

      if (typeof (param)==='number' && value === param) {
        return true
      }

      // treat normal arrays to search for any exact matches
      if (isArray(param)) {
        return param.any(val => val === value)
      }
    })
  })
}

export function abort(message) {
   console.log(message.red || message)
   process.exit(1)
}

export function skypagerBabel() {
  require('babel-register')({
    presets:[
      require('babel-preset-skypager')
    ]
  })
}
