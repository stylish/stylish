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

var _registry = require('../registry');

var _registry2 = _interopRequireDefault(_registry);

var _action = require('./definitions/action');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Action = (function (_Helper) {
  (0, _inherits3.default)(Action, _Helper);

  function Action() {
    (0, _classCallCheck3.default)(this, Action);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Action).apply(this, arguments));
  }

  (0, _createClass3.default)(Action, [{
    key: 'helperClass',
    get: function get() {
      return Action;
    }
  }, {
    key: 'definitionClass',
    get: function get() {
      return _action.ActionDefinition;
    }
  }]);
  return Action;
})(_helper2.default);

Action.DSL = _action.DSL;
Action.Definition = _action.ActionDefinition;
Action.apiMethods = _action.ActionDefinition.apiMethods;

module.exports = Action;