'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Workspace = exports.actions = exports.initialState = exports.store = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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
    (0, _classCallCheck3.default)(this, Workspace);

    (0, _util.hideProperties)(this, {
      application: application,
      attributes: attributes,
      publicPath: application.paths.public,
      baseUrl: options.baseUrl || attributes.baseUrl || 'file://' + application.paths.public,
      env: options.env || application.env || 'development'
    });

    this.command = attributes.command;

    this.panelSettings = (0, _lodash.mapValues)(this.attributes.panels || defaultPanels, function (panel, id) {
      panel.id = id;
      panel.window = panel.window || DEFAULT_WINDOW;

      return panel;
    });

    this.stages = this.attributes.stages || {};
    this.currentStage = this.attributes.initialStage;
  }

  (0, _createClass3.default)(Workspace, [{
    key: 'boot',
    value: function boot() {
      var stage = arguments.length <= 0 || arguments[0] === undefined ? this.currentStage : arguments[0];

      buildElectronifyOptions(this);

      var panels = undefined;

      if (!(0, _lodash.isEmpty)(this.stages) && stage) {
        panels = this.stages[stage];
      }

      if (!stage) {
        panels = this.panelNames;
      }

      this.currentStage = stage;

      return this.launchPanels(panels);
    }
  }, {
    key: 'launchPanels',
    value: function launchPanels() {
      var _this = this;

      var panels = arguments.length <= 0 || arguments[0] === undefined ? this.panelNames : arguments[0];

      panels.forEach(function (panelId) {
        return _this.launch(panelId);
      });
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
    key: 'launch',
    value: function launch(panelId) {
      if (!this.panelSettings[panelId]) {
        throw 'error launching panel; No such panel: ' + panelId;
      }

      return _launch.call(this, panelId, this.panelSettings[panelId]);
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
      return (0, _lodash.values)(this.panelSettings);
    }
  }, {
    key: 'panelNames',
    get: function get() {
      return (0, _keys2.default)(this.panelSettings);
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

function _launch(panelName) {
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
      var opts = w.panelSettings[panelName];
      var constrained = opts.constrained;

      win.show();

      if (constrained) {
        try {
          win.show();

          if (opts.window && opts.window.centered) {
            win.setSize(constrained.width, constrained.height);
          } else {
            win.setBounds((0, _extends3.default)({}, constrained));
          }
        } catch (error) {
          console.log('');
          console.log('Error setting window bounds', constrained);
          console.log(error.message.red);
        }
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

  options.window.preload = require.resolve('../client-bootstrap.js');

  options.url = options.url || w.panelSettings[panelName].url || '';

  if (options.window.center || options.window.centered) {
    delete options.x;
    delete options.y;
  }

  var proc = (0, _electronifyServer2.default)(options);

  proc.on('child-started', function (child) {
    w.dispatch(processStarted(w, panelName, child));
  }).on('child-closed', function (app, stderr, stdout) {
    w.dispatch(processClosed(w, panelName));
  }).on('child-error', function (err) {
    w.dispatch(processError(w, panelName, err));
  });
}