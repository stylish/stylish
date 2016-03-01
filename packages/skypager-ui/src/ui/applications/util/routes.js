import isEmpty from 'lodash/isEmpty'

import { createRoutes as create } from 'react-router'

export default routes

export function routes(component, options = {}) {
  if (typeof component === 'object' && !options) {
    options = component
    component = "div"
  }

  const { screens } = options
  const root = { path: "/", component, childRoutes:[] }

  if (screens['/']) {
    screens.index = screens['/']
    delete(screens['/'])
  }

  if (screens.index) {
    root.indexRoute = screens.index.component
      ? screens.index.component
      : { component: screens.index }
  }

  let childRoutes = keys(screens)
                    .filter(key => key !== 'index')
                    .map((path, i) => buildRoute(path, screens[path], i))

  root.childRoutes.push(...childRoutes)

  let result = create(root)

  return result
}

function buildRoute(path, config = {}, index = 0) {
  let component = config.component
  let route = { path, component }

  if (config.index) {
    route.indexRoute = {
      component: config.index.component || config.index
    }
  }

  return route
}

const { keys, assign } = Object
