import { join, resolve } from 'path'
import { handleActions as reducer, createAction as action } from 'redux-actions'
import { hideProperties } from '../util'
import { isEmpty, values, get, set, mapValues, defaults, compact, pick, isNumber, isString } from 'lodash'
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
      baseUrl: options.baseUrl || attributes.baseUrl || `file://${application.paths.public}`,
      env: options.env || application.env || 'development'
    })

    this.command = attributes.command

    this.panelSettings = mapValues(this.attributes.panels || defaultPanels, (panel, id) => {
      panel.id = id
      panel.window = panel.window || DEFAULT_WINDOW

      return panel
    })

    this.stages = this.attributes.stages || {}
    this.currentStage = this.attributes.initialStage
  }

	boot(stage = this.currentStage) {
    buildElectronifyOptions(this)

    let panels

    if (!isEmpty(this.stages) && stage) {
      panels = this.stages[stage]
    }

    if(!stage) {
       panels = this.panelNames
    }

    this.currentStage = stage

    return this.launchPanels(panels)
	}

	launchPanels(panels = this.panelNames) {
    panels.forEach(panelId => this.launch(panelId))
	}

  get id () {
    return this.attributes.id
  }

  get commandCount () {
    return compact(this.panels.map(p => p.command)).length
  }

  get panels () {
    return values(this.panelSettings)
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

  launch(panelId) {
    if (!this.panelSettings[panelId]) {
      throw('error launching panel; No such panel: ' + panelId)
    }

    return launch.call(this, panelId, this.panelSettings[panelId])
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
      let opts = w.panelSettings[panelName]
      let constrained = opts.constrained

      win.show()

      if (constrained) {
        try {
          win.show()

          if (opts.window && opts.window.centered) {
            win.setSize(constrained.width, constrained.height)
          } else {
            win.setBounds({
              ...constrained
            })
          }

        } catch (error) {
          console.log('')
          console.log('Error setting window bounds', constrained)
          console.log(error.message.red)
        }
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

  options.window.preload = require.resolve('../client-bootstrap.js')

  options.url = options.url || w.panelSettings[panelName].url || ''

  if (options.window.center || options.window.centered) {
    delete(options.x)
    delete(options.y)
  }

  let proc = electronify(options)

  proc.on('child-started', (child) => {
    w.dispatch(
			processStarted(w, panelName, child)
		)

  }).on('child-closed', (app, stderr, stdout) => {
    w.dispatch(processClosed(w, panelName))
  }).on('child-error', (err) => {
     w.dispatch(processError(w, panelName, err))
  })
}
