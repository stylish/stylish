import electronify from 'electronify-server'
import { join, resolve } from 'path'
import { handleActions as reducer, createAction as action } from 'redux-actions'
import { hideProperties } from '../util'
import { compact, pick, isNumber, isString } from 'lodash'
import { constrain } from '../util/constrain'

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

    return this.application.dispatch(action)
  }

	launchPanels () {
    let calls = buildElectronifyOptions(this)

    calls.forEach(params => {
      if (process.env.NODE_ENV !== 'test') {
        launch.call(this, params.id, params)
      }
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
    if (command && !panel.command && index === 0) {
      panel.command = command
    }

    if (!panel.command) {
      panel.noServer = true
    }

    if (!panel.url && panel.path ) {
      panel.url = `${ workspace.baseUrl || 'http://localhost:3000' }${ panel.path }`
    }

    panel.index = index
    panel.id = panel.id

    return pick(panel, 'index', 'id', 'url', 'noServer', 'command', 'window')
  })
}

function launch (panelName, params = {}) {
  let w = this

	let options = assign({}, params, {
		ready: function(electronApp) {
      w.dispatch(
        workspaceReady(w, {
          panelName
        })
      )
		},

		preLoad: function(electronApp, win) {
      let bounds = params.window = constrain(assign({}, params.window), w.application.screenSize)

      w.dispatch(
        workspaceReady(w, {
          browserWindowId: win.id,
          panelName
        })
      )

      win.show()

      win.setBounds({
        x: parseInt(bounds.left),
        y: parseInt(bounds.top),
        height: parseInt(bounds.height),
        width: parseInt(bounds.width)
      })

      if (params.window.centered) { win.center() }
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


  options.window = assign({}, options.window, {width: 200, height: 200})

	electronify(options)
	.on('child-started', (c)=> w.dispatch(processStarted(w, panelName, c)))
	.on('child-closed', (app, stderr, stdout)=> w.dispatch(processClosed(w, panelName)))
	.on('child-error', (err, app)=> w.dispatch(processError(w, panelName, err)))

  w.dispatch(workspaceDidLaunch(w, {
    electronify: {
      command: options.command,
      url: options.url,
      noServer: options.noServer,
      window: options.window
    }
  }))

}
