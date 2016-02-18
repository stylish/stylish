import React, { Component, PropTypes as types } from 'react'
import { render } from 'react-dom'
import { Router, browserHistory as history } from 'react-router'

import { stores as buildStore } from '../util/stores'
import { routes as buildRoutes } from '../util/routes'

import DefaultLayout from 'ui/layouts/DefaultLayout'

const defaultInitialState = []
const defaultReducers = []
const defaultMiddlewares = []

let version = 0
let app

export class Application extends Component {
  static displayName = 'Application';

  /**
   * Main Entry Point
   *
   * @example
   *
   * import project from 'dist/bundle'
   *
   * Application.create({
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

    if (project) {
      if (!options.setup && !project.settings.app) {
        return require('ui/applications/setup').setup(project)
      }
    }

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
    layout: types.func,

    // entry point configuration
    entryPoints: types.object,

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

    let {
      client,
      layout,
      entryPoints,
      middlewares,
      reducers,
      initialState
    } = props

    if (version >= 1 && project) {
      console.log(`skypager application version increase ${ version }`)
    }

    app = render(
      <Application entryPoints={entryPoints}
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

    let { layout, entryPoints } = this.props
    let { reducers, middlewares, initialState, project } = this.props

    this.routes = buildRoutes(layout, { entryPoints })

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

export default Application

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
