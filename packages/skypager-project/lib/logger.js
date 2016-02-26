'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.logger = logger;

var _winston = require('winston');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function logger(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  if (project.logger) {
    return project.logger;
  }

  var env = project.env;

  var _transports = [new _winston.transports.File({
    name: 'project',
    filename: project.path('logs', 'project.log')
  })];

  if (options.debug || process.env.SKYPAGER_DEBUG_STDOUT === 'stdout') {
    _transports.unshift(new _winston.transports.Console({ colorize: true }));
  }

  defineProperty(project, 'logger', {
    enumerable: false,
    configurable: false,
    value: new _winston.Logger({
      level: 'debug',
      transports: _transports
    })
  });

  assign(project, {
    log: function log() {
      var _project$logger;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_project$logger = project.logger).log.apply(_project$logger, ['info'].concat((0, _toConsumableArray3.default)(args)));
    },
    error: function error() {
      var _project$logger2;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      (_project$logger2 = project.logger).log.apply(_project$logger2, ['error'].concat((0, _toConsumableArray3.default)(args)));
    },
    debug: function debug() {
      var _project$logger3;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      (_project$logger3 = project.logger).log.apply(_project$logger3, ['debug'].concat((0, _toConsumableArray3.default)(args)));
    }
  });

  return project.logger;
}

exports.default = logger;
var _Object = Object;
var assign = _Object.assign;
var defineProperty = _Object.defineProperty;