'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Server = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash');

var _deepstream = require('./deepstream');

var _deepstream2 = _interopRequireDefault(_deepstream);

var _util = require('./util.js');

var _streamer = require('./streamer');

var _index = require('./dashboard/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Server = exports.Server = (function () {
  function Server(project) {
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Server);

    var server = this;

    this.project = project;
    this.config = config;

    defineProperty(server, 'processes', {
      enumerable: false,
      value: {}
    });

    this.streamer = new _streamer.Streamer({
      root: project.join('log')
    });

    this.prepare();

    process.on('exit', function () {
      (0, _util.shell)('rm -rf ' + streamer.root + '/streamer-*.log');
    });
  }

  (0, _createClass3.default)(Server, [{
    key: 'start',
    value: function start() {
      var _this = this;

      if (this.config.dashboard) {
        (0, _index.dashboard)(this, this.config.dashboard);
      }

      (0, _lodash.values)(this.config.processes).forEach(function (p) {
        return p.startFn.call(_this);
      });
    }
  }, {
    key: 'prepare',
    value: function prepare() {
      var _this2 = this;

      (0, _keys2.default)(this.config.processes).forEach(function (name) {
        var cfg = _this2.config.processes[name];
        cfg.name = name;

        if (cfg.type && cfg.type === 'deepstream') {
          if (_this2.config.dashboard) {
            cfg.paths = cfg.paths || {};
            cfg.paths.serverLog = _this2.project.path('logs', 'streamer-backend.log');
            cfg.paths.errorLog = _this2.project.path('logs', 'streamer-backend.log');
          }

          defineProperty(_this2, 'deepstream', {
            enumerable: false,
            configurable: false,
            value: setupDeepstream(_this2, cfg)
          });

          cfg.startFn = function () {
            return _this2.deepstream.start();
          };
        } else if (cfg.cmd) {

          cfg.startFn = function () {
            var _this3 = this;

            var output = this.streamer.write(name);

            output.on('open', function () {
              _this3.processes[name] = spawn(cfg.cmd, (0, _extends3.default)({}, cfg, {
                stdio: ['ignore', output, output]
              }));
            });
          };
        }
      });
    }
  }]);
  return Server;
})();

exports.default = Server;
var _Object = Object;
var defineProperty = _Object.defineProperty;
var getOwnPropertyDescriptor = _Object.getOwnPropertyDescriptor;

function setupDeepstream(server, cfg) {
  return new _deepstream2.default(cfg, { project: server.project });
}

function spawn(cmd) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var proc = (0, _util.shell)(cmd, options);

  process.on('exit', function () {
    try {
      proc.kill();
    } catch (e) {}
  });

  return proc;
}