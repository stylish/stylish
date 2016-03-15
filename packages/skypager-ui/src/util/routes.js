import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import mapValues from 'lodash/mapValues'
import values from 'lodash/values'
import omit from 'lodash/omit'

import { createRoutes as create } from 'react-router'

export default routes

export function routes({layout, screens, project}) {

  let base = ({
    path: '/',

    component: layout,

    indexRoute: {
      component: screens.index
    }
  })

  let otherRoutes = omit(screens, 'default', 'index', '/')

  // TODO: ability for a component to act as an entry point. we can assume entry points
  // are already exported as plainRoute objects, which they should be to take advantage of
  // webpack code splitting via require.ensure.  Components would just need to be wrapped in
  // a plainRoute object interface
  let plainRoutes = mapValues(otherRoutes, (entryPoint, name) => {
    return toPlainRoute(
      entryPoint, name, project
    )
  })

  base.childRoutes = Object.values(plainRoutes)

  return base
}

function toPlainRoute(component, name, project) {
  let path = component.route
    ? (component.route.path || name)
    : (component.path || name)

  if (isPlainRoute(component)) {
    return component
  }

  let screens = component.route && component.route.screens

  let plainRoute = {
    ...(component.route),
    path,
    component,
    _generated: true,
  }

  if (screens) {
    let indexComponent = screens.index || screens.default

    if (indexComponent) {
      plainRoute.indexRoute = {
        component: isString(indexComponent) ? project.requireScreen(indexComponent) : indexComponent,
      }
    }

    component.childRoutes = omit(screens, 'index', 'default')
  }

  if (!isEmpty(component.childRoutes)) {
    component.childRoutes = mapValues(
      component.childRoutes,
      (childCompnent, path) => {
        return toPlainRoute(
          isString(childCompnent) ? project.requireScreen(childCompnent) : childCompnent,
          path,
          project
        )
      })

    plainRoute.childRoutes = Object.values(component.childRoutes)
  }

  if (component.components) {
    plainRoute.components = mapValues(component.components, (comp) => {
      return isString(comp) ? project.requireComponent(comp) : comp
    })
  }

  return plainRoute
}

function isPlainRoute(component) {
  if (!isObject(component)) {
    return false
  }

  if (component.path && (component.components || component.childRoutes || component.indexRoute)) {
     return true
  }
}
