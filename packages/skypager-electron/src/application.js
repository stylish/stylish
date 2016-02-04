import colors from 'colors'

import { argv } from 'yargs'
import { join, resolve } from 'path'
import { writeFileSync as write, createWriteStream as createStream } from 'fs'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import * as Workspace from './workspace'

import { screen, app } from 'electron'

export class Application {
  constructor (project, options = {}) {
		let hide = this.hide = (...args) => hideProperties.call(this, ...args)

		hide({ project, env: options.env || 'development' })

		hide({ store: setupStore() })
  }

	get dataPath () {
		return app.getPath('userData')
	}

	get tempPath () {
		 return app.getPath('temp')
	}

	get actionLogsPath () {
		 return join(this.dataPath, 'electron', 'app-actions.log')
	}

	boot () {
		this.store.subscribe(
			this.onStateChange.bind(this)
		)

		this.mainWorkspace.boot()
	}

	dispatch (action) {
		this.logAction(action)
		return this.store.dispatch(action)
	}

	logAction (action) {
		this.actionLogger.write(
			`dispatch(${JSON.stringify(action)});\n\n`
		)
	}

	onStateChange() {

	}

	snapshotState () {
		write(
			this.project.path('data_sources', 'electron-state.json'),
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

	get workspaces() {
		return this.projectSettings.workspaces || {}
	}

	get mainWorkspace () {
		let project = this.project
		let config = this.workspaces.main

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
		workspaces: workspaceState
	}, options.sate || {})

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
