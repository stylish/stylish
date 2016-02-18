import isEmpty from 'lodash/isEmpty'

import { createRoutes as create } from 'react-router'

export default routes

export function routes(component, options = {}) {
  if (typeof component === 'object' && !options) {
    options = component
    component = "div"
  }

  const { entryPoints } = options
  const root = { path: "/", component, childRoutes:[] }

  if (entryPoints['/']) {
    entryPoints.index = entryPoints['/']
    delete(entryPoints['/'])
  }

  if (entryPoints.index) {
    root.indexRoute = entryPoints.index.component
      ? entryPoints.index.component
      : { component: entryPoints.index }
  }

  let childRoutes = keys(entryPoints)
                    .filter(key => key !== 'index')
                    .map((path, i) => buildRoute(path, entryPoints[path], i))

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
