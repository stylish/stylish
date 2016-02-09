'use strict';

var _reducer;

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.actions = exports.store = exports.initialState = exports.WORKSPACE_PROCESS_CLOSED = exports.WORKSPACE_PROCESS_STARTED = exports.WORKSPACE_PROCESS_ERROR = exports.WORKSPACE_DID_LAUNCH = exports.WORKSPACE_DID_LOAD = exports.WORKSPACE_READY = undefined;
exports.workspaceReducer = workspaceReducer;
exports.processReducer = processReducer;
exports.processClosed = processClosed;
exports.processError = processError;
exports.processStarted = processStarted;
exports.panelLoaded = panelLoaded;
exports.workspaceReady = workspaceReady;
exports.workspaceDidLaunch = workspaceDidLaunch;

var _reduxActions = require('redux-actions');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _Object = Object;
var assign = _Object.assign;
var keys = _Object.keys;
var WORKSPACE_READY = exports.WORKSPACE_READY = 'WORKSPACE_READY';
var WORKSPACE_DID_LOAD = exports.WORKSPACE_DID_LOAD = 'WORKSPACE_DID_LOAD';
var WORKSPACE_DID_LAUNCH = exports.WORKSPACE_DID_LAUNCH = 'WORKSPACE_DID_LAUNCH';
var WORKSPACE_PROCESS_ERROR = exports.WORKSPACE_PROCESS_ERROR = 'WORKSPACE_PROCESS_ERROR';
var WORKSPACE_PROCESS_STARTED = exports.WORKSPACE_PROCESS_STARTED = 'WORKSPACE_PROCESS_STARTED';
var WORKSPACE_PROCESS_CLOSED = exports.WORKSPACE_PROCESS_CLOSED = 'WORKSPACE_PROCESS_CLOSED';

var initialState = exports.initialState = {
  workspaces: {},
  processes: {},
  windows: {}
};

var store = exports.store = (0, _reduxActions.handleActions)((_reducer = {}, _defineProperty(_reducer, WORKSPACE_READY, workspaceReducer), _defineProperty(_reducer, WORKSPACE_DID_LOAD, workspaceReducer), _defineProperty(_reducer, WORKSPACE_DID_LAUNCH, workspaceReducer), _defineProperty(_reducer, WORKSPACE_PROCESS_STARTED, processReducer), _defineProperty(_reducer, WORKSPACE_PROCESS_ERROR, processReducer), _defineProperty(_reducer, WORKSPACE_PROCESS_CLOSED, processReducer), _reducer), initialState);

var actions = exports.actions = {
  processClosed: processClosed,
  processError: processError,
  processStarted: processStarted,
  workspaceDidLaunch: workspaceDidLaunch,
  workspaceReady: workspaceReady,
  panelLoaded: panelLoaded
};

function workspaceReducer(state, _ref) {
  var payload = _ref.payload;
  var meta = _ref.meta;
  var panelName = payload.panelName;
  var browserWindowId = payload.browserWindowId;
  var workspaceId = meta.workspaceId;
  var applicationId = meta.applicationId;
  var workspaces = state.workspaces;
  var windows = state.windows;
  var processes = state.processes;

  var nextState = assign({}, state, {
    workspaces: assign({}, workspaces, _defineProperty({}, workspaceId, 'ready'))
  });

  if (panelName && browserWindowId) {
    nextState.windows[workspaceId] = assign(nextState.windows[workspaceId] || {}, _defineProperty({}, panelName, {
      browserWindowId: browserWindowId
    }));
  }

  return nextState;
}

function processReducer(state, _ref2) {
  var payload = _ref2.payload;
  var meta = _ref2.meta;

  return state;
}

function processClosed(workspace, panelName) {
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

function workspaceReady(workspace, payload) {
  return {
    type: WORKSPACE_READY,
    payload: assign(payload, {
      workspaceId: workspace.id
    })
  };
}

function workspaceDidLaunch(workspace, payload) {
  var options = payload.options;

  return {
    type: WORKSPACE_DID_LAUNCH,
    payload: {
      workspaceId: workspace.id,
      electronify: payload.electronify
    }
  };
}