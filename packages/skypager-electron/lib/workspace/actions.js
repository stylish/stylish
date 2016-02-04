'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.processClosed = processClosed;
exports.processError = processError;
exports.processStarted = processStarted;
exports.panelLoaded = panelLoaded;
exports.workspaceReady = workspaceReady;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var WORKSPACE_APP_READY = exports.WORKSPACE_APP_READY = 'WORKSPACE_APP_READY';
var WORKSPACE_DID_LOAD = exports.WORKSPACE_DID_LOAD = 'WORKSPACE_DID_LOAD';
var WORKSPACE_PROCESS_ERROR = exports.WORKSPACE_PROCESS_ERROR = 'WORKSPACE_PROCESS_ERROR';
var WORKSPACE_PROCESS_STARTED = exports.WORKSPACE_PROCESS_STARTED = 'WORKSPACE_PROCESS_STARTED';
var WORKSPACE_PROCESS_CLOSED = exports.WORKSPACE_PROCESS_CLOSED = 'WORKSPACE_PROCESS_CLOSED';

var initialState = exports.initialState = {
	workspaces: {},
	processes: {},
	windows: {}
};

var store = exports.store = reducer(_defineProperty({}, WORKSPACE_READY, function (state, _ref) {
	var payload = _ref.payload;
	return state;
}), initialState);

function processClosed(workspace, panelName, child) {
	return {
		type: WORKSPACE_PROCESS_STARTED,
		payload: {
			workspaceId: workspace.id,
			panelName: panelName
		}
	};
}

function processError(workspace, panelName, err) {
	return {
		type: WORKSPACE_PROCESS_ERROR,
		payload: {
			workspaceId: workspace.id,
			err: err,
			panelName: panelName
		}
	};
}

function processStarted(workspace, panelName, child) {
	return {
		type: WORKSPACE_PROCESS_STARTED,
		payload: {
			workspaceId: workspace.id,
			pid: child.pid,
			panelName: panelName
		}
	};
}

function panelLoaded(workspace, panelName, electronApp, browserWindow) {
	return {
		type: WORKSPACE_DID_LOAD,
		payload: {
			workspaceId: workspace.id,
			browserWindowId: browserWindow.id,
			panelName: panelName
		}
	};
}

function workspaceReady(workspace, electronApp) {
	return {
		type: WORKSPACE_APP_READY,
		payload: {
			workspaceId: workspace.id
		}
	};
}