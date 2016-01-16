import { combineReducers } from 'redux'
import { routeReducer as router } from 'redux-simple-router'

import assets from './assets'
import content from './content'
import entities from './entities'
import html from './html'
import settings from './settings'

export const reducers = {
  assets,
  content,
  html,
  entities,
  router,
  settings
}

export function build (extras = {}) {
  return combineReducers(Object.assign(reducers, extras))
}
