import isEmpty from 'lodash/isEmpty'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import mapValues from 'lodash/mapValues'
import values from 'lodash/values'
import omit from 'lodash/omit'

import { createRoutes as create } from 'react-router'

export default routes

export function routes({layout, screens, project}) {
  let indexAssetId = screens.index || screens.default

  return create({
    path: '/',

    get component() {
      return isString(layout) ? project.requireLayout(layout) : layout
    },

    indexRoute: {
      get component() {
        return project.requireScreen(indexAssetId)
      }
    },

    /**
     * Expects a screens configuration that looks like:
     *
     * {
     *  index: "HomePage",
     *  about: "AboutPage",
     *  jobs: "JobsPage"
     * }
     *
     * it will build an array of react-router plainRoute objects from
     * the entries/HomePage, entries/AboutPage, entries/JobsPage components if they exist.
     */
    childRoutes() {
      let childRouteConfig = omit(screens, 'default', 'index', '/')

      // TODO: ability for a component to act as an entry point. we can assume entry points
      // are already exported as plainRoute objects, which they should be to take advantage of
      // webpack code splitting via require.ensure.  Components would just need to be wrapped in
      // a plainRoute object interface
      let plainRoutes = mapValues(childRouteConfig, (entryPointId, name) => {
        return toPlainRoute(
          project.requireScreen(entryPointId), name, project
        )
      })

      return Object.values(plainRoutes)
    }
  })
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

  if (hasOwnProperty(component, 'childRoutes')) {
     plainRoute.childRoutes = childRoutes
  }

  if (hasOwnProperty(component, 'components')) {
    plainRoute.components = mapValues(component.components, (comp) => {
      return isString(comp) ? project.requireComponent(comp) : comp
    })
  }

  return plainRoute
}
