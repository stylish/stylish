import colors from 'colors'

import { argv } from 'yargs'
import { join, resolve } from 'path'
import { writeFileSync as write, createWriteStream as createStream } from 'fs'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import Workspace, {reducer as workspaceReducer, initialState as workspaceState} from './workspace'

import { screen, app } from 'electron'

export class Application {
  constructor (project, options = {}) {
		let hide = this.hide = hideProperties.bind(this)

		hide(this, 'project', project)
		hide(this, 'env', options.env || 'development')

		hide(this, 'store', setupStore({
			state: {
				project: {
					paths: project.paths
				},
				process: {
					env: this.env,
					pwd: process.env.PWD,
					options
				}
			}
		}))

		write(actionLogs, '', 'utf8')

		hide(this, 'actionLogger', createStream(actionLogs))
  }

	get dataPath () {
		return app.getPath('userData')
	}

	get tempPath () {
		 return app.getPath('temp')
	}

	boot () {
		this.store.subscribe(
			this.onStateChange.bind(this)
		)

		this.dispatch({
			type: 'APPLICATION_BOOT',
			payload: {
				process: {
					pid: process.pid,
					pwd: process.env.pwd,
					argv
				}
			}
		})
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
		let config = this.workspaces.main || {
			id: 'default'
		}

		config.id = config.id || 'main'
		return Workspace.provision(this, config)
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
	let reducers = assign({
		workspaces: workspaceReducer
	}, options.reducers || {})

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
