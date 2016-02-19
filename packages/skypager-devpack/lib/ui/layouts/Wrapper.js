'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapper = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _jsxFileName = 'src/ui/layouts/Wrapper.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _IconNavLayout = require('ui/layouts/IconNavLayout');

var _IconNavLayout2 = _interopRequireDefault(_IconNavLayout);

var _stateful = require('../applications/util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

var _pick2 = require('lodash/pick');

var _pick3 = _interopRequireDefault(_pick2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Wrapper = exports.Wrapper = (function (_Component) {
  (0, _inherits3.default)(Wrapper, _Component);

  function Wrapper() {
    (0, _classCallCheck3.default)(this, Wrapper);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Wrapper).apply(this, arguments));
  }

  (0, _createClass3.default)(Wrapper, [{
    key: 'render',
    value: function render() {
      var _pick = (0, _pick3.default)(this.props, 'navigation', 'app', 'branding');

      var settings = _pick.settings;

      var layoutProps = assign({}, settings, settings.layout || {});

      return _react2.default.createElement(
        _IconNavLayout2.default,
        (0, _extends3.default)({}, layoutProps, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 16
          }
        }),
        this.props.children
      );
    }
  }]);
  return Wrapper;
})(_react.Component);

Wrapper.displayName = 'Wrapper';
exports.default = (0, _stateful2.default)(Wrapper, 'settings');
var _Object = Object;
var assign = _Object.assign;