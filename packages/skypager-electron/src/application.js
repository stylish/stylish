import { hideProperties } from './util'
import { join, resolve } from 'path'
import { writeFileSync as write, createWriteStream as createStream } from 'fs'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'

import thunk from 'redux-thunk'

import defaults from 'lodash/object/defaultsDeep'
import pick from 'lodash/object/pick'

import * as Workspace from './workspace/workspace'

import { screen, app, BrowserWindow, ipcMain as ipc } from 'electron'

const { defineProperty, keys, assign } = Object

export class Application {
  constructor (project, options = {}) {
		let hide = this.hide = (...args) => hideProperties.call(this, this, ...args)

		if (!project || !project.settings) {
			throw('Please ensure your project has settings data. data/settings/workspaces.yml for example.')
		}

		let settings = project.settings

		options = defaults(options, {
			id: project.name,
			argv: { workspace: 'main' },
			command: '',
			env: 'development',
			settings,
			paths:{
				appData: join(app.getPath('userData'), 'data'),
				appLogs: project.path('logs','electron'),
				public: (project.paths.public) || join(process.env.PWD, 'public'),
				temp: app.getPath('temp'),
				project: project.root || process.env.PWD
			}
		})

		hide(options)

		setupAppHome(options.paths)

		console.log('Streaming Actions', this.paths.appLogs)
		this.paths.actionStream = join(this.paths.appLogs, `${ this.id }-action-stream.js`)

		hide({
			actionLogger: stream(
				this.paths.actionStream
			),
			store: setupStore()
		})

		if (!this.settings.workspaces) {
			defaults(this.settings, {
				workspaces:{
					main:{
						panels:{
							main:{
								path: 'index.html'
							}
						}
					}
				}
			})
		}
  }

	sendMessage(panel, message, payload) {
		let win = this.browserWindows[panel]

		if (win) {
			 win.webContents.send(message, payload)
		}
	}

	get primaryDisplay () {
		return screen.getPrimaryDisplay()
	}

	get screenSize () {
		return this.primaryDisplay.bounds
	}

	eachBrowserWindow (...args) {
		let windows = Object.values(this.browserWindows)
		windows.forEach(...args)
	}

	get browserWindows() {
		let workspace = this.workspace
		let windows = this.state.workspaces.windows.main

		return keys(windows).reduce((memo,panelName)=>{
			let w = windows[panelName]
			memo[panelName] = BrowserWindow.fromId(w.browserWindowId)
			return memo
		},{})
	}

	dispatch (action) {
		BrowserWindow.getAllWindows().forEach(win => {
			win.webContents.send('skypager:message', 'application:dispatch', action)
		})

		return this.store.dispatch(action)
	}

	boot () {
		this.store.subscribe(this.onStateChange.bind(this))

		this.workspace = this.createWorkspace(this.argv.workspace)

		if (this.workspace) {
			this.workspace.boot()
		}
	}

	createWorkspace(name = 'main', options = {}) {
		defaults(options, this.workspaceSettings[name], {
			id: name.toLowerCase()
		})

		return Workspace.provision(this, options)
	}

	logAction (action) {
		if (this.argv.debug) { console.log(JSON.stringify(action, null, 2)) }
		if (!this.argv.debug) { console.log(JSON.stringify(action, null, 2)) }

		this.actionLogger.write(
			`dispatch(${JSON.stringify(action)});\n\n`
		)
	}

	onStateChange() {
		this.snapshotState()
		global.SkypagerElectronAppState = JSON.stringify(this.state)

		BrowserWindow.getAllWindows().forEach(win => {
			win.webContents.send('skypager:message', 'state:change')
		})
	}

	snapshotState () {
		if (this.paths && this.paths.appData) {
			write(
				join(this.paths.appData, `${ this.id }-electron-state.json`),
				JSON.stringify(this.state, null, 2),
				'utf8'
			)
		}
	}

	get state () {
		return this.store.getState()
	}

	get workspacePanelNames () {
		return this.workspace && this.workspace.panelNames
	}

	get workspacePanels () {
		return this.workspace && this.workspace.panels
	}

	get workspaceSettings() {
		let workspaces = this.settings.workspaces || {}
		workspaces.main = workspaces.main || mainWorkspaceConfig(this)

		return workspaces
	}
}

export default Application

function hide(obj, prop, value) {
	defineProperty(obj, prop, {
		enumerable: false,
		value
	})
}


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

export function setupAppHome (paths) {
	require('mkdirp').sync(paths.appData)
	require('mkdirp').sync(paths.appLogs)
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

function stream(path) {
	let fd = require('fs').openSync(path, 'a+')
	return createStream(path, {fd})
}
