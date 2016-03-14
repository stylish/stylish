'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputWithIcon = undefined;

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

var _jsxFileName = 'src/components/InputWithIcon/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Icon = require('ui/components/Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INPUT_TYPES = ['datepicker', 'search', 'text'];

var InputWithIcon = exports.InputWithIcon = (function (_React$Component) {
  (0, _inherits3.default)(InputWithIcon, _React$Component);

  function InputWithIcon() {
    (0, _classCallCheck3.default)(this, InputWithIcon);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(InputWithIcon).apply(this, arguments));
  }

  (0, _createClass3.default)(InputWithIcon, [{
    key: 'render',
    value: function render() {
      var props = this.props;
      var className = props.className;
      var type = props.type;
      var icon = props.icon;
      var name = props.name;

      return _react2.default.createElement('div', { className: 'input-with-icon ' + (className || ''), __source: {
          fileName: _jsxFileName,
          lineNumber: 17
        }
      });
    }
  }]);
  return InputWithIcon;
})(_react2.default.Component);

InputWithIcon.propTypes = {};

exports.default = InputWithIcon;