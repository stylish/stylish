'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetupDeployment = undefined;

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

var _jsxFileName = 'src/ui/applications/setup/SetupDeployment.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SetupDeployment = exports.SetupDeployment = (function (_Component) {
  (0, _inherits3.default)(SetupDeployment, _Component);

  function SetupDeployment() {
    (0, _classCallCheck3.default)(this, SetupDeployment);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SetupDeployment).apply(this, arguments));
  }

  (0, _createClass3.default)(SetupDeployment, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 8
          }
        },
        _react2.default.createElement(
          'h1',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 9
            }
          },
          'Deployment Setup'
        )
      );
    }
  }]);
  return SetupDeployment;
})(_react.Component);

SetupDeployment.displayName = 'SetupDeployment';
exports.default = SetupDeployment;