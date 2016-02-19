'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultSettings = exports.Server = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _fs = require('fs');

var _lodash = require('lodash');

var _util = require('./util.js');

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _express = require('./server/express');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Server = exports.Server = (function () {
  function Server() {
    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Server);
    var project = context.project;
    var argv = context.argv;
    var env = params.env;
    var profile = params.profile;

    argv = argv || require('yargs').argv;

    (0, _lodash.defaultsDeep)(this, {
      env: env,
      profile: profile,
      project: project
    }, { env: 'development', profile: 'web' });

    var config = (0, _lodash.get)(project, 'settings.server.' + profile + '.' + env) || defaultSettings[profile][env] || {};

    (0, _util.defineProp)(this, 'config', (0, _lodash.defaultsDeep)({}, config, { processes: {} }));
    (0, _util.defineProp)(this, 'processes', (0, _lodash.mapValues)(config.processes, function (cfg, name) {
      return (cfg.name = name) && cfg;
    }));

    this.paths = {
      logs: project.path('logs', 'server'),
      public: project.paths.public
    };

    (0, _lodash.values)(this.paths).forEach(function (path) {
      _mkdirp2.default.sync(path);
    });

    this.state = {
      processes: {}
    };

    project.logger.add(_winston2.default.transports.File, {
      name: 'server-logger',
      level: 'debug',
      filename: (0, _path.join)(this.paths.logs, 'server.' + env + '.log')
    });

    this.logger = project.logger;
  }

  (0, _createClass3.default)(Server, [{
    key: 'start',
    value: function start() {
      this.prepare();
      this.run();
      this.listen();
    }
  }, {
    key: 'listen',
    value: function listen() {
      var _this = this;

      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      (0, _lodash.defaultsDeep)(options, {
        port: this.config.port || 8080,
        host: this.config.host || '0.0.0.0'
      });

      var app = (0, _express.express)(this, options);

      var host = options.host;
      var port = options.port;

      this.log('info', 'express app starting', options);

      app.listen(port, host, function (err) {
        if (err) {
          _this.log('error', 'error launching espress', {
            err: err
          });
        }
      });
    }
  }, {
    key: 'run',
    value: function run() {
      var _this2 = this;

      var updateProcess = this.updateProcess.bind(this);

      (0, _util.defineProp)(this, '_processes', {});

      this.eachProcess(function (proc) {
        if (!proc) {
          return;
        }

        var opts = (0, _lodash.pick)(proc, 'env', 'cwd', 'detached', 'uid', 'gid', 'stdio');

        opts = (0, _lodash.defaultsDeep)(opts, {
          stdio: ['ignore', proc.output, proc.output]
        });

        (0, _util.spawn)(proc.cmd, opts).progress(function (child) {
          _this2._processes[proc.name] = child;

          child.title = 'skypager-server: ' + proc.name;

          updateProcess(proc.name, (0, _extends3.default)({
            pid: child.pid,
            status: 'running'
          }, proc));
        }).then(function (result) {
          updateProcess(proc.name, (0, _extends3.default)({
            status: 'finished'
          }, proc));
        }).fail(function (err) {
          updateProcess(proc.name, (0, _extends3.default)({
            status: 'failure'
          }, proc, {
            err: err
          }));
        });
      });

      process.on('exit', function () {
        (0, _lodash.values)(_this2._processes).forEach(function (proc) {
          if (proc) {
            proc.kill();
          }
        });
      });

      this.log('info', 'server started: ' + process.pid, this.processes);

      process.title = 'skypager-server';
    }

    /**
    * The output on stdout for each of the processes we spawn will be streamed
    * to a log file. The dashboard can stream this for visual purposes, or it can
    * be analyzed elsewhere.
    */

  }, {
    key: 'prepare',
    value: function prepare() {
      var _this3 = this;

      this.eachProcess(function (proc) {
        (0, _util.defineProp)(proc, 'output', stream(_this3.logPath(proc.name + '.' + _this3.env + '.log')));
        proc.output.open();
      });
    }
  }, {
    key: 'eachProcess',
    value: function eachProcess(fn) {
      (0, _lodash.values)(this.processes).forEach(fn);
    }
  }, {
    key: 'updateProcess',
    value: function updateProcess(name) {
      var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var current = (0, _lodash.get)(this, 'state.processes.' + name) || {};
      var updated = current = (0, _assign2.default)(current, data);

      (0, _lodash.set)(this, 'state.processes.' + name, updated);

      this.log('debug', 'updated process', current);
    }
  }, {
    key: 'log',
    value: function log(level) {
      var _logger;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_logger = this.logger).log.apply(_logger, [level].concat(args));
    }
  }, {
    key: 'logPath',
    value: function logPath() {
      var _project;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (_project = this.project).path.apply(_project, ['logs', 'server'].concat(args));
    }
  }]);
  return Server;
})();

exports.default = Server;
var defaultSettings = exports.defaultSettings = {
  web: {
    development: {
      processes: {
        devserver: {
          cmd: 'skypager dev --bundle'
        }
      }
    }
  }
};

var _Object = Object;
var keys = _Object.keys;
var defineProperty = _Object.defineProperty;
var getOwnPropertyDescriptor = _Object.getOwnPropertyDescriptor;

function stream(path) {
  _mkdirp2.default.sync((0, _path.dirname)(path));
  var fd = (0, _fs.openSync)(path, 'a+');
  return (0, _fs.createWriteStream)(path, { fd: fd });
}