'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetupHome = undefined;

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

var _jsxFileName = 'src/ui/applications/setup/SetupHome.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _applications = require('ui/applications');

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stateful = _applications.util.stateful;

var SetupHome = exports.SetupHome = (function (_Component) {
  (0, _inherits3.default)(SetupHome, _Component);

  function SetupHome() {
    (0, _classCallCheck3.default)(this, SetupHome);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SetupHome).apply(this, arguments));
  }

  (0, _createClass3.default)(SetupHome, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 13
          }
        },
        _react2.default.createElement(
          _reactBootstrap.Panel,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 14
            }
          },
          'Skypager Setup Wizard'
        )
      );
    }
  }]);
  return SetupHome;
})(_react.Component);

SetupHome.displayName = 'SetupHome';
exports.default = stateful(SetupHome, 'project', 'settings');