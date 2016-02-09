'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Workspace = exports.actions = exports.initialState = exports.store = undefined;
exports.provision = provision;

var _path = require('path');

var _reduxActions = require('redux-actions');

var _util = require('../util');

var _lodash = require('lodash');

var _constrain = require('../util/constrain');

var _chokidar = require('chokidar');

var _chokidar2 = _interopRequireDefault(_chokidar);

var _electronifyServer = require('./electronify-server');

var _electronifyServer2 = _interopRequireDefault(_electronifyServer);

var _actions2 = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultPanels = {
  browser: {
    path: 'index.html',
    layout: 'centered'
  }
};

var DEFAULT_WINDOW = {
  height: 768,
  width: 1024,
  centered: true
};

var _Object = Object;
var keys = _Object.keys;
var assign = _Object.assign;
var store = exports.store = _actions2.store;
var initialState = exports.initialState = _actions2.initialState;
var actions = exports.actions = _actions2.actions;

var workspaceDidLaunch = _actions2.actions.workspaceDidLaunch;
var workspaceReady = _actions2.actions.workspaceReady;
var panelLoaded = _actions2.actions.panelLoaded;
var processClosed = _actions2.actions.processClosed;
var processError = _actions2.actions.processError;
var processStarted = _actions2.actions.processStarted;

var Workspace = exports.Workspace = (function () {
  function Workspace(application) {
    var attributes = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Workspace);

    (0, _util.hideProperties)(this, {
      application: application,
      attributes: attributes,
      publicPath: application.paths.public,
      baseUrl: options.baseUrl || attributes.baseUrl || application.settings && application.settings.baseUrl,
      env: options.env || application.env || 'development'
    });

    this.command = attributes.command;
    this.panelSettings = this.attributes.panels || defaultPanels;
  }

  _createClass(Workspace, [{
    key: 'boot',
    value: function boot() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      buildElectronifyOptions(this);

      this.launchPanels();
    }
  }, {
    key: 'dispatch',
    value: function dispatch() {
      var action = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      action.meta = assign({
        applicationId: this.application.id,
        workspaceId: this.id
      }, action.meta || {});

      return this.application.dispatch(action);
    }
  }, {
    key: 'launchPanels',
    value: function launchPanels() {
      var _this = this;

      this.panels.forEach(function (panel) {
        if (process.env.NODE_ENV !== 'test') {
          launch.call(_this, panel.id, assign(panel.opts, { window: panel.window || DEFAULT_WINDOW }));
        }
      });
    }
  }, {
    key: 'id',
    get: function get() {
      return this.attributes.id;
    }
  }, {
    key: 'commandCount',
    get: function get() {
      return (0, _lodash.compact)(this.panels.map(function (p) {
        return p.command;
      })).length;
    }
  }, {
    key: 'panels',
    get: function get() {
      var _this2 = this;

      return this.panelNames.map(function (panelName) {
        var panel = _this2.panelSettings[panelName];
        panel.id = panel.id || panelName;
        return panel;
      });
    }
  }, {
    key: 'panelNames',
    get: function get() {
      return Object.keys(this.panelSettings);
    }
  }]);

  return Workspace;
})();

function provision(application, options) {
  return new Workspace(application, options);
};

function buildElectronifyOptions(workspace) {
  var command = workspace.command;

  return workspace.panels.map(function (panel, index) {
    var opts = {};

    if (command && !panel.command && index === 0) {
      panel.command = opts.command = command;
    }

    if (!panel.command) {
      opts.noServer = true;
    }

    if (!panel.url && panel.path) {
      opts.url = '' + (workspace.baseUrl || 'http://localhost:3000') + panel.path;
    }

    panel.opts = opts;

    return opts;
  });
}

function launch(panelName) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var w = this;

  var options = assign({}, params, {
    ready: function ready(electronApp) {
      var constrained = (0, _constrain.constrain)(assign({}, params.window), w.application.screenSize);

      w.panelSettings[panelName].constrained = constrained;

      w.dispatch(workspaceReady(w, {
        panelName: panelName,
        constrained: constrained
      }));
    },

    preLoad: function preLoad(electronApp, win) {
      w.dispatch(workspaceReady(w, {
        browserWindowId: win.id,
        panelName: panelName
      }));
    },

    postLoad: function postLoad(electronApp, win) {
      if (w.panelSettings[panelName].constrained) {
        win.setBounds(_extends({}, w.panelSettings[panelName].constrained));
      }

      w.dispatch(panelLoaded(w, panelName, electronApp, win));
    }
  });

  if (!options.command) {
    options.noServer = true;
  }

  w.dispatch(workspaceDidLaunch(w, {
    panelName: panelName,
    electronify: {
      command: options.command,
      url: options.url,
      noServer: options.noServer,
      window: options.window
    }
  }));

  if (options.command && options.command.match(/skypager dev/)) {
    (function () {
      var watcher = _chokidar2.default.watch(process.env.PWD, {
        persistent: true,
        depth: 1
      });

      watcher.on('raw', function (action, path) {
        if (path && path.match(/webpack-stats/)) {
          w.dispatch({
            type: 'WEBPACK_DEV_SERVER_READY',
            payload: {
              panelName: panelName,
              workspaceId: w.id
            }
          });

          watcher.close();

          w.application.eachBrowserWindow(function (browserWindow) {
            browserWindow.show();
            browserWindow.reload();
          });
        }
      });

      process.on('exit', function (code) {
        if (!watcher && watcher.closed) {
          watcher.close();
        }
      });
    })();
  }

  options.window.preload = require.resolve('../client-bootstrap.js');

  var proc = (0, _electronifyServer2.default)(options);

  proc.on('child-started', function (child) {
    w.dispatch(processStarted(w, panelName, child));
  }).on('child-closed', function (app, stderr, stdout) {
    w.dispatch(processClosed(w, panelName));
  }).on('child-error', function (err) {
    w.dispatch(processError(w, panelName, err));
  });
}