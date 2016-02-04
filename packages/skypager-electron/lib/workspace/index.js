'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
		value: true
});
exports.Workspace = undefined;
exports.defaultWorkspace = defaultWorkspace;

var _electronifyServer = require('electronify-server');

var _electronifyServer2 = _interopRequireDefault(_electronifyServer);

var _path = require('path');

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireDefault(_pick);

var _reduxActions = require('redux-actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultPanels = {
		main: {
				path: 'index.html',
				layout: 'centered'
		}
};

var Workspace = exports.Workspace = (function () {
		_createClass(Workspace, null, [{
				key: 'provision',
				value: function provision(application, options) {
						return new Workspace(application, options);
				}
		}]);

		function Workspace(application) {
				var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
				var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

				_classCallCheck(this, Workspace);

				this.panels = assign({}, defaultPanels, attributes.panels || {});
		}

		_createClass(Workspace, [{
				key: 'dispatch',
				value: function dispatch() {
						var action = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

						action.meta = assign({ applicationId: this.application.id, workspaceId: this.id }, action.meta || {});
						return this.application.dispatch(action);
				}
		}, {
				key: 'boot',
				value: function boot() {
						var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

						this.launchPanels();
				}
		}, {
				key: 'launchPanels',
				value: function launchPanels() {
						var workspace = this;

						workspace.launchPanel(panel.id, panel);
				}
		}, {
				key: 'launchPanel',
				value: function launchPanel(panelName, config) {
						launch(this, panelName, config);
				}
		}, {
				key: 'id',
				get: function get() {
						return this.attributes.id;
				}
		}]);

		return Workspace;
})();

function launch(w, panelName) {
		var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

		var options = assign(params, {
				ready: function ready(electronApp) {
						w.dispatch(workspaceReady(w));
				},

				preLoad: function preLoad(electronApp, win) {
						w.registerBrowserWindow(panelName, win);
				},

				postLoad: function postLoad(electronApp, win) {
						w.dispatch(panelLoaded(w, panelName, electronApp, win));
				}
		});

		if (!options.command) {
				options.noServer = true;
		}

		(0, _electronifyServer2.default)(options).on('child-started', function (c) {
				return w.dispatch(procesStarted(w, panelName, c));
		}).on('child-closed', function (app, stderr, stdout) {
				return w.dispatch(processClosed(w, panelName));
		}).on('child-error', function (err, app) {
				return w.dispatch(processError(w, panelName, err));
		});
}

function defaultWorkspace(application) {
		return {
				id: 'default',
				application: application
		};
}

var _Object = Object;
var defineProperty = _Object.defineProperty;
var keys = _Object.keys;
var assign = _Object.assign;
var values = _Object.values;