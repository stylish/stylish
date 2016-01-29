/**
 * Skypager.Application
 *
 * @description
 *
 * The Skypager.Application class is the global, centralized State Machine for
 * our React Applications.  It conveniently wraps the React, React-Router, and Redux
 * libraries and enables us to spawn up new React applications while only passing in the
 * Application Specific parts of our Codebase, which is usually confined to:
 *
 * - Entry Points
 * - Redux Stores w/ Standard Flux Actions
 * - Custom UI Components
 *
 * The Application also provides automatic bindings to the Skypager Project local to the project folder,
 * which makes all of the content and data from that project available to the application.
 *
 */
import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link } from 'react-router'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { routeReducer, syncHistory } from 'redux-simple-router'

import invariant from 'invariant'
import thunk from 'redux-thunk'
import browserHistory from 'history/lib/createBrowserHistory'
import memoryHistory from 'history/lib/createMemoryHistory'

export class Application {
  /**
   * Creates a new Application and renders it.
   *
   * @example
   *
   * Application.render({
   *   state: [ {...}, {...} ],
   *   reducers: [{...}, {...}],
   *   defaultEntry,
   *   routes
   * })
   *
  */
  static render (options = {}) {
    let App = new Application(options)

    App.component = App.render(options.el || 'app')

    return App
  }

  /**
   * Create a new Application Shell.
   *
   * @param state array an array of state objects which will be merged into redux
   *  store's initialState via an object assign
   *
   * @param reducers array an array of reducer objects which will be merged into
   *  a single rootReducer
   *
   * @param defaultEntry React.Component a reference to the component which will be the IndexRoute
   *
   * @param routes array[React.Router.Route] an array of React.Router Route components for each
   *  of the various Entry Point components in the application.
   *
   * @param entries array[React.Component] an array of React.Component classes for each Screen in the
   *  application.  This can be used in place of the routes option, and will automatically build the routes
   *  for you.  If the Component has a static `routePath` property, this will be used as the URI Path.

   */
  constructor (options = {}) {
		options.state = options.state || [{}]
		options.reducers = options.reducers || [{}]
		options.middlewares = options.middlewares || []
		options.routes = options.routes || []
		options.entries = options.entries || []

    this.options = options

    this.history = browserHistory()

    let hide = (prop, value) => _hide(this, prop, value)
    let lazy = (prop, fn) => _lazy(this, prop, fn)

    hide('reducers', options.reducers)
    hide('middlewares', options.middlewares || [])

    lazy('entryPoints', () => buildEntryPoints(options.entries || []))
    lazy('initialState', ()=> this.buildInitialState(options))
    lazy('store', () => this.buildStore(options))
    lazy('routes', () => this.buildRoutes(options))

    if (options.extensions) {
      this.loadExtensions(options)
    }
  }

  dispatch (...args) {
     this.store.dispatch(...args)
  }

  render (el) {
    render(
      this.container, document.getElementById(el)
    )
  }

  loadExtensions () {
    let extensions = this.options.extensions || {}

    Object.keys(extensions).forEach(name => {
      let extension = extensions[name] || {}
			let middlewares = extension.middlewares || []
			let reducers = extension.reducers || []
			let state = extension.state || []
			let routes = extension.routes || []
			let entries = extension.entries || []

      if (middlewares) { this.options.middlewares.push(...middlewares) }
      if (reducers) { this.options.reducers.push(...reducers) }
      if (state) { this.options.state.push(...state) }
			if (routes) { this.options.routes.push(...routes) }

      if (entries) {
        this.entryPoints.push(...(buildEntryPoints(entries)))
      }
    })
  }
  /**
   * Automatically build a Redux store by combining any reducers you pass in to the Application constructor.
   */
  buildStore () {
    const { initialState, reducers, history } = this
    const appState = Object.assign({}, ...initialState)
    const combined = Object.assign({router: routeReducer}, ...reducers)
    const rootReducer = combineReducers(combined)

    const middlewares = [ thunk, syncHistory(this.history) ].concat(this.middlewares || [])

    const build = compose(applyMiddleware(...middlewares))(createStore)

    return build(rootReducer, pick(appState, Object.keys(combined)))
  }

  /**
   * @param routes array[Router.Route]
   * @param entries object map a route path to a React.Component
   *
   * Build this Applications routes dynamically based on the options
   * passed to the Application constructor. Routes can be explicitly defined,
   * or we can build a router according to convention based on the Entry Point
   * components passed in.
   *
   * @example pass in entries as an object keyed by path
   *
   *  Application.render({
   *    entries:{
   *      "/" : Home,
   *      "/books" : BrowseBooks
   *    }
   *  })
   *
   * @example pass in routes directly
   *
   *  const routes = (
   *    <Route path="books" component={BrowseBooks} />
   *    <Route path="authors" component={BrowseAuthors} />
   *  )
   *
   *  Application.render({
   *    routes
   *  })
   *
   * @example pass in an array of entry points
   *
   *  BrowseBooks.path = "/books"
   *
   *  Application.render({
   *    entries:[
   *      BrowseBooks,
   *      BrowseAuthors
   *    ]
   *  })
   */
  buildRoutes (options = {}) {
    const routes = options.routes || []
    return routes.concat(this.entryPoints)
  }

  addEntries(entries){
    let entryPoints = buildEntryPoints(entries)
    this.entryPoints.push(...entryPoints)
  }

	buildInitialState (options = {}) {
		return options.state || [{}]
	}

  get container () {
    let { store, router, history } = this

    return (
      <Provider store={store}>
        <Router history={history}>
          {router}
        </Router>
      </Provider>
    )
  }

  get router () {
    return (
       <Route path='/'>
         <IndexRoute component={ this.defaultEntry } />
         { this.routes }
       </Route>
    )
  }

  get defaultEntry () {
    if (this.options.defaultEntry || this.options.defaultEntryPoint) {
      return this.options.defaultEntry || this.defaultEntryPoint
    }

    if (this.options.entries && this.options.entries.default) {
      return this.options.entries.default
    }

    return this.entryPoints[0] || HelpPage
  }

  get middlewares () {
    return this.options.middlewares || []
  }
}

export default Application

export function HelpPage (props, context) {
  return (
    <div className='help-page'>
      <h1>TODO: HELP</h1>
      <p>This page will be visible whenever the application doesn't have a main component, or can't build a dynamic routing table</p>
    </div>
  )
}

function _hide(obj, property, value) {
  Object.defineProperty(obj, property, {
    enumerable: false,
    value
  })

  return value
}

function _lazy(obj, property, fn, ...args) {
  Object.defineProperty(obj, property, {
    configurable: true,
    get: function() {
      delete obj[property]
      return obj[property] = fn.call(obj, ...args)
    }
  })
}

function pick(object = {}, keys) {
  return keys.reduce((memo,key)=> {
    memo[key] = object[key]
    return memo
  }, {})
}

function buildEntryPoints(entries) {
  if (entries && typeof(entries.length) === 'undefined') {
    return (Object.keys(entries).map((path,index) => {
      let component = entries[path]

      return <Route key={index} path={path} component={component} />
    }))
  } else if (entries && entries.length >= 1) {
    return (entries.map((entry,index) => {
      let path = entry.path ? entry.path : (entry.displayName || 'whatever').toLowerCase()
      return <Route key={index} path={path} component={entry} />
    }))
  } else {
    return []
  }
}
