module.exports =
class ProjectBundle {
  constructor (bundle, options = {}) {
    hide(this, {
      bundle
    })

    if (options.computed) {
      assign(this, options.computed)
    }

    this.assets = this.bundle.assets
    this.content = this.bundle.content
    this.docs = this.content.docs
    this.data = this.content.data_sources
    this.entities = this.bundle.entities
    this.models = this.bundle.models
    this.project = this.bundle.project
    this.settings = (this.data.settings && this.data.settings.data) || {}
    this.entityNames = keys(this.entities || {})
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
    let key = this.content[assetType + 's'][assetId].paths.relative

    let mod = this.bundle.requireContexts[assetType + 's'](`./${ key }`)

    if (!mod) {
       console.log('Failure', assetType, assetId, this.bundle.requireContexts)
       throw('Could not find ' + assetType + ' ' + assetId)
    }

    return mod.default ? mod.default : mod
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

    console.log('Built State Machine')
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

    console.log('Built Entry Points')
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

    console.log('Built Layout')
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

function values(obj) {
   return keys(obj).map(k => obj[k])
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

function isRegex(val) {
  if ((typeof val === 'undefined' ? 'undefined' : typeof(val)) === 'object' && Object.getPrototypeOf(val).toString() === '/(?:)/') {
    return true;
  }

  return false;
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

const { defineProperty, keys, assign } = Object
