'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.stores = stores;

var _lodash = require('lodash');

var _redux = require('redux');

var _reduxSimpleRouter = require('redux-simple-router');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = stores;
function stores() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var initialState = options.initialState;
  var reducers = options.reducers;
  var history = options.history;
  var middlewares = options.middlewares;
  var project = options.project;

  (0, _invariant2.default)(isArray(reducers), 'Pass an array of reducers');
  (0, _invariant2.default)(isArray(initialState) && reducers.length === initialState.length, 'Pass an array of initial state objects for each reducer');

  var router = { router: _reduxSimpleRouter.routeReducer };
  var defaultMiddlewares = [_reduxThunk2.default, (0, _reduxSimpleRouter.syncHistory)(history)];

  var appReducers = reducers.length > 0 ? assign.apply(undefined, [router].concat((0, _toConsumableArray3.default)(reducers))) : router;

  var appState = initialState.length > 0 ? assign.apply(undefined, [{}].concat((0, _toConsumableArray3.default)(initialState))) : {};

  var appMiddlewares = middlewares && middlewares.length > 0 ? defaultMiddlewares.concat(middlewares) : defaultMiddlewares;

  if (project) {
    appState.assets = project.assets;
    appState.content = project.content;
    appState.entities = project.entities;
    appState.models = project.models;
    appState.project = project.project;
    appState.settings = project.settings;
  }

  return (0, _redux.compose)(_redux.applyMiddleware.apply(undefined, (0, _toConsumableArray3.default)(appMiddlewares)), window.devToolsExtension ? window.devToolsExtension() : function (f) {
    return f;
  })(_redux.createStore)((0, _redux.combineReducers)(appReducers), (0, _lodash.pick)(appState, keys(appReducers)));
}

function isArray(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
}

var _Object = Object;
var assign = _Object.assign;
var keys = _Object.keys;