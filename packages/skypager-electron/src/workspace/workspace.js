import electronify from 'electronify-server'
import { join, resolve } from 'path'
import { handleActions as reducer, createAction as action } from 'redux-actions'
import { hideProperties } from '../util'
import { compact, pick, isNumber, isString } from 'lodash'
import { constrain } from '../util/constrain'
import chokidar from 'chokidar'

const defaultPanels = {
  browser: {
    path: 'index.html',
    layout: 'centered'
  }
}

const { keys, assign } = Object

import { actions as _actions, initialState as _initialState, store as _store } from './actions'

export const store = _store
export const initialState = _initialState
export const actions = _actions

const { workspaceDidLaunch, workspaceReady, panelLoaded, processClosed, processError, processStarted } = _actions

export class Workspace {
  constructor (application, attributes = {}, options = {}) {

    hideProperties(this, {
      application,
      attributes,
      publicPath: application.paths.public,
      baseUrl: options.baseUrl || attributes.baseUrl || (application.settings && application.settings.baseUrl),
      env: options.env || application.env || 'development'
    })

    this.command = attributes.command
    this.panelSettings = this.attributes.panels || defaultPanels
  }

	boot(options = {}) {
    buildElectronifyOptions(this)
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
    action.meta = assign({
      applicationId: this.application.id,
      workspaceId: this.id
    }, action.meta || {})

    console.log('Workspace Dispatch', action.type, action.payload)

    return this.application.dispatch(action)
  }

	launchPanels () {
    this.panels.forEach(panel => {
      launch.call(this, panel.id, panel.opts)
    })
	}

}

export function provision (application, options) {
  return new Workspace(application, options)
};

function buildElectronifyOptions (workspace) {
  let panelCommands = compact(workspace.panels.map(panel => panel.command))

  let command = workspace.command

  return workspace.panels.map((panel, index) => {
    let opts = {}

    if (command && !panel.command && index === 0) {
      opts.command = command
    }

    if (!panel.command) {
      opts.noServer = true
    }

    if (!panel.url && panel.path ) {
      opts.url = `${ workspace.baseUrl || 'http://localhost:3000' }${ panel.path }`
    }

    panel.opts = opts

    return opts
  })
}

function launch (panelName, params = {}) {
  let w = this

	let options = assign({}, params, {
		ready: function(electronApp) {
      let bounds = constrain(assign({}, params.window), w.application.screenSize)

      w.dispatch(
        workspaceReady(w, {
          panelName,
          bounds
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

  options.window = assign({}, options.window, {width: 200, height: 200, show: false})

	if (!options.command) {
    options.noServer = true
	}

  w.dispatch(workspaceDidLaunch(w, {
    electronify: {
      command: options.command,
      url: options.url,
      noServer: options.noServer,
      window: options.window
    }
  }))

}
