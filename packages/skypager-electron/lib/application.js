'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Application = undefined;
exports.setupStore = setupStore;
exports.loggerMiddleware = loggerMiddleware;
exports.setupAppHome = setupAppHome;

var _util = require('./util');

var _path = require('path');

var _fs = require('fs');

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _defaultsDeep = require('lodash/object/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireDefault(_pick);

var _workspace = require('./workspace/workspace');

var Workspace = _interopRequireWildcard(_workspace);

var _electron = require('electron');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Object = Object;
var defineProperty = _Object.defineProperty;
var keys = _Object.keys;
var assign = _Object.assign;

var Application = exports.Application = (function () {
	function Application(project) {
		var _this = this;

		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, Application);

		var hide = this.hide = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return _util.hideProperties.call.apply(_util.hideProperties, [_this, _this].concat(args));
		};

		if (!project || !project.data || !project.data.at('settings')) {
			throw 'Please ensure your project has settings data. data/settings/workspaces.yml for example.';
		}

		var settings = project.data.at('settings').data;

		options = (0, _defaultsDeep2.default)(options, {
			id: project.name,
			argv: { workspace: 'main' },
			command: '',
			env: 'development',
			settings: settings || { workspaces: {} },
			paths: {
				appData: (0, _path.join)(_electron.app.getPath('userData'), 'data'),
				appLogs: (0, _path.join)(_electron.app.getPath('userData'), 'logs'),
				public: project && project.paths && project.paths.public || (0, _path.join)(process.env.PWD, 'public'),
				temp: _electron.app.getPath('temp'),
				project: project && project.root || process.env.PWD
			}
		});

		hide(options);

		setupAppHome(options.paths);

		this.paths.actionStream = (0, _path.join)(this.paths.appLogs, this.id + '-action-stream.js');

		hide({
			actionLogger: (0, _fs.createWriteStream)(this.paths.actionStream),
			store: setupStore()
		});
	}

	_createClass(Application, [{
		key: 'sendMessage',
		value: function sendMessage(panel, message, payload) {
			var win = this.browserWindows[panel];

			if (win) {
				win.webContents.send(message, payload);
			}
		}
	}, {
		key: 'eachBrowserWindow',
		value: function eachBrowserWindow() {
			var windows = Object.values(this.browserWindows);
			windows.forEach.apply(windows, arguments);
		}
	}, {
		key: 'dispatch',
		value: function dispatch(action) {
			_electron.BrowserWindow.getAllWindows().forEach(function (win) {
				win.webContents.send('skypager:message', 'application:dispatch', action);
			});

			return this.store.dispatch(action);
		}
	}, {
		key: 'boot',
		value: function boot() {
			this.store.subscribe(this.onStateChange.bind(this));

			this.workspace = this.createWorkspace(this.argv.workspace);

			if (this.workspace) {
				this.workspace.boot();
			}
		}
	}, {
		key: 'createWorkspace',
		value: function createWorkspace() {
			var name = arguments.length <= 0 || arguments[0] === undefined ? 'main' : arguments[0];
			var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

			(0, _defaultsDeep2.default)(options, this.workspaceSettings[name], {
				id: name.toLowerCase()
			});

			return Workspace.provision(this, options);
		}
	}, {
		key: 'logAction',
		value: function logAction(action) {
			if (this.argv.debug) {
				console.log(JSON.stringify(action, null, 2));
			}

			this.actionLogger.write('dispatch(' + JSON.stringify(action) + ');\n\n');
		}
	}, {
		key: 'onStateChange',
		value: function onStateChange() {
			this.snapshotState();
			global.SkypagerElectronAppState = JSON.stringify(this.state);

			_electron.BrowserWindow.getAllWindows().forEach(function (win) {
				win.webContents.send('skypager:message', 'state:change');
			});
		}
	}, {
		key: 'snapshotState',
		value: function snapshotState() {
			if (this.paths && this.paths.appData) {
				(0, _fs.writeFileSync)((0, _path.join)(this.paths.appData, this.id + '-electron-state.json'), JSON.stringify(this.state, null, 2), 'utf8');
			}
		}
	}, {
		key: 'primaryDisplay',
		get: function get() {
			return _electron.screen.getPrimaryDisplay();
		}
	}, {
		key: 'screenSize',
		get: function get() {
			return this.primaryDisplay.bounds;
		}
	}, {
		key: 'browserWindows',
		get: function get() {
			var workspace = this.workspace;
			var windows = this.state.workspaces.windows.main;

			return keys(windows).reduce(function (memo, panelName) {
				var w = windows[panelName];
				memo[panelName] = _electron.BrowserWindow.fromId(w.browserWindowId);
				return memo;
			}, {});
		}
	}, {
		key: 'state',
		get: function get() {
			return this.store.getState();
		}
	}, {
		key: 'workspacePanelNames',
		get: function get() {
			return this.workspace && this.workspace.panelNames;
		}
	}, {
		key: 'workspacePanels',
		get: function get() {
			return this.workspace && this.workspace.panels;
		}
	}, {
		key: 'workspaceSettings',
		get: function get() {
			var workspaces = this.settings.workspaces;

			workspaces.main = workspaces.main || mainWorkspaceConfig(this);

			return workspaces;
		}
	}]);

	return Application;
})();

exports.default = Application;

function hide(obj, prop, value) {
	defineProperty(obj, prop, {
		enumerable: false,
		value: value
	});
}

function setupStore() {
	var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	var reducers = {
		workspaces: Workspace.store
	};

	var rootReducer = (0, _redux.combineReducers)(reducers);

	var initialState = assign({
		workspaces: Workspace.initialState
	}, options.state || {});

	var middlewares = (0, _redux.applyMiddleware)(_reduxThunk2.default, loggerMiddleware.bind(this));

	var buildStore = (0, _redux.compose)(middlewares)(_redux.createStore);

	return buildStore(rootReducer, (0, _pick2.default)(initialState, keys(reducers)));
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

function setupAppHome(paths) {
	require('mkdirp').sync(paths.appData);
	require('mkdirp').sync(paths.appLogs);
}

function mainWorkspaceConfig(project) {
	var config = project.workspaces.main;

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