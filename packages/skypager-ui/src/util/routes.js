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

  let childRouteConfig = omit(screens, 'default', 'index', '/')

  // TODO: ability for a component to act as an entry point. we can assume entry points
  // are already exported as plainRoute objects, which they should be to take advantage of
  // webpack code splitting via require.ensure.  Components would just need to be wrapped in
  // a plainRoute object interface
  let plainRoutes = mapValues(childRouteConfig, (entryPoint, name) => {
    return toPlainRoute(
      entryPoint, name, project
    )
  })

  base.childRoutes = Object.values(plainRoutes)

  return base
}

function toPlainRoute(component, path, project) {
  path = path || component.path

  if (!path) {
    throw('Can not build a plain route object if the component does not define a path or if you do not provide one')
  }

  // already a plain route object apparently
  if (component && component.path && (hasOwnProperty(component, 'component') || hasOwnProperty(component, 'getComponent'))) {
    return component
  }

  let plainRoute = {
     path,
     component
  }

  if (component.childRoutes) {
     plainRoute.childRoutes = component.childRoutes
  }

  if (component.components) {
    plainRoute.components = mapValues(component.components, (comp) => {
      return isString(comp) ? project.requireComponent(comp) : comp
    })
  }

  return plainRoute
}
