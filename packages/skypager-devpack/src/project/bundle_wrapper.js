/**
 * Consumes a Skypager Bundle Export and provides
 * a Project like interface.  It also can generate a Skypager.Application
*/

import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import omit from 'lodash/omit'
import defaults from 'lodash/defaultsDeep'

import DefaultSettings from './default_settings'

const default_settings = DefaultSettings({version:'v1'})

module.exports =

class BundleWrapper {
  static create(...args) {
    return new BundleWrapper(...args)
  }

  constructor (bundle, options = {}) {
    hide(this, {
      bundle
    })

    if (options.computed) {
      assign(this, options.computed)
    }

    let content = bundle.content || {}
    let contentCollections = keys(content)

    this.assets   = bundle.assets
    this.project  = bundle.project
    this.entities = bundle.entities
    this.content  = bundle.content
    this.model    = bundle.models

    let settings = defaults(
      bundle.settings,
      default_settings
    )

    let currentApp = settings.app.current || settings.app.available[0] || default_settings.app.current || 'web'
    let app = settings.apps[currentApp] || default_settings.apps[currentApp] || default_settings.apps.web

    this.settings = app

    this.copy = (bundle.copy && bundle.copy[currentApp])
      ? bundle.copy[currentApp]
      : bundle.copy

    //this.assetsContent = this.content.assets
    this.settingsContent = this.content.settings
    this.docs = this.content.documents
    this.data = this.content.data_sources

    this.scripts = this.content.scripts
    this.stylesheets = this.content.stylesheets
    this.packages = this.content.packages
    this.projects = this.content.projects

    this.entityNames = keys(this.entities || {})

    this.requireContexts = bundle.requireContexts

    // naming irregularities
    assign(this, {
      get settingsFiles() {
        return bundle.content.settings_files
      },
      get copyFiles() {
        return bundle.content.copy_files
      },
      get data() {
        return bundle.content.data_sources
      }
    })

    if (options.subscribe) {
      this.setupSubscription(options.subscribe)
    }


  }

  createApp(appClass, options = {}) {
    appClass = appClass || require('ui/applications').Application

    return appClass.create(
      this.buildApp(
        options
      )
    )
  }

  buildApp (options = {}) {
    let props =

    this.buildStateMachine(
      this.buildLayout(
        this.buildScreens(
          options
        )
      )
    )

    return props
  }

  query (source, params) {
    source = `${ source }`.toLowerCase()

    if (this.entityNames.indexOf(source) > 0) {
      return filterQuery(values(this.entities[source]), params)
    }
  }

  // subscribe to a notifications channel which will push updates
  // whenever the bundle changes
  setupSubscription(options = {}) {

  }

  requireEntryPoint (id) {
    return this.require('script', `entries/${ id }`)
  }

  requireLayout (id) {
    let result

    try {
      result = this.require('script', `layouts/${ id }`)
    } catch(e) { }

    if (result) { return result }

    console.log('Dynamic Layouts', require('ui/layouts').keys())
  }

  requireComponent (id) {
    return this.require('script', `components/${ id }`)
  }

  requireStyleSheet (id) {
    return this.require('stylesheet', id)
  }

  require(assetType, assetId) {
    let file = this[`${assetType}s`][assetId] ||
               this[`${assetType}s`][`${assetId}/index`] ||
               this[`${assetType}s`][`${assetId}/${ assetId }`];

    if(!file) {
      console.error('Error requiring asset from require contexts', assetId, assetType)
      throw('Error loading asset from the require context')
    }

    let key = file.paths.relative
    let asset = this.requireContexts[`${assetType}s`]( './' + key )

    if (!asset) {
       throw('Could not find ' + assetType + ' ' + assetId)
    }

    return asset.default ? asset.default : asset
  }


  buildStateMachine (props = {}) {
    let project = props.project = this

    props.reducers = props.reducers || []
    props.initialState = props.initialState || []

    props.reducers.push(ProjectReducers)

    props.initialState.push({
      assets: project.assets,
      content: project.content,
      entities: project.entities,
      models: project.models,
      settings: this.settings,
      copy: this.copy
    })

    return props
  }

  buildScreens (props = {}) {
    let { project } = props.project
  }

  buildLayout (props = {}) {
    let settings = this.settings

    props.layout = props.layout || settings.layout

    if (isString(props.layout)) {
      try {
        props.layout = this.requireLayout(props.layout)
      } catch(error) {
         console.log(`Error looking up string based layout`, props.layout)
      }
    }

    if (!props.layout) {
       props.layout = require('../ui/layouts/DefaultLayout').default
    }

    if (!props.layout) {
      console.warn(
        'Could not auto generate a layout component'
      )
    }

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
}

function filterQuery (list = [], params) {
  if ( typeof params === 'function' ) {
    return list.filter(params)
  }

  return (list || []).filter(item => {
    return keys(params).every(key => {
      let param = params[key]
      let value = item[key]

      if (isRegexp(param) && param.test(value)) {
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


const { defineProperty, keys, assign } = Object
