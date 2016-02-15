'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Server = exports.constants = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _lodash = require('lodash');

var _deepstream = require('deepstream.io');

var _deepstream2 = _interopRequireDefault(_deepstream);

var _deepstream3 = require('deepstream.io-cache-redis');

var _deepstream4 = _interopRequireDefault(_deepstream3);

var _deepstream5 = require('deepstream.io-msg-redis');

var _deepstream6 = _interopRequireDefault(_deepstream5);

var _permissions = require('./permissions');

var permissions = _interopRequireWildcard(_permissions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var constants = exports.constants = _deepstream2.default.constants;

var Server = exports.Server = (function (_Deepstream) {
  (0, _inherits3.default)(Server, _Deepstream);

  function Server() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Server);
    var project = context.project;

    var env = options.env || process.env.NODE_ENV || 'development';

    (0, _lodash.defaults)(options, {
      port: 6020,
      host: 'localhost',
      cachePort: 6379,
      cacheHost: 'localhost',
      start: false,
      env: process.env.NODE_ENV || 'development',
      permissions: permissions,
      paths: {
        serverLog: project.path('logs', 'deepstream.server.' + env + '.log'),
        errorLog: project.path('logs', 'deepstream.error.' + env + '.log')
      }
    });

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Server).call(this, options.host + ':' + options.port));

    var cachePort = options.cachePort;
    var cacheHost = options.cacheHost;
    var _options$permissions = options.permissions;
    var _isValidUser = _options$permissions.isValidUser;
    var _canPerformAction = _options$permissions.canPerformAction;

    _this.set('showLogo', false);

    _this.set('logger', require('./logger')(options));

    _this.set('cache', new _deepstream4.default({
      port: cachePort,
      host: cacheHost
    }));

    _this.set('messageConnector', new _deepstream6.default({
      port: cachePort,
      host: cacheHost
    }));

    _this.set('permissionHandler', {
      isValidUser: function isValidUser(connectionData, authData, callback) {
        if (_isValidUser(connectionData, authData, project)) {
          return callback(null, authData.username || 'anonymous');
        }
      },

      canPerformAction: function canPerformAction(username, message, callback) {
        if (_canPerformAction(username, message, project)) {
          return callback(null, true);
        }
      }
    });

    if (options.start) {
      _this.start();
    }
    return _this;
  }

  return Server;
})(_deepstream2.default);

Server.constants = constants;
exports.default = Server;