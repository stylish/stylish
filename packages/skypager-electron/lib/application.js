'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Application = undefined;
exports.setupStore = setupStore;
exports.loggerMiddleware = loggerMiddleware;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _yargs = require('yargs');

var _path = require('path');

var _fs = require('fs');

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _workspace = require('./workspace');

var Workspace = _interopRequireWildcard(_workspace);

var _electron = require('electron');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Application = exports.Application = (function () {
	function Application(project) {
		var _this = this;

		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, Application);

		var hide = this.hide = function () {
			var _hideProperties;

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return (_hideProperties = hideProperties).call.apply(_hideProperties, [_this].concat(args));
		};

		hide({ project: project, env: options.env || 'development' });

		hide({ store: setupStore() });
	}

	_createClass(Application, [{
		key: 'boot',
		value: function boot() {
			this.store.subscribe(this.onStateChange.bind(this));

			this.mainWorkspace.boot();
		}
	}, {
		key: 'dispatch',
		value: function dispatch(action) {
			this.logAction(action);
			return this.store.dispatch(action);
		}
	}, {
		key: 'logAction',
		value: function logAction(action) {
			this.actionLogger.write('dispatch(' + JSON.stringify(action) + ');\n\n');
		}
	}, {
		key: 'onStateChange',
		value: function onStateChange() {}
	}, {
		key: 'snapshotState',
		value: function snapshotState() {
			(0, _fs.writeFileSync)(this.project.path('data_sources', 'electron-state.json'), JSON.stringify(this.state, null, 2), 'utf8');
		}
	}, {
		key: 'dataPath',
		get: function get() {
			return _electron.app.getPath('userData');
		}
	}, {
		key: 'tempPath',
		get: function get() {
			return _electron.app.getPath('temp');
		}
	}, {
		key: 'actionLogsPath',
		get: function get() {
			return (0, _path.join)(this.dataPath, 'electron', 'app-actions.log');
		}
	}, {
		key: 'state',
		get: function get() {
			return this.store.getState();
		}
	}, {
		key: 'projectSettings',
		get: function get() {
			return this.project.data.at('settings').data;
		}
	}, {
		key: 'workspaces',
		get: function get() {
			return this.projectSettings.workspaces || {};
		}
	}, {
		key: 'mainWorkspace',
		get: function get() {
			var project = this.project;
			var config = this.workspaces.main;

			if (config) {
				return config;
			}

			return {
				id: 'main',
				panels: {
					browser: {
						url: project.path('public', 'index.html')
					}
				}
			};
		}
	}]);

	return Application;
})();

function hide(obj, prop, value) {
	defineProperty(obj, prop, {
		enumerable: false,
		value: value
	});
}

var _Object = Object;
var defineProperty = _Object.defineProperty;
var keys = _Object.keys;
var assign = _Object.assign;
function setupStore() {
	var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var reducers = {
		workspaces: Workspace.store
	};

	var rootReducer = (0, _redux.combineReducers)(reducers);

	var initialState = assign({
		workspaces: workspaceState
	}, options.sate || {});

	var middlewares = (0, _redux.applyMiddleware)(_reduxThunk2.default, loggerMiddleware.bind(this));

	var buildStore = (0, _redux.compose)(middlewares)(_redux.createStore);

	return buildStore(rootReducer, pick(initialState, keys(reducers)));
}

function notice(msg) {
	console.log(msg.green);
}

function warn(msg) {
	console.log(msg.yellow);
}

function loggerMiddleware(_ref) {
	var getState = _ref.getState;

	return function (next) {
		return function (action) {
			var prevState = getState();
			var returnValue = next(action);
			var nextState = getState();
			var actionType = String(action.type);
			var message = 'action ' + actionType;

			return returnValue;
		};
	};
}