import React, { Component } from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link } from 'react-router'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { routeReducer, syncHistory } from 'redux-simple-router'

import thunk from 'redux-thunk'
import browserHistory from 'history/lib/createBrowserHistory'
import memoryHistory from 'history/lib/createMemoryHistory'

/**
 * Creates a new Application and renders it.
 *
 * @example
 *
 * Application.render({
 *   state: [ {...}, {...} ],
 *   reducers: [{...}, {...}],
 *   mainComponent,
 *   routes
 * })
 *
 * @param state array an array of state objects which will be merged into redux
 *  store's initialState via an object assign
 *
 * @param reducers array an array of reducer objects which will be merged into
 *  a single rootReducer
 *
 * @param mainComponent React.Component a reference to the component which will be the IndexRoute
*/
export class Application {
  static render (options = {}) {
    let App = new Application(options)

    App.component = App.render(options.el || 'app')

    return App
  }

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

  get routes () {
    return this.options.routes
  }

  get router () {
    return (
       <Route path='/'>
         <IndexRoute component={ this.mainComponent } />

         <Route path='other'>
            <IndexRoute component={ Page } />
            <Route path="section" component={ Page } />
         </Route>

       </Route>
    )
  }

  get mainComponent () {
    return this.options.mainComponent || HelpPage
  }
}

export default Application

export class Page extends Component  {
  render() {
    return (
      <div className='page'>
        <h1>page</h1>
      </div>
    )
  }
}

export function HelpPage (props, context) {
  return (
    <div className='help-page'>
      <h1>Help</h1>
      <Link to="/other/section">Move</Link>
    </div>
  )
}
