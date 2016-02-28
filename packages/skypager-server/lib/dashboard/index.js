'use strict';

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _path = require('path');

var _util = require('../util.js');

var _fs = require('fs');

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _values = require('lodash/values');

var _values2 = _interopRequireDefault(_values);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = dashboard;

var _Object = Object;
var keys = _Object.keys;
var assign = _Object.assign;

function dashboard(server, options) {
  var project = server.project;

  var screen = _blessed2.default.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Skypager',
    dockBorders: true
  });

  // Let user quit the app
  screen.key(['escape', 'q', 'C-c'], function (ch, key) {
    return process.exit(0);
  });

  server.panels = renderPanels(screen, options);

  project.debug('launching dashboard with panels', options);

  (0, _mapValues2.default)(options.panels, function (panel, key) {
    if (panel.type === 'log' && panel.process) {
      var panelOutput = server.logPath(panel.process + '.' + server.env + '.log');
      var logPanel = server.panels[key];

      logPanel.add('Monitoring log at ' + panelOutput);

      streamer(panelOutput, logPanel.add.bind(logPanel));
    }
  });

  var logger = new _winston2.default.Logger({
    level: 'debug',
    transports: [new _winston2.default.transports.File({
      filename: server.logPath('dashboard.' + server.env + '.log'),
      json: true,
      colorize: true
    })]
  });

  function silence() {
    // Don't overwrite the screen
    console.log = capture('log');
    console.warn = capture('warn');
    console.error = capture('error');
    console.info = capture('info');
    console.debug = capture('debug');
  }

  function capture(level) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      logger.log.apply(logger, [level].concat(args));
    };
  }
}

function renderPanels(screen, options) {
  var configs = (0, _mapValues2.default)(options.panels, function (panel, name) {
    return assign(panel, { name: name });
  });

  var panels = (0, _mapValues2.default)(configs, function (panel, name) {
    var type = panel.type || 'box';
    var widget = _blessed2.default[type] || _blessed2.default.box;
    var config = (0, _pick2.default)(panel, 'top', 'left', 'height', 'width', 'label', 'border', 'style');

    if (panel.borderStyles) {
      config = (0, _defaultsDeep2.default)(config, borderStyles(panel.borderStyles));
    }

    var element = widget(config);

    screen.append(element);

    return element;
  });

  screen.render();

  return panels;
}

function borderStyles() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  (0, _defaultsDeep2.default)(options, {
    type: 'line',
    color: 'white'
  });

  var type = options.type;
  var color = options.color;

  return {
    border: {
      type: type
    },
    style: {
      border: {
        fg: color
      }
    }
  };
}

function streamer(path, onData) {
  var spawn = require('child_process').spawn;

  var proc = spawn('tail', ['-f', path]);

  proc.stdout.on('data', function (buffer) {
    onData(buffer.toString());
  });
}