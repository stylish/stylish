import React, { Component, PropTypes as types } from 'react'
import { render } from 'react-dom'
import { Router, browserHistory as history } from 'react-router'

import pick from 'lodash/pick'
import mapValues from 'lodash/mapValues'

import { stores as buildStore } from 'ui/util/stores'
import { routes as buildRoutes } from 'ui/util/routes'
import { validate as validateProps } from 'ui/util/validate'

import stateful from 'ui/util/stateful'

import DefaultLayout from 'ui/layouts/DefaultLayout'

/**
 * WebApp provides any Skypager Project with a React Router and Redux based application.
*/
export class WebApp extends Component {
  static displayName = 'WebApp';

  /**
   * Main Entry Point
   *
   * @example
   *
   * import { createElement as create } from 'react'
   * import { render } from 'react-dom'
   *
   * const { copy, settings, entities } = require('dist/bundle')
   * const { screens, layout } = settings
   *
   * const el = document.getElementById
   *
   * render(<WebApp {...props} />, el('app'))
   */
  static create (options = {}) {
    options = sanitize(options)

    const { layout, settings, copy, entities, screens, project } = options

    let renderer = (()=>{
      this.render(options)
    })

    if (!options.defer) { renderer() }

    return renderer
  }


  static propTypes = {
    /** an array of objects which will get merged into the rootReducer */
    reducers: types.arrayOf(types.object).isRequired,

    /** an array of objects which will get merged into an initialState */
    state: types.arrayOf(types.object).isRequired,

    /** the layout layout component to wrap the app in */
    layout: types.func,

    /** entry point configuration */
    screens: types.shape({
      index: types.func
    }),

    /** an array of redux middlewares to inject into the store */
    middlewares: types.array,

    settings: types.object,

    copy: types.object,

    entities: types.object
  };

  static defaultProps = {
    copy: {},
    entities: {},
    settings: {}
  };

  static childContextTypes = {
    store: types.shape({
      subscribe: types.func.isRequired,
      dispatch: types.func.isRequired,
      getState: types.func.isRequired
    }),

    project: types.object.isRequired,

    query: types.func.isRequired
  };

  static render (options = {}) {
    let project = options.project || options.bundle

    let props = project ? project.buildApp(options) : sanitize(options)

    if (!validateProps(props, WebApp)) {
      throw('Invalid Application Properties.')
    }

    const root = document.getElementById(options.root || 'app')

    return app = render(<WebApp {...props} />, root)
  }

  constructor (props = {}, context = {}) {
    let project = props.project
    delete(props.project)

    super(props, context)

    this.project = project

    this.routes = buildRoutes({
      layout: props.layout,
      project,
      screens: props.screens
    })

    this.store = buildStore({
      project,
      ...(pick(props, 'history', 'initialState', 'middlewares', 'reducers'))
    })
  }

  getChildContext () {
    return {
      project: this.project,
      query: this.project.query,
      settings: this.project.settings
    }
  }

  render () {
    return (
      <Router history={history}>
        {this.routes}
      </Router>
    )
  }
}

export default WebApp

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]'
}

/**
 * since the various components which get wired up into the redux store
 * can be scattered across different entry point components, we let them
 * export just their relevant pieces and we handle merging it all together.
 *
 * the initial props which are passed to the application might not remember this
 * and so we will make sure to do it for them.
 */
export function sanitize(options = {}) {
  let reduxOptions = pick(options, 'middlewares', 'reducers', 'initialState')

  return {
    ...options,
    ...(
      mapValues(
        reduxOptions,
        (value) => value ? (isArray(value) ? value : [value]) : [])
    )
  }
}


const { keys, assign } = Object
