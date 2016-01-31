import { createRoutes as create } from 'react-router'

export default routes

export function routes(component, options = {}) {
  if (typeof component === 'object' && !options) {
    options = component
    component = "div"
  }

  const { entryPoints } = options
  const root = { path: "/", component, childRoutes:[] }

  if (entryPoints.index) {
    root.indexRoute = {
      component: take(entryPoints, 'index')
    }
  }

  let childRoutes = keys(entryPoints)
                    .map((path, i) =>
                         buildRoute(path, entryPoints[path], i)
                        )

  root.childRoutes.push(...childRoutes)

  let result = create(root)

  return result
}

function buildRoute(path, config = {}, index = 0) {
  let route = {
     path,
     component
  }

  if (config.index) {
     route.indexRoute = take(config, 'index')
  }

  return route
}

function take(object, property) {
   let value = object[property]
   delete(object[property])
   return value
}

const { keys, assign } = Object
