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

var _lodash = require('lodash');

var _util = require('./util.js');

var _index = require('./dashboard/index');

var _path = require('path');

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fs = require('fs');

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
      logs: project.path('logs', 'server')
    };

    (0, _lodash.values)(this.paths).forEach(function (path) {
      _mkdirp2.default.sync(path);
    });

    this.state = {
      processes: {}
    };

    this.logger = argv.debug ? process.stdout : stream((0, _path.join)(this.paths.logs, 'server.' + env + '.log'));
  }

  (0, _createClass3.default)(Server, [{
    key: 'start',
    value: function start() {
      this.prepare();
      this.run();
    }
  }, {
    key: 'run',
    value: function run() {
      var _this = this;

      var updateProcess = this.updateProcess.bind(this);

      (0, _util.defineProp)(this, '_processes', {});

      this.eachProcess(function (proc) {
        var opts = (0, _lodash.pick)(proc, 'env', 'cwd', 'detached', 'uid', 'gid', 'stdio');

        opts = (0, _lodash.defaultsDeep)(opts, {
          stdio: ['ignore', proc.output, proc.output]
        });

        (0, _util.spawn)(proc.cmd, opts).progress(function (child) {
          _this._processes[proc.name] = child;

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
        (0, _lodash.values)(_this._processes).forEach(function (proc) {
          proc.kill();
        });
      });

      this.log('info', 'server started: ' + process.pid, this.processes);

      process.title = 'skypager-server';
    }
  }, {
    key: 'prepare',
    value: function prepare() {
      var _this2 = this;

      this.eachProcess(function (proc) {
        (0, _util.defineProp)(proc, 'output', stream(_this2.logPath(proc.name + '.' + _this2.env + '.log')));
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

      this.log('info', 'updated process', current);
    }
  }, {
    key: 'log',
    value: function log(level, message) {
      var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      this.logger && this.logger.write((0, _util.colorize)({
        level: level,
        message: message,
        data: data
      }) + "\n\n");
    }
  }, {
    key: 'logPath',
    value: function logPath() {
      var _project;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
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