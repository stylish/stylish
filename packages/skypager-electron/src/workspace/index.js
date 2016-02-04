import electronify from 'electronify-server'
import { join, resolve } from 'path'
import { handleActions as reducer, createAction as action } from 'redux-actions'
import { hideProperties } from '../util'

const defaultPanels = {
  browser: {
    path: 'index.html',
    layout: 'centered'
  }
}

import { actions as _actions, initialState as _initialState, store as _store } from './actions'

export const store = _store
export const initialState = _initialState
export const actions = _actions

const { workspaceReady, panelLoaded, processClosed, processError, processStarted } = _actions

export class Workspace {
  constructor (application, attributes = {}, options = {}) {

    hideProperties(this, {
      application,
      attributes,
      env: options.env || 'development'
    })

    this.panelSettings = this.attributes.panels || defaultPanels
  }

	boot(options = {}) {
		this.launchPanels()
	}

  get id () {
    return this.attributes.id
  }

  get panels () {
    return this.panelNames.map(panelName => {
      let panel = this.panelSettings[panelName]
      panel.id = panel.id || panelName
      return panel
    })
  }

  get panelNames () {
    return Object.keys(this.panelSettings)
  }

  dispatch (action = {}) {
    action.meta = assign({ applicationId: this.application.id, workspaceId: this.id }, action.meta || {})
    return this.application.dispatch(action)
  }

	launchPanels () {
		let workspace = this

    workspace.panels.forEach(panel => {
      this.launchPanel(panel.id, panel)
    })
	}

	launchPanel(panelName, config) {
    if (!config.url && config.path) {
       config.url = `file://${ this.application.project.path('public', config.path) }`
    }

		launch(this, panelName, config)
	}
}

export function provision (application, options) {
  return new Workspace(application, options)
};

function launch (w, panelName, params = {}) {
	let options = assign(params, {
		ready: function(electronApp) {
      w.dispatch(
        workspaceReady(w, {
          panelName
        })
      )
		},

		preLoad: function(electronApp, win) {
      w.dispatch(
        workspaceReady(w, {
          browserWindowId: win.id,
          panelName
        })
      )
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
	.on('child-started', (c)=> w.dispatch(processStarted(w, panelName, c)))
	.on('child-closed', (app, stderr, stdout)=> w.dispatch(processClosed(w, panelName)))
	.on('child-error', (err, app)=> w.dispatch(processError(w, panelName, err)))
}
