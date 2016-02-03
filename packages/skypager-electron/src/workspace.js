import electronify from 'electronify-server'
import { join, resolve } from 'path'

let workspaces = {}

export class Workspace {
  static provision (application, options) {
    let workspace = workspaces[options.id] || new Workspace(application, options)
    return workspace
  };

  constructor (application, options = {}) {
    hide(this, 'application', application)
    hide(this, 'electronify', options.electronify || {})

    this.id = options.id || `workspace-${ keys(workspaces).length }`
  }

  dispatch (action = {}) {
    action.meta = assign({ workspace_id: this.id }, action.meta || {})
    return this.application.dispatch.call(this.application, action)
  }

  launch (params = {}) {
    let w = this

    let options = assign(this.electronify, params, {
      ready: function(electronApp) {
        w.dispatch(appIsReady(w, electronApp))
      },
      preLoad: function(electronApp, win) {
        w.dispatch(workspaceWillLoad(w, electronApp, win))
      },
      postLoad: function(electronApp, win) {
        w.dispatch(workspaceDidLoad(w, electronApp, win))
      },
    })

    electronify(options)
  }
}

export default Workspace

export const initialState = {
  processes: {},
  browserWindows: {}
}

export function reducer (state = initialState, action = {}) {
  return state
}

function workspaceWillLoad (workspace, electronApp, browserWindow) {
  return {
    type: 'ELECTRON_WORKSPACE_WILL_LOAD',
    payload: {
      workspaceId: workspace.id,
      browserWindowId: browserWindow.id
    }
  }
}

function workspaceDidLoad (workspace, electronApp, browserWindow) {
  return {
    type: 'ELECTRON_WORKSPACE_DID_LOAD',
    payload: {
      workspaceId: workspace.id,
      browserWindowId: browserWindow.id
    }
  }
}

function appIsReady (workspace, electronApp) {
  return {
    type: 'ELECTRON_WORKSPACE_READY',
    payload: {
      workspaceId: workspace.id
    }
  }
}

export function defaultWorkspace (application) {
  return {
    id: 'default',
    application
  }
}

function hide(obj, prop, value) {
	defineProperty(obj, prop, {
		enumerable: false,
		value
	})
}

const { defineProperty, keys, assign } = Object
