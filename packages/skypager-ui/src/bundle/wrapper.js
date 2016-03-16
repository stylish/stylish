/**
 * Consumes a Skypager Bundle Export and provides
 * a Project like interface.  It also can generate a Skypager.Application
*/

import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import isRegExp from 'lodash/isRegExp'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import defaults from 'lodash/defaultsDeep'
import mapValues from 'lodash/mapValues'
import pickBy from 'lodash/pickBy'
import get from 'lodash/get'
import result from 'lodash/result'
import invariant from 'invariant'

import DefaultSettings from './defaults'

const default_settings = DefaultSettings({version:'v1'})

const cache = {
  components: {},
  layouts: {},
  screens: {},
  contexts: {},
  redux: {}
}

module.exports =

class BundleWrapper {
  static create(rawBundle, options = {}) {
    invariant(rawBundle, 'Must pass a bundle object. By default this will be available by requiring dist/bundle')
    invariant(rawBundle.entities, 'The bundle must include data about the projects entities')
    invariant(rawBundle.content, 'The bundle must include the content collections export from the project')
    invariant(rawBundle.copy, 'The bundle must include the copy export from the project')
    invariant(rawBundle.settings, 'The bundle must include the settings export from the project')

    return new BundleWrapper(...args)
  }

  constructor (bundle, options = {}) {
    // don't overwrite these values once set as it breaks webpacks module ids
    defaults(cache.contexts, {
      ...(bundle.requireContexts)
    })

    hide(this, {
      entities: mapValues(bundle.entities, (v) => addQuerySugar(v)),
      content: mapValues(bundle.content, (v) => addQuerySugar(v))
    })

    let _settings = bundle.settings
    let currentApp = _settings.app.current || _settings.app.available[0] || default_settings.app.current || 'web'

    this.settings = _settings.apps[currentApp] || default_settings.apps[currentApp] || default_settings.apps.web
    this.copy = (bundle.copy && bundle.copy[currentApp]) ? bundle.copy[currentApp] : bundle.copy

    if (options.api) {
      assign(this, options.api)
    }
  }

  get(...args) {
    return result(this, ...args)
  }

  get docs() {
     return this.content.documents
  }

  get data() {
    return this.content.data_sources
  }

  get scripts() {
    return this.content.scripts
  }

  get entityNames() {
     return keys(this.entities || {})
  }

  get requireContexts() {
     return cache.contexts
  }

  buildApp (props = {}) {
    props = defaults(props, {
      reducers: [],
      initialState: [],
      middlewares: []
    })

    this.buildRedux(
      this.loadProjectReduxFiles(
        this.loadComponents(
          this.buildScreens(
            this.buildLayout(props)
          )
        )
      )
    )

    return props
  }

  query (source, params) {
    source = `${ source }`.toLowerCase()

    if (this.entities[source]) {
      return query(
        values(this.entities[source]),
        params
      )
    } else if (this.content[source]) {
      return query(
        values(this.content[source]),
        params
      )
    }

    return []
  }

  findComponentHandler(assetId) {
    let scripts = this.scripts || {}

    return (
      scripts[`components/${ assetId }`] ||
      scripts[`components/${ assetId }/index`]
    )
  }

  findLayoutHandler(assetId) {
    let scripts = this.scripts || {}

    return (
      scripts[`layouts/${ assetId }`] ||
      scripts[`layouts/${ assetId }/index`] ||
      scripts[`components/${ assetId }`] ||
      scripts[`components/${ assetId }/index`]
    )
  }

  findLayoutHandler(assetId) {
    let scripts = this.scripts || {}

    return (
      scripts[`layouts/${ assetId }`] ||
      scripts[`layouts/${ assetId }/index`] ||
      scripts[`components/${ assetId }`] ||
      scripts[`components/${ assetId }/index`]
    )
  }

  findScreenHandler(assetId) {
    let scripts = this.scripts || {}

    return (
      scripts[`entries/${ assetId }`] ||
      scripts[`entries/${ assetId }/index`] ||
      scripts[`entries/${ assetId }/components/${ assetId }`] ||
      scripts[`entries/${ assetId }/components/${ assetId }/index`] ||
      scripts[`components/${ assetId }`] ||
      scripts[`components/${ assetId }/index`]
    )
  }

  validateScreenReference(assetId) {
     return !!(this.findScreenHandler(assetId))
  }


  requireComponent(assetId) {
    return cache.components[assetId] || requireComponent.call(this, assetId)
  }

  requireLayout(assetId) {
    return cache.layouts[assetId] || requireLayout.call(this, assetId)
  }

  requireScreen(assetId) {
    return cache.screens[assetId] || requireScreen.call(this, assetId)
  }

  requireStateConfig(assetId) {
    return cache.redux[assetId] || requireStateConfig.call(this, assetId)
  }

  require(assetType, assetId) {
    let base = this[assetType + 's']

    let file = base[assetId] ||
               base[assetId + '/index'] ||
               base[assetId + '/' + assetId]

    if(!file) {
      console.error('Error requiring asset from require contexts', assetId, assetType)
      throw('Error loading asset from the require context')
    }

    let key = file.paths.relative
    let asset = this.requireContexts[assetType + 's']( './' + key )

    if (!asset) {
       throw('Could not find ' + assetType + ' ' + assetId)
    }

    return asset.default ? asset.default : asset
  }

  buildRedux (props) {
    let project = this

    props.reducers.push(
      pick(ProjectReducers, 'copy', 'settings', 'entities')
    )

    // TODO
    // This should be controllable via project settings
    // not every app needs all of this stuff loaded in redux
    props.initialState.push({
      copy: project.copy,
      settings: project.settings,
      entities: project.entities
    })

    return props
  }

  /**
   * this is an attempt to lock a webpack module id down
   * and don't hot reload it when we hot reload the bundle
   */
  loadComponents(props = {}) {
    props.layout = this.requireLayout(props.layout)

    props.screens = mapValues(this.settings.screens, (id) => {
      return this.requireScreen(id)
    })

    return props
  }

  loadProjectReduxFiles (props) {
    mapValues(this.settings.screens, (screenId) => {
      let base = this.findScreenHandler(screenId).id

      if(this.scripts[`${ base }/state`]) {
        let stateConfig = this.requireStateConfig.call(this, `${base}`)

        if (stateConfig && stateConfig.reducers) {
          props.reducers.push(
             stateConfig.reducers
          )
        }

        if (stateConfig && stateConfig.initialState) {
          props.initialState.push(
             stateConfig.initialState
          )
        }
      }
    })

    return props
  }

  buildScreens (props) {
    props.screens = this.settings.screens
    return props
  }

  buildLayout (props) {
    props.layout = this.settings.layout
    return props
  }

}

function lazy(obj, props = {}) {
  keys(props).forEach(key => {
    let value = props[key]

    defineProperty(obj, key, {
      configurable: true,
      get: function(){
        delete obj[key]
        return obj[key] = value()
      }
    })
  })
}

function hide(obj, props = {}) {
  keys(props).forEach(key => {
    let value = props[key]

    defineProperty(obj, key, {
      enumerable: false,
      value
    })
  })

  return obj
}

function addQuerySugar(object) {
  hide(object, {
    query: (...args) => query(values(object), ...args),
    where: (...args) => addQuerySugar(pickBy(object, ...args)),
    pickBy: (...args) => addQuerySugar(pickBy(object, ...args)),
    sortBy: (...args) => sortBy(values(object), ...args),
  })

  return object
}

function query (list = [], params) {
  if ( typeof params === 'function' ) {
    return list.filter(params)
  }

  return (list || []).filter(item => {
    return keys(params).every(key => {
      let param = params[key]
      let value = item[key]

      if (isRegExp(param) && param.test(value)) {
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
        return param.filter(val => val === value).length > 0
      }
    })
  })
}

function values(obj) {
   return keys(obj).map(k => obj[k])
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

const ProjectReducers = {
  assets (state = {}, action = {}) {
    let { payload, type } = action

    if (type === 'REFRESH_ASSETS') {
      return assign(state, payload)
    }

    return state
  },

  content (state = {}, action = {}) {
    let { payload, type } = action

    if (type === 'REFRESH_CONTENT') {
      return assign(state, payload)
    }

    return state
  },


  copy (state = {}, action = {}) {
    let { payload, type } = action

    if (type === 'REFRESH_COPY') {
      return assign(state, payload)
    }

    return state
  },

  entities (state = {}, action = {}) {
    let { payload, type } = action

    if (type === 'REFRESH_ENTITIES') {
      return assign(state, payload)
    }

    return state
  },

  models (state = {}, action = {}) {
    let { payload, type } = action

    if (type === 'REFRESH_MODELS') {
      return assign(state, payload)
    }

    return state
  },

  project (state = {}, action = {}) {
    let { payload, type } = action

    if (type === 'REFRESH_PROJECT') {
      return assign(state, payload)
    }

    return state
  },

  settings (state = {}, action = {}) {
    let { payload, type } = action

    if (type === 'REFRESH_SETTINGS') {
      return assign(state, payload)
    }

    return state
  },

}

function delegate(recipient, ...propertyNames) {
  let i = (source) => {
    propertyNames.forEach(prop => {
      defineProperty(recipient, prop, {
        get: function () {
          return source[prop]
        }
      })
    })
  }

  i.to = i

  return i
}

function requireStateConfig(screenId) {
  return cache.redux[screenId] = cache.redux[screenId] || this.require('script', `${ screenId }/state`)
}

function requireScreen(screenId) {
  let handler = this.findScreenHandler(screenId)
  let relativePath = handler && handler.paths.relative

  if (!relativePath) {
    throw('Failed to find screen via: ' + screenId)
  }

  let asset = this.requireContexts.scripts( './' + relativePath )

  if (!asset) {
    throw('Failed to require screen via context: ' + screenId)
  }

  return asset.default ? asset.default : asset
}

function requireComponent(componentId) {
    let handler = this.findComponentHandler(componentId)
    let relativePath = handler && handler.paths.relative

    if (!relativePath) {
      throw('Failed to find component handler via: ' + componentId)
    }

    let asset = this.requireContexts.scripts( './' + relativePath )

    if (!asset) {
      throw('Failed to require component via context: ' + componentId)
    }

    return asset.default ? asset.default : asset
}


function requireLayout(componentId) {
    let handler = this.findLayoutHandler(componentId)
    let relativePath = handler && handler.paths.relative

    if (!relativePath) {
      throw('Failed to find layout handler via: ' + componentId)
    }

    let asset = this.requireContexts.scripts( './' + relativePath )

    if (!asset) {
      throw('Failed to require layout via context: ' + componentId)
    }

    return asset.default ? asset.default : asset
}


const { defineProperty, keys, assign } = Object

function attempt(fn) {
  try { return fn() } catch(error) {  }
}
