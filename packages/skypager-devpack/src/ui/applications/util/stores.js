import { pick } from 'lodash'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { routeReducer, syncHistory } from 'redux-simple-router'
import thunk from 'redux-thunk'

import invariant from 'invariant'

export default stores

export function stores (options = {}) {
  console.log('Building a Store')

  let { initialState, reducers, history, middlewares, project } = options

  invariant(isArray(reducers), 'Pass an array of reducers')
  invariant(isArray(initialState) && reducers.length === initialState.length, 'Pass an array of initial state objects for each reducer')

  const router = {router: routeReducer}
  const defaultMiddlewares = [thunk, syncHistory(history)]

  const appReducers = reducers.length > 0
    ? assign(router, ...reducers)
    : router

  const appState = initialState.length > 0
    ? assign({}, ...initialState)
    : {}

  const appMiddlewares = middlewares && middlewares.length > 0
    ? defaultMiddlewares.concat(middlewares)
    : defaultMiddlewares

  if (project) {
     appState.assets = project.assets
     appState.content = project.content
     appState.entities = project.entities
     appState.models = project.models
     appState.project = project.project
     appState.settings = project.settings
  }

  return compose(applyMiddleware(...appMiddlewares), window.devToolsExtension ? window.devToolsExtension() : f => f)(createStore)(

    combineReducers(appReducers),
    pick(appState, keys(appReducers))
  )
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

const { assign, keys } = Object
