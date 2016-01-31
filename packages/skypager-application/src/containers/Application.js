import React, { Component, PropTypes as types } from 'react'
import { render } from 'react-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'

import browserHistory from 'history/lib/createBrowserHistory'
import memoryHistory from 'history/lib/createMemoryHistory'

import { stores as buildStore } from '../util/stores'
import { routes as buildRoutes } from '../util/routes'

const history = browserHistory()

export class Application extends Component {
  static displayName = 'Application';

  static propTypes = {
    // an array of objects which will get merged into the rootReducer
    reducers: types.arrayOf(types.object),

    // an array of objects which will get merged into an initialState
    state: types.arrayOf(types.object),

    // the main layout component to wrap the app in
    main: types.func.isRequired,

    // entry point configuration
    entryPoints: types.object.isRequired,

    // an array of redux middlewares to inject into the store
    middlewares: types.array
  };

  static render (options = {}) {
    const { main, entryPoints, middlewares, reducers, initialState } = options

    return render(
      <Application entryPoints={entryPoints}
                       initialState={initialState}
                       main={main}
                       middlewares={middlewares}
                       reducers={reducers} />

      , document.getElementById(options.root)
    )
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

export default Application
