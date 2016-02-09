import { handleActions as reducer, createAction as action } from 'redux-actions'

const { assign, keys } = Object

export const WORKSPACE_READY = 'WORKSPACE_READY'
export const WORKSPACE_DID_LOAD = 'WORKSPACE_DID_LOAD'
export const WORKSPACE_DID_LAUNCH = 'WORKSPACE_DID_LAUNCH'
export const WORKSPACE_PROCESS_ERROR = 'WORKSPACE_PROCESS_ERROR'
export const WORKSPACE_PROCESS_STARTED = 'WORKSPACE_PROCESS_STARTED'
export const WORKSPACE_PROCESS_CLOSED = 'WORKSPACE_PROCESS_CLOSED'

export const initialState = {
  workspaces: {},
  processes: {},
  windows: {}
}

export const store = reducer({
  [ WORKSPACE_READY ]: workspaceReducer,
  [ WORKSPACE_DID_LOAD ]: workspaceReducer,
  [ WORKSPACE_DID_LAUNCH ]: workspaceReducer,
  [ WORKSPACE_PROCESS_STARTED ]: processReducer,
  [ WORKSPACE_PROCESS_ERROR ]: processReducer,
  [ WORKSPACE_PROCESS_CLOSED ]: processReducer
}, initialState)

export const actions = {
  processClosed,
  processError,
  processStarted,
  workspaceDidLaunch,
  workspaceReady,
  panelLoaded
}

export function workspaceReducer (state, {payload, meta}) {
    let { panelName, browserWindowId } = payload
    let { workspaceId, applicationId } = meta
    let { workspaces, windows, processes } = state

    let nextState = assign({}, state, {
      workspaces: assign({}, workspaces, {
        [workspaceId]: 'ready'
      })
    })

    if( panelName && browserWindowId ) {
      nextState.windows[workspaceId] = assign(nextState.windows[workspaceId] || {}, {
        [panelName]: {
          browserWindowId
        }
      })
    }

    return nextState
}

export function processReducer (state, {payload, meta}) {
  return state
}

export function processClosed (workspace, panelName) {
	return {
    type: WORKSPACE_PROCESS_STARTED,
		payload: {
			workspaceId: workspace.id,
			panelName
		}
	}
}

export function processError (workspace, panelName, err ) {
	return {
		type: WORKSPACE_PROCESS_ERROR,
		payload: {
			workspaceId: workspace.id,
			err,
			panelName
		}
	}
}

export function processStarted (workspace, panelName, child ) {
	return {
		type: WORKSPACE_PROCESS_STARTED,
		payload: {
			workspaceId: workspace.id,
			pid: child.pid,
			panelName
		}
	}
}

export function panelLoaded (workspace, panelName, electronApp, browserWindow) {
  return {
    type: WORKSPACE_DID_LOAD,
    payload: {
      workspaceId: workspace.id,
      browserWindowId: browserWindow.id,
			panelName
    }
  }
}

export function workspaceReady (workspace, payload) {
  return {
    type: WORKSPACE_READY,
    payload: assign(payload, {
      workspaceId: workspace.id
    })
  }
}

export function workspaceDidLaunch (workspace, payload) {
  let { options } = payload

  return {
    type: WORKSPACE_DID_LAUNCH,
    payload: {
      workspaceId: workspace.id,
      electronify: payload.electronify
    }
  }
}


