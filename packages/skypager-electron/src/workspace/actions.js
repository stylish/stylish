export const WORKSPACE_APP_READY = 'WORKSPACE_APP_READY'
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
  [ WORKSPACE_READY ]: (state, {payload}) => state
}, initialState)

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

export function workspaceReady (workspace, electronApp) {
  return {
    type: WORKSPACE_APP_READY,
    payload: {
      workspaceId: workspace.id
    }
  }
}

