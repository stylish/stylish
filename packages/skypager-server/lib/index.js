'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.start = start;

var _dashboard = require('./dashboard');

var _dashboard2 = _interopRequireDefault(_dashboard);

var _streamer = require('./streamer');

var _streamer2 = _interopRequireDefault(_streamer);

var _runner = require('./runner');

var _runner2 = _interopRequireDefault(_runner);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _util = require('./util');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function start() {
  var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var project = context.project;

  params.env = params.env || process.env.NODE_ENV || 'development';

  var config = (0, _lodash.defaultsDeep)(buildOptions(params, context), params);
  var server = new _server2.default(project, config);

  server.start();
}

exports.default = start;

var processes = {
  preview: {
    cmd: 'skypager dev --port 3000 --proxy-target="localhost:6020" --proxy-path="/engine.io"'
  },
  deepstream: {
    cmd: 'skypager serve deepstream --host localhost --port 6020'
  },
  ngrok: {
    cmd: 'ngrok http 3000'
  }
};

function buildOptions(params, context) {
  var project = context.project;
  var options = context.options;
  var profile = params.profile;
  var env = params.env;

  var current = (0, _lodash.get)(project.settings, 'server.' + profile);

  if (!current) {
    if (project.settings.server.defaultProfile || (0, _keys2.default)(project.settings.server)[0]) {
      profile = project.settings.server.defaultProfile || (0, _keys2.default)(project.settings.server)[0];
    }

    if (current = (0, _lodash.get)(project.settings, 'server.' + profile)) {
      console.log('Using profile: ' + profile);
    }
  }

  var config = (0, _lodash.get)(project.settings, 'server.' + profile + '.' + env) || {};

  return config || { processes: processes, env: env };
}