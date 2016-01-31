import React, { Component, PropTypes as types } from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'

import browserHistory from 'history/lib/createBrowserHistory'
import memoryHistory from 'history/lib/createMemoryHistory'

import { stores as buildStore } from '../util/stores'
import { routes as buildRoutes } from '../util/routes'

import auth from '../extensions/auth'

const history = browserHistory()

const defaultInitialState = [{
  auth: auth.initialState
}]

const defaultReducers = [{
  auth: auth.reducer
}]

const defaultMiddlewares = []

export class LockedApplication extends Component {
  static displayName = 'LockedApplication';

  static propTypes = {
    // an array of objects which will get merged into the rootReducer
    reducers: types.arrayOf(types.object),
    // an array of objects which will get merged into an initialState
    state: types.arrayOf(types.object),
    // the main layout component to wrap the app in
    main: types.func.isRequired,

    // entry point configuration
    entryPoints: types.object.isRequired,

    // the auth0 lock object
    lock: types.object.isRequired,

    // an array of redux middlewares to inject into the store
    middlewares: types.array
  };

  static create(options = {}) {
    const lock = new Auth0Lock(options.lock.clientId, options.lock.domain)
    const renderer = this.renderer(options)

    lock.show((err, result) => {
      if(err) {
        return err;
      }

      console.log('Result', result)
      renderer()
    })
  }

  static render(options = {}) {
    return this.renderer(options)()
  }

  static renderer (options = {}) {
    let { main, entryPoints, lock, middlewares, reducers, initialState } = options

    initialState = initialState || defaultInitialState
    middlewares = middlewares || defaultMiddlewares
    reducers = reducers || defaultReducers

    initialState = isArray(initialState) ? initialState : [initialState]
    reducers = isArray(reducers) ? reducers : [reducers]

    return () => {
      render(
        <LockedApplication entryPoints={entryPoints}
                           initialState={initialState}
                           lock={lock}
                           main={main}
                           middlewares={middlewares}
                           reducers={reducers} />

        , document.getElementById(options.root)
      )
    }
  }

  constructor (props = {}, context = {}) {
    super(props, context)

    const { reducers, middlewares, initialState, main, entryPoints } = props

    this.store = buildStore({
      reducers,
      middlewares,
      initialState,
      history
    })

    this.routes = buildRoutes(main, {entryPoints})
  }

  render () {
    let { store, routes } = this

    return (
      <Provider store={store}>
        <Router history={history}>
          {routes}
        </Router>
      </Provider>
    )
  }
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

export default LockedApplication
