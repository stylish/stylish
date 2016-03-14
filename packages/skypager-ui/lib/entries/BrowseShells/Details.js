'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShellDetails = undefined;

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

var _jsxFileName = 'src/entries/BrowseShells/Details.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ShellDetails = exports.ShellDetails = (function (_Component) {
  (0, _inherits3.default)(ShellDetails, _Component);

  function ShellDetails() {
    (0, _classCallCheck3.default)(this, ShellDetails);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ShellDetails).apply(this, arguments));
  }

  (0, _createClass3.default)(ShellDetails, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        },
        'Shell Details'
      );
    }
  }]);
  return ShellDetails;
})(_react.Component);

ShellDetails.displayName = 'ShellDetails';
ShellDetails.propTypes = {};
exports.default = ShellDetails;