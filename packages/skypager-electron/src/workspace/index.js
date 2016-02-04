import electronify from 'electronify-server'
import { join, resolve } from 'path'
import pick from 'lodash/object/pick'

let workspaces = {}

export class Workspace {
  static provision (application, options) {
    let workspace = workspaces[options.id] || new Workspace(application, options)
    return workspace
  };

  constructor (application, options = {}) {
    hide(this, 'application', application)
    hide(this, 'windows', options.windows || {})
		hide(this, 'attributes', options)

    this.id = options.id || `workspace-${ keys(workspaces).length }`
  }

  dispatch (action = {}) {
    action.meta = assign({ workspaceId: this.id }, action.meta || {})
    return this.application.dispatch.call(this.application, action)
  }

	boot(options = {}) {
		this.launchPanels()
	}

	launchPanels () {
		let workspace = this

		this.panels.forEach(panel => {
			workspace.launchPanel(panel.id, panel)
		})
	}

	launchPanel(panelName, config) {
		launch(this, panelName, config)
	}

	get panels () {
		return this.panelKeys.map(panelId => {
			let panel = this.attributes.panels[panelId]
			panel.id = panel.id || panelId
			return panel
		})
	}

	get panelKeys() {
		return Object.keys(
			this.attributes.panels || {}
		)
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

function launch (w, panelName, params = {}) {
	let options = assign(params, {
		ready: function(electronApp) {
			w.dispatch(
				appIsReady(w, panelName, electronApp)
			)
		},

		preLoad: function(electronApp, win) {
			w.dispatch(
				workspaceWillLoad(w, panelName, electronApp, win)
			)
		},

		postLoad: function(electronApp, win) {
			w.dispatch(
				workspaceDidLoad(w, panelName, electronApp, win)
			)
		}
	})

	if (!options.command) {
		options.noServer = true
	}

	electronify(options)
	.on('child-started', (c)=> w.dispatch(workspaceProcessStarted(w, panelName, c)))
	.on('child-closed', (app, stderr, stdout)=> w.dispatch(workspaceProcessClosed(w, panelName)))
	.on('child-error', (err, app)=> w.dispatch(workspaceProcessError(w, panelName, err)))
}

function workspaceProcessClosed (workspace, panelName, child) {
	return {
		type: 'WORKSPACE_PROCESS_CLOSED',
		payload: {
			workspaceId: workspace.id,
			panelName
		}
	}
}

function workspaceProcessError (workspace, panelName, err ) {
	return {
		type: 'WORKSPACE_PROCESS_ERROR',
		payload: {
			workspaceId: workspace.id,
			err,
			panelName
		}
	}
}

function workspaceProcessStarted (workspace, panelName, child ) {
	return {
		type: 'WORKSPACE_PROCESS_STARTED',
		payload: {
			workspaceId: workspace.id,
			pid: child.pid,
			panelName
		}
	}
}

function workspaceWillLoad (workspace, panelName, electronApp, browserWindow) {
  return {
    type: 'WORKSPACE_WILL_LOAD',
    payload: {
      workspaceId: workspace.id,
      browserWindowId: browserWindow.id,
			panelName
    }
  }
}

function workspaceDidLoad (workspace, panelName, electronApp, browserWindow) {
  return {
    type: 'WORKSPACE_DID_LOAD',
    payload: {
      workspaceId: workspace.id,
      browserWindowId: browserWindow.id,
			panelName
    }
  }
}

function appIsReady (workspace, electronApp) {
  return {
    type: 'WORKSPACE_APP_READY',
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
