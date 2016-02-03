import colors from 'colors'
import { join, resolve } from 'path'

import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import Workspace, {reducer as workspaceReducer, initialState as workspaceState} from './workspace'

export class Application {
  constructor (project, options = {}) {
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
  }

	boot () {
		this.store.subscribe(this.onStateChange)
		this.mainWorkspace.launch()
	}

	dispatch (...args) {
		return this.store.dispatch(...args)
	}

	onStateChange() {
		console.log('yo')
	}

	get state () {
		return this.store.getState()
	}

	get projectSettings() {
		return this.project.data.at.settings || {}
	}

	get workspaces() {
		return this.projectSettings.workspaces || {}
	}

	get mainWorkspace () {
		let project = this.project
		let config = this.workspaces.main || {
			id: 'default',
			electronify:{
				noServer: true,
				url: `file://${project.path('public','index.html')}`
			}
		}

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

	const buildStore = compose(
		 applyMiddleware(thunk, createLogger)
	)(createStore)

	return buildStore(rootReducer, initialState)
}

function notice (msg) {
	console.log(msg.green)
}

function warn (msg) {
	console.log(msg.yellow)
}

export default function createLogger({ getState }) {
  return (next) =>
    (action) => {
      const prevState = getState();
      const returnValue = next(action);
      const nextState = getState();
      const actionType = String(action.type);
      const message = `action ${actionType}`;
			console.log(message)
			console.log(nextState)
      return returnValue;
    };
}
