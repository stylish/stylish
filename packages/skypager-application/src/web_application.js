/**
 * Skypager.Application
 *
 * @description
 *
 * The Skypager.Application class is the global, centralized State Machine for
 * our React Applications.  It conveniently wraps the React, React-Router, and Redux
 * libraries and enables us to spawn up new React applications while only passing in the
 * Application Specific parts of our Codebase.
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
    this.options = options

    this.history = browserHistory()

    this.initialState = options.state || [{}]
    this.reducers = options.reducers || [{}]

    Object.defineProperty(this, 'store', {
      configurable: true,
      get: function() {
        delete this.store
        return this.store = this.buildStore()
      }
    })

    Object.defineProperty(this, 'routes', {
      configurable: true,
      get: function() {
        delete this.routes
        return this.store = this.buildRoutes(options)
      }
    })
  }

  get state () {
    return this.store.getState()
  }

  dispatch (...args) {
     this.store.dispatch(...args)
  }

  render (el) {
    render(
      this.container, document.getElementById(el)
    )
  }

  buildStore () {
    const { initialState, reducers, history } = this
    const appState = Object.assign({}, ...initialState)
    const rootReducer = combineReducers(Object.assign({router: routeReducer}, ...reducers))

    const build = compose(applyMiddleware(
      thunk,
      syncHistory(this.history)
    ))(createStore)

    return build(rootReducer, appState)
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
    return this.options.defaultEntry || HelpPage
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
