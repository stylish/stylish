import React, { Component, PropTypes as types } from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'

import browserHistory from 'history/lib/createBrowserHistory'
import memoryHistory from 'history/lib/createMemoryHistory'

import { stores as buildStore } from '../util/stores'
import { routes as buildRoutes } from '../util/routes'

import ProjectBundle from '../ProjectBundle'

const history = browserHistory()

const defaultInitialState = []
const defaultReducers = []
const defaultMiddlewares = []

let version = 0
let app

export class Application extends Component {
  static displayName = 'Application';

  static propTypes = {
    // an array of objects which will get merged into the rootReducer
    reducers: types.arrayOf(types.object),
    // an array of objects which will get merged into an initialState
    state: types.arrayOf(types.object),
    // the layout layout component to wrap the app in
    layout: types.func.isRequired,

    // entry point configuration
    entryPoints: types.object.isRequired,

    // an array of redux middlewares to inject into the store
    middlewares: types.array,

    project: types.object
  };

  static childContextTypes = {
    store: types.shape({
      subscribe: types.func.isRequired,
      dispatch: types.func.isRequired,
      getState: types.func.isRequired
    }),

    project: types.object
  };

  static sanitize = sanitize;

  static create (options = {}) {
    options = sanitize(options)

    let renderer = (()=>{
      this.render(options)
    })

    if (!options.defer) { renderer() }

    return renderer
  }

  static render (options = {}) {
    let project = options.project

    if (options.bundle && !project) {
      project = new ProjectBundle(options.bundle)
    }

    let props = project ? project.buildApp(options) : sanitize(options)

    let {
      layout,
      entryPoints,
      middlewares,
      reducers,
      initialState
    } = props

    if (version >= 1 && project) {
      console.log('We should be reloading the bundle')
    }

    app = render(
      <Application entryPoints={entryPoints}
                         initialState={initialState}
                         layout={layout}
                         project={project}
                         version={version}
                         middlewares={middlewares}
                         reducers={reducers} />

      , document.getElementById(options.root)
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
    return {
      store: this.store,
      project: this.props.project
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
  let initialState = options.initialState = options.initialState || defaultInitialState
  let middlewares = options.middlewares = options.middlewares || defaultMiddlewares
  let reducers = options.reducers = options.reducers || defaultReducers

  initialState = isArray(initialState) ? initialState : [initialState]
  reducers = isArray(reducers) ? reducers : [reducers]

  return assign({}, options)
}


const { keys, assign } = Object
