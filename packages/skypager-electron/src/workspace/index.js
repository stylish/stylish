import electronify from 'electronify-server'
import { join, resolve } from 'path'
import pick from 'lodash/object/pick'
import { handleActions as reducer, createAction as action } from 'redux-actions'

const defaultPanels = {
  main: {
    path: 'index.html',
    layout: 'centered'
  }
}

export class Workspace {
  static provision (application, options) {
    return new Workspace(application, options)
  };

  constructor (application, attributes = {}, options = {}) {
    this.panels = assign({}, defaultPanels, attributes.panels || {})
  }

  get id () {
    return this.attributes.id
  }

  dispatch (action = {}) {
    action.meta = assign({ applicationId: this.application.id, workspaceId: this.id }, action.meta || {})
    return this.application.dispatch(action)
  }

	boot(options = {}) {
		this.launchPanels()
	}

	launchPanels () {
		let workspace = this

	  workspace.launchPanel(panel.id, panel)
	}

	launchPanel(panelName, config) {
		launch(this, panelName, config)
	}
}

function launch (w, panelName, params = {}) {
	let options = assign(params, {
		ready: function(electronApp) {
      w.dispatch(
        workspaceReady(w)
      )
		},

		preLoad: function(electronApp, win) {
      w.registerBrowserWindow(panelName, win)
		},

		postLoad: function(electronApp, win) {
			w.dispatch(
				panelLoaded(w, panelName, electronApp, win)
			)
		}
	})

	if (!options.command) {
		options.noServer = true
	}

	electronify(options)
	.on('child-started', (c)=> w.dispatch(procesStarted(w, panelName, c)))
	.on('child-closed', (app, stderr, stdout)=> w.dispatch(processClosed(w, panelName)))
	.on('child-error', (err, app)=> w.dispatch(processError(w, panelName, err)))
}

export function defaultWorkspace (application) {
  return {
    id: 'default',
    application
  }
}

const { defineProperty, keys, assign, values } = Object
