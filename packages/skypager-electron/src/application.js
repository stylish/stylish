import { hideProperties } from './util'
import { join, resolve } from 'path'
import { writeFileSync as write, createWriteStream as createStream } from 'fs'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import * as Workspace from './workspace'

import { screen, app, BrowserWindow, ipcMain as ipc } from 'electron'

export class Application {
  constructor (project, options = {}) {
		let hide = this.hide = (...args) => hideProperties.call(this, this, ...args)

		this.id = project.name

		hide({
			project,
			env: options.env || 'development',
			argv: options.argv,
			command: options.command,
			paths: {
				appData: join(app.getPath('userData'), 'data'),
				tmp: app.getPath('temp'),
				appLogs: join(app.getPath('userData'), 'logs')
			}
		})

		setupAppHome(this)

		hide({
			actionLogger: createStream(
				join(this.paths.appLogs, `${ project.name }-action-log.js`)
			),
			store: setupStore()
		})
  }

	sendMessage(panel, message, payload) {
		let win = this.browserWindows[panel]

		if (win) {
			 win.webContents.send(message, payload)
		}
	}

	get browserWindows() {
		let workspace = this.workspace
		let windows = this.state.workspaces.windows[workspace.id]

		return keys(windows).reduce((memo,panelName)=>{
			memo[panelName] = BrowserWindow.fromId(windows[panelName])
			return memo
		},{})
	}

	dispatch (action) {
		this.logAction(action)
		return this.store.dispatch(action)
	}

	boot () {
		this.store.subscribe(
			this.onStateChange.bind(this)
		)

		this.workspace = this.createWorkspace(this.argv.workspace || 'main')

		if (this.workspace) {
			 this.workspace.boot()
		}
	}

	createWorkspace(name, options = {}) {
		let cfg = assign({}, this.workspaceSettings[name], options)
		cfg.id = cfg.id || `${ name }`.toLowerCase()

		return Workspace.provision(this, cfg)
	}

	logAction (action) {
		if (this.argv.debug) {
			console.log(JSON.stringify(action, null, 2))
		}

		this.actionLogger.write(
			`dispatch(${JSON.stringify(action)});\n\n`
		)
	}

	onStateChange() {
		this.snapshotState()
	}

	snapshotState () {
		write(
			join(this.paths.appData, `${ this.project.name }-electron-state.json`),
			JSON.stringify(this.state, null, 2),
			'utf8'
		)
	}

	get state () {
		return this.store.getState()
	}

	get projectSettings() {
		return this.project.data.at('settings').data
	}

	get workspaceSettings() {
		let { workspaces } = this.projectSettings

		workspaces.main = workspaces.main || mainWorkspaceConfig(this)

		return workspaces
	}

}

function hide(obj, prop, value) {
	defineProperty(obj, prop, {
		enumerable: false,
		value
	})
}

const { defineProperty, keys, assign } = Object

export function setupStore (options = {}) {
	let reducers = {
		workspaces: Workspace.store
	}

	let rootReducer = combineReducers(reducers)

	let initialState = assign({
		workspaces: Workspace.initialState
	}, options.state || {})

	let middlewares = applyMiddleware(
		thunk,
		loggerMiddleware.bind(this)
	)

	const buildStore = compose(middlewares)(createStore)

	return buildStore(
		rootReducer,
		pick(initialState, keys(reducers))
	)
}

function notice (msg) {
	console.log(msg.green)
}

function warn (msg) {
	console.log(msg.yellow)
}

export function loggerMiddleware({ getState }) {
  return (next) =>
    (action) => {
      const prevState = getState();
      const returnValue = next(action);
      const nextState = getState();
      const actionType = String(action.type);
      const message = `action ${actionType}`;

      return returnValue;
    };
}

export function setupAppHome (app) {
	require('mkdirp').sync(app.paths.appData)
	require('mkdirp').sync(app.paths.appLogs)
}

function mainWorkspaceConfig (project) {
	let config = project.workspaces.main

	if (config) {
		return config
	}

	return {
		id: 'main',
		panels: {
			browser:{
				url: project.path('public', 'index.html')
			}
		}
	}
}

