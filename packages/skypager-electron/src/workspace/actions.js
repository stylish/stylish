import { handleActions as reducer, createAction as action } from 'redux-actions'

export const WORKSPACE_READY = 'WORKSPACE_READY'
export const WORKSPACE_DID_LOAD = 'WORKSPACE_DID_LOAD'
export const WORKSPACE_PROCESS_ERROR = 'WORKSPACE_PROCESS_ERROR'
export const WORKSPACE_PROCESS_STARTED = 'WORKSPACE_PROCESS_STARTED'
export const WORKSPACE_PROCESS_CLOSED = 'WORKSPACE_PROCESS_CLOSED'

export const initialState = {
  workspaces: {},
  processes: {},
  windows: {}
}

export const store = reducer({
  [ WORKSPACE_READY ]: workspaceStatus,
  [ WORKSPACE_DID_LOAD ]: workspaceStatus
}, initialState)

export const actions = {
  processClosed,
  processError,
  processStarted,
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

function workspaceStatus (state, {payload, meta}) {
    let { panelName, browserWindowId } = payload
    let { workspaceId, applicationId } = meta
    let workspaces = state.workspaces

    let nextState = assign({}, state, {
      workspaces: assign({}, workspaces, {
        [workspaceId]: 'ready'
      })
    })

    if( panelName && browserWindowId ) {
      nextState.windows = nextState.windows || {}
      nextState.windows[workspaceId] = nextState.windows[workspaceId] || {}
      nextState.windows[workspaceId][panelName] = browserWindowId
    }

    return nextState
}

