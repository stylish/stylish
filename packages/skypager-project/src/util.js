import { join } from 'path'

import visit from 'unist-util-visit'
import assign from 'object-assign'
import utile from 'utile'

import { set, get, template, templateSettings, kebabCase,
  any, defaults, result, pick, cloneDeep as clone } from 'lodash'

const inflections = utile.inflect
const DOMAIN_REGEX = /^[a-zA-Z0-9_-]+\.[.a-zA-Z0-9_-]+$/

export const dotpath = {
   set, get
}

module.exports.visit = visit
module.exports.assign = assign
module.exports.defaults = defaults
module.exports.pick = pick
module.exports.any = any
module.exports.result = result
module.exports.clone = clone
module.exports.template = template

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
  return parameterize(s)
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
  invariant(fn, 'provide a function')
  invariant(provider, 'provide a provider')

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


export function isDomain(value) { return value.match(DOMAIN_REGEX) }

export function isPromise (obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}

export function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

export function isRegex(val) {
  if ((typeof val === 'undefined' ? 'undefined' : typeof(val)) === 'object' &&
      Object.getPrototypeOf(val).toString() === '/(?:)/') {
    return true
  }

  return false
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

export function findPackageSync (packageName, root = process.env.PWD) {
  const findModules = require('find-node-modules')
  var path = require('path')

  let moduleDirectories = findModules(root, {relative:false})

  let directory = moduleDirectories.find((p) => {
    let exists = pathExists(join(p, packageName))
    return exists
  })

  if (!directory) {
    try {
      let resolvedPath = path.dirname(require.resolve(packageName))
      return resolvedPath
    } catch(error) {
      console.log('Error looking up package', packageName, error.message)
    }
  }

  return directory && path.resolve( path.join(directory, packageName))
}

export function findPackage (packageName, options = {}) {
  return new Promise((resolve, reject) => {
    let moduleDirectories = findModules(process.env.PWD, {relative:false})
    let directory = moduleDirectories.find((p) => {
      let exists = pathExists(join(p, packageName))
      return exists
    })

    if (!directory) {
      try {
        let resolvedPath = path.dirname(require.resolve(packageName))
        resolve(resolvedPath)
        return
      } catch(error) {

      }
    }

    if (!directory) { reject(packageName); }

    let result = path.resolve(path.join(directory, packageName))

    if(result) { resolve(result) }
  })
}

export function splitPath(p = '') {
   return path.resolve(p).split(path.sep)
}

export function skypagerBabel() {
  let presets = findPackageSync('babel-preset-skypager')

  try {
    presets ? require('babel-register')({presets}) : require('babel-register')
  } catch(error) {
    abort('Error loading the babel-register library. Do you have the babel-preset-skypager package?')
  }
}


export function pathExists(fp) {
  const fs = require('fs')
	var fn = typeof fs.access === 'function' ? fs.accessSync : fs.statSync;

  try {
     fn(fp)
     return true
  } catch(error) {
    return false
  }
}

export function loadProjectFromDirectory (directory, framework) {
  var exists = pathExists
  var path = require('path')

  global.$skypager = global.$skypager || {}

  try {
    if ($skypager['skypager-project']) {
      framework = require($skypager['skypager-project'])
    } else if ($skypager.project) {
       framework = require($skypager.project)
    } else if (process.env.SKYPAGER_PROJECT_ROOT) {
      framework = require(process.env.SKYPAGER_PROJECT_ROOT)
    } else {
       framework = require('./index')
    }
  } catch(error) {
    console.log('There was an error attempting to load the ' + 'skypager-project'.magenta + ' package.')
    console.log('Usually this means it is not installed or can not be found relative to the current directory')
    console.log()
    console.log('The exact error message we received is: '.yellow)
    console.log(error.message)
    console.log('stack trace: '.yellow)
    console.log(error.stack)
    process.exit(1)
    return
  }

	var manifest = loadManifestFromDirectory(directory)

  if (!manifest) {
    throw('Could not load project from ' + directory)
  }

	if (manifest.skypager && manifest.skypager.main) {
		return require(
			path.join(
				directory,
				manifest.skypager.main.replace(/^\.\//, '')
			)
		)
	}

  if (manifest.skypager) {
    return skypagerProject.load(
      join(directory,'package.json')
    )
  }

	if (exists(path.join(directory, 'skypager.js'))) {
		return require(
			path.join(directory, 'skypager.js')
		)
	}
}


export function loadManifestFromDirectory (directory) {
  return require('findup-sync')('package.json', {cwd: directory})
}

