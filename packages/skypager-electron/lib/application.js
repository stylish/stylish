'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Application = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.setupStore = setupStore;
exports.loggerMiddleware = loggerMiddleware;
exports.setupAppHome = setupAppHome;

var _util = require('./util');

var _path = require('path');

var _fs = require('fs');

var _redux = require('redux');

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _eventStream = require('event-stream');

var _eventStream2 = _interopRequireDefault(_eventStream);

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

var _Object = Object;
var defineProperty = _Object.defineProperty;
var keys = _Object.keys;
var assign = _Object.assign;

var Application = exports.Application = (function () {
	function Application(project) {
		var _this = this;

		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		(0, _classCallCheck3.default)(this, Application);

		var hide = this.hide = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			return _util.hideProperties.call.apply(_util.hideProperties, [_this, _this].concat(args));
		};

		if (!project || !project.settings) {
			throw 'Please ensure your project has settings data. data/settings/workspaces.yml for example.';
		}

		var settings = project.settings;

		options = (0, _defaultsDeep2.default)(options, {
			id: project.name,
			argv: { workspace: 'main' },
			command: '',
			env: 'development',
			settings: settings,
			paths: {
				appData: (0, _path.join)(_electron.app.getPath('userData'), 'data'),
				appLogs: project.path('logs', 'electron'),
				public: project.paths.public || (0, _path.join)(process.env.PWD, 'public'),
				temp: project.path('tmpdir', 'electron'),
				project: project.root || process.env.PWD
			}
		});

		hide(options);

		setupAppHome(options.paths);

		this.paths.actionLog = (0, _path.join)(this.paths.appLogs, this.id + '-actions.json');

		hide({
			store: setupStore(),
			logger: new _winston2.default.Logger({
				level: 'debug',
				transports: [new _winston2.default.transports.File({
					filename: this.paths.actionLog,
					json: true
				})]
			})
		});

		if (!this.settings.workspaces) {
			(0, _defaultsDeep2.default)(this.settings, {
				workspaces: {
					main: {
						panels: {
							main: {
								path: 'index.html'
							}
						}
					}
				}
			});
		}

		this.setupProjectStream();
	}

	(0, _createClass3.default)(Application, [{
		key: 'setupProjectStream',
		value: function setupProjectStream() {
			(0, _fs.createReadStream)(this.project.path('logs', 'project.log')).pipe(_eventStream2.default.split()).pipe(_eventStream2.default.parse()).pipe(_eventStream2.default.map(function (obj, cb) {
				cb(null, obj);
			}));
		}
	}, {
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
			var windows = (0, _values2.default)(this.browserWindows);
			windows.forEach.apply(windows, arguments);
		}
	}, {
		key: 'dispatch',
		value: function dispatch(action) {
			_electron.BrowserWindow.getAllWindows().forEach(function (win) {
				win.webContents.send('skypager:message', 'application:dispatch', action);
			});

			this.project.log('debug', action);
			return this.store.dispatch(action);
		}
	}, {
		key: 'boot',
		value: function boot(app) {
			this.store.subscribe(this.onStateChange.bind(this));

			this.workspace = this.createWorkspace(this.argv.workspace && this.project.settings.workspaces[this.argv.workspace] ? this.argv.workspace : 'main');

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
		key: 'restoreFocus',
		value: function restoreFocus() {
			this.eachBrowserWindow(function (win) {
				win.isMinimized() ? win.restore() : null;
			});
		}
	}, {
		key: 'onStateChange',
		value: function onStateChange() {
			this.snapshotState();

			// this makes it available to the renderer processes via require('remote').getGlobal()
			global.SkypagerElectronAppState = (0, _stringify2.default)(this.state);

			_electron.BrowserWindow.getAllWindows().forEach(function (win) {
				win.webContents.send('skypager:message', 'state:change');
			});
		}
	}, {
		key: 'snapshotState',
		value: function snapshotState() {
			(0, _fs.writeFileSync)((0, _path.join)(this.project.path('tmpdir'), this.id + '-electron-state.json'), (0, _stringify2.default)(this.state, null, 2), 'utf8');
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
			return this.settings.workspaces;
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