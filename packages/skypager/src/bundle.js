import omit from 'lodash/object/omit'
import result from 'lodash/object/result'
import isRegexp from 'lodash/lang/isRegexp'

/**
 * Consumes a Skypager Bundle Export and provides
 * a Project like interface.  It also can generate a Skypager.Application
*/
module.exports =

class Bundle {
  static create(...args) {
    return new Bundle(...args)
  }

  constructor (bundle, options = {}) {
    hide(this, {
      bundle
    })

    if (options.computed) {
      assign(this, options.computed)
    }

    let exporterKeys = keys(bundle)
    let content = bundle.content
    let contentCollections = keys(content)

    delegate(this, ...exporterKeys).to(bundle)
    delegate(this, ...contentCollectons).to(content)

    this.entityNames = keys(this.entities || {})

    // naming irregularities
    assign(this, {
      get settingsFiles() {
        return bundle.content.settings
      },
      get assetFiles() {
        return bundle.content.assets
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
    return appClass.create(buildApp(options))
  }

  buildApp (options = {}) {
    let props =

    this.buildStateMachine(
      this.buildLayout(
        this.buildEntryPoints(
          assign({}, options)
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
    return this.require('script', `layouts/${ id }`)
  }

  requireComponent (id) {
    return this.require('script', `components/${ id }`)
  }

  requireStyleSheet (id) {
    return this.require('stylesheet', id)
  }

  require(assetType, assetId) {
    let key = this.get(`${ assetType }s.${ assetId }.paths.relative`)
    let asset = this.get(`requireContexts.${ assetType }s`)('./' + key)

    if (!asset) {
       throw('Could not find ' + assetType + ' ' + assetId)
    }

    return asset.default ? asset.default : asset
  }


  buildStateMachine (props = {}) {
    let project = props.project = this

    let { settings } = ProjectReducers

    props.reducers = props.reducers || []
    props.initialState = props.initialState || []

    props.reducers.push(ProjectReducers)

    props.initialState.push({
      assets: project.assets,
      content: project.content,
      entities: project.entities,
      models: project.models,
      settings: project.settings
    })

    return props
  }

  buildEntryPoints (props = {}) {
    let project = props.project = this
    let settings = project.settings || {}
    let app = settings.app || {}

    props.entryPoints = assign(app.entryPoints || {}, props.entryPoints || {})

    let entryPaths = keys(props.entryPoints)

    if (entryPaths.length < 1) {
      throw('Invalid Application Settings; missing an entry point')
    }

    entryPaths.forEach(path => {
      let cfg = props.entryPoints[path]

      if (typeof cfg === 'string') {
        cfg = props.entryPoints[path] = {
          component: project.requireEntryPoint(cfg)
        }
      }

      if (typeof cfg === 'object' && typeof cfg.component === 'string') {
         cfg.component = project.requireEntryPoint(cfg.component)
      }

      if (typeof cfg === 'object' && cfg.index && typeof cfg.index === 'string') {
         cfg.index = project.requireEntryPoint(cfg.index)
      }

      if (typeof cfg === 'object' && cfg.index && typeof cfg.index === 'object') {
         cfg.index.component = project.requireEntryPoint(cfg.index.component)
      }

    })

    return props
  }

  buildLayout (props = {}) {
    let project = props.project = this
    let settings = project.settings || {}
    let app = settings.app || {}

    props.layout = props.layout || app.layout

    if (typeof props.layout === 'string') {
       props.layout = this.requireLayout(props.layout)
    }

    if (typeof props.layout === 'object') {
      if (typeof props.layout.component === 'string') {
        props.layout.component = this.requireLayout(props.layout.component)
      }
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

  entities (state = {}, action = {}) {
    let { payload, type } = action

    if (type === 'REFRESH_ENTITIES') {
      return assign(state, payload)
    }

    return state
  },

  models (state = {}, action = {}) {
    let { payload, type } = action

    if (type === 'REFRSH_MODELS') {
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
