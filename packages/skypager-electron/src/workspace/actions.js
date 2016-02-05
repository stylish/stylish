import { handleActions as reducer, createAction as action } from 'redux-actions'

const { assign, keys } = Object

export const WORKSPACE_READY = 'WORKSPACE_READY'
export const WORKSPACE_DID_LOAD = 'WORKSPACE_DID_LOAD'
export const WORKSPACE_PROCESS_ERROR = 'WORKSPACE_PROCESS_ERROR'
export const WORKSPACE_PROCESS_STARTED = 'WORKSPACE_PROCESS_STARTED'
export const WORKSPACE_PROCESS_CLOSED = 'WORKSPACE_PROCESS_CLOSED'
export const WORKSPACE_DID_LAUNCH = 'WORKSPACE_DID_LAUNCH'

export const initialState = {
  workspaces: {},
  processes: {},
  windows: {}
}

export const store = reducer({
  [ WORKSPACE_READY ]: workspaceStatusReducer,
  [ WORKSPACE_DID_LOAD ]: workspaceStatusReducer,
  [ WORKSPACE_DID_LAUNCH ]: workspaceStatusReducer
}, initialState)

export const actions = {
  processClosed,
  processError,
  processStarted,
  workspaceDidLaunch,
  workspaceReady,
  panelLoaded
}

export function processClosed (workspace, panelName, child) {
	return {
    type: WORKSPACE_PROCESS_STARTED,
		payload: {
			workspaceId: workspace.id,
			panelName
		}
	}
}

export function processError (workspace, panelName, err ) {
  console.log('process error', err)
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
function workspaceStatusReducer (state, {payload, meta}) {
    let { panelName, browserWindowId } = payload
    let { workspaceId, applicationId } = meta
    let { workspaces, windows, processes } = state

    let nextState = assign({}, state, {
      workspaces: assign({}, workspaces, {
        [workspaceId]: 'ready'
      })
    })

    if( panelName && browserWindowId ) {
      nextState.windows[panelName] = {
        browserWindowId
      }
    }

    return nextState
}
