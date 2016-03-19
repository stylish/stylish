'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _fs = require('fs');

var _util = require('./util');

var _convict = require('convict');

var _convict2 = _interopRequireDefault(_convict);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SkypagerFolder = '.skypager';

module.exports = (function () {
  function Configuration(host) {
    (0, _classCallCheck3.default)(this, Configuration);

    _util.hide.getter(this, 'host', host);
  }

  (0, _createClass3.default)(Configuration, [{
    key: 'get',
    value: function get(value) {
      return this.convict.get(value);
    }
  }, {
    key: 'convict',
    get: function get() {
      return (0, _convict2.default)(this.schema);
    }
  }, {
    key: 'schema',
    get: function get() {
      var _this = this;

      var schema = {
        env: {
          doc: 'The application environment',
          format: ['development', 'production', 'test'],
          default: 'development',
          env: 'NODE_ENV',
          arg: 'env'
        },
        plugins_path: {
          doc: 'Path to plugins',
          default: (0, _path.join)(this.homeDir, SkypagerFolder, 'plugins'),
          env: 'SKYPAGER_PLUGINS_PATH',
          arg: 'plugins-path'
        }
      };

      this.host.enabledPlugins.forEach(function (pluginName) {
        var pluginHelper = _this.host.plugins.lookup(pluginName);

        if (pluginHelper.api.provides('configuration')) {}
      });

      return schema;
    }
  }, {
    key: 'homeDir',
    get: function get() {
      return process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME;
    }
  }]);
  return Configuration;
})();