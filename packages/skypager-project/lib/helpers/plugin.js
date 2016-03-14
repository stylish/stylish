'use strict';

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

var _plugin = require('./definitions/plugin');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Plugin = (function (_Helper) {
  (0, _inherits3.default)(Plugin, _Helper);

  function Plugin() {
    (0, _classCallCheck3.default)(this, Plugin);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Plugin).apply(this, arguments));
  }

  (0, _createClass3.default)(Plugin, null, [{
    key: 'validate',
    value: function validate(instance) {

      return true;
    }
  }, {
    key: 'fromDefinition',
    value: function fromDefinition(uri, actionDef) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      options.api = actionDef.api;
      return new Plugin(uri, options);
    }
  }]);
  return Plugin;
})(_helper2.default);

Plugin.DSL = _plugin.DSL;
Plugin.Definition = _plugin.PluginDefinition;

module.exports = Plugin;