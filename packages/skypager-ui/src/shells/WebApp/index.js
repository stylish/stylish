import React, { Component, PropTypes as types } from 'react'
import { render } from 'react-dom'
import { Router, browserHistory as history } from 'react-router'

import { stores as buildStore } from 'ui/shells/util/stores'
import { routes as buildRoutes } from 'ui/shells/util/routes'
import { validate as validateProps } from 'ui/shells/util/validate'
import stateful from 'ui/shells/util/stateful'

import DefaultLayout from 'ui/layouts/DefaultLayout'

const defaultInitialState = []
const defaultReducers = []
const defaultMiddlewares = []

let version = 0
let app

export class WebApp extends Component {
  static displayName = 'WebApp';

  /**
   * Main Entry Point
   *
   * @example
   *
   * import project from 'dist/bundle'
   *h
   * WebApp.create({
   *  project
   * })
   *
   */
  static create (options = {}) {
    options = sanitize(options)

    const { project } = options

    if(!project) {
      throw('Must supply a skypager project bundle to launch this application')
    }

    /*
    if (project) {
      if (!options.setup && !project.settings.app) {
        return require('ui/applications/setup').setup(project)
      }
    }
    */

    if (options.layout && typeof options.layout === 'function') {
       options.layout = stateful(options.layout, 'settings', 'settings.navigation', 'settings.branding')
    }

    let renderer = (()=>{
      this.render(options)
    })

    if (!options.defer) { renderer() }

    return renderer
  }


  static propTypes = {
    // an array of objects which will get merged into the rootReducer
    reducers: types.arrayOf(types.object),
    // an array of objects which will get merged into an initialState
    state: types.arrayOf(types.object),
    // the layout layout component to wrap the app in
    layout: types.string,

    // entry point configuration
    screens: types.shape({
      index: types.string.isRequired
    }),

    // an array of redux middlewares to inject into the store
    middlewares: types.array,

    project: types.object,

    client: types.object
  };

  static defaultProps = {
    layout: DefaultLayout
  };

  static childContextTypes = {
    client: types.object,

    store: types.shape({
      subscribe: types.func.isRequired,
      dispatch: types.func.isRequired,
      getState: types.func.isRequired
    }),

    project: types.object,

    settings: types.object
  };

  static sanitize = sanitize;

  static render (options = {}) {
    let project = options.project || options.bundle

    let props = project ? project.buildApp(options) : sanitize(options)

    if (!validateProps(props, WebApp)) {
      throw('Invalid Application Properties.')
    }

    let {
      client,
      layout,
      screens,
      middlewares,
      reducers,
      initialState
    } = props

    if (version >= 1 && project && app && options.hot) {
      app.reloadBundle(project)
    }

    app = render(
      <WebApp screens={screens}
                         initialState={initialState}
                         layout={layout}
                         project={project}
                         client={client}
                         version={version}
                         middlewares={middlewares}
                         reducers={reducers} />

      , document.getElementById(options.root || 'app')
    )

    version = version + 1
    return app
  }

  constructor (props = {}, context = {}) {
    super(props, context)

    let { layout, screens } = this.props
    let { reducers, middlewares, initialState, project } = this.props

    this.routes = buildRoutes({layout, screens, project })

    //console.log('WebApp Creating', props, context)

    this.store = buildStore({
      reducers,
      middlewares,
      initialState,
      history,
      project
    })
  }

  reloadBundle (project) {
     ['assets','project','content','settings','entities','models'].forEach(
       (key) => this.store.dispatch({
         type: `REFRESH_${ key.toUpperCase() }`,
         payload: project[key]
       })
     )
  }

  getChildContext () {
    let { project, client } = this.props
    let settings = project.settings || {}

    return {
      store: this.store,
      project,
      client,
      settings
    }
  }

  render () {
    return (
      <Router history={history}>
        {this.routes}
      </Router>
    )
  }
}

export default WebApp

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

export function sanitize(options = {}) {
  if (!options.project && options.bundle) {
    options.project = options.bundle
    delete(options.bundle)
  }

  let initialState = options.initialState = options.initialState || defaultInitialState
  let middlewares = options.middlewares = options.middlewares || defaultMiddlewares
  let reducers = options.reducers = options.reducers || defaultReducers

  initialState = isArray(initialState) ? initialState : [initialState]
  reducers = isArray(reducers) ? reducers : [reducers]

  return assign({}, options)
}


const { keys, assign } = Object
