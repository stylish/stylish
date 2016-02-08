import { join, resolve } from 'path'
import { handleActions as reducer, createAction as action } from 'redux-actions'
import { hideProperties } from '../util'
import { compact, pick, isNumber, isString } from 'lodash'
import { constrain } from '../util/constrain'
import chokidar from 'chokidar'
import electronify from './electronify-server'

const defaultPanels = {
  browser: {
    path: 'index.html',
    layout: 'centered'
  }
}

const DEFAULT_WINDOW = {
  height: 768,
  width: 1024,
  centered: true
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

  get commandCount () {
    return compact(this.panels.map(p => p.command)).length
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
    this.panels.forEach(panel => {
      if (process.env.NODE_ENV !== 'test') {
        launch.call(this, panel.id, assign(panel.opts, {window: (panel.window || DEFAULT_WINDOW)}))
      }
    })
	}

}

export function provision (application, options) {
  return new Workspace(application, options)
};

function buildElectronifyOptions (workspace) {
  let command = workspace.command

  return workspace.panels.map((panel, index) => {
    let opts = {}

    if (command && !panel.command && index === 0) {
      panel.command = opts.command = command
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
      let constrained = constrain(assign({}, params.window), w.application.screenSize)

      w.panelSettings[panelName].constrained = constrained

      console.log('constrainig', constrained, params.window)
      w.dispatch(
        workspaceReady(w, {
          panelName,
          constrained
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
      if (w.panelSettings[panelName].constrained) {
        win.setBounds({
          ...(w.panelSettings[panelName].constrained)
        })
      }

			w.dispatch(
				panelLoaded(w, panelName, electronApp, win)
			)
		}
	})

	if (!options.command) {
    options.noServer = true
	}

  w.dispatch(workspaceDidLaunch(w, {
    panelName,
    electronify: {
      command: options.command,
      url: options.url,
      noServer: options.noServer,
      window: options.window
    }
  }))

  if (options.command && options.command.match(/skypager dev/)) {
    let watcher = chokidar.watch(process.env.PWD, {
      persistent: true,
      depth: 1
    })

    watcher.on('raw', (action, path) => {
      if (path && path.match(/webpack-stats/)){
        w.dispatch({
          type: 'WEBPACK_DEV_SERVER_READY',
          payload: {
            panelName,
            workspaceId: w.id
          }
        })

        w.application.eachBrowserWindow((browserWindow) => {
           browserWindow.show()
           browserWindow.reload()
        })
      }
    })

    process.on('exit', (code) => {
      if(!watcher && watcher.closed) {
        watcher.close()
      }
    })
  }

  let proc = electronify(options)

  proc.on('child-started', (child) => {
    w.dispatch(processStarted(w, panelName, child))
  }).on('child-closed', (app, stderr, stdout) => {
    w.dispatch(processClosed(w, panelName))
  }).on('child-error', (err) => {
     w.dispatch(processError(w, panelName, err))
  })
}
