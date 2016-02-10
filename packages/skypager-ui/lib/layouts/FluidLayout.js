'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FluidLayout = undefined;

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

var _jsxFileName = 'src/layouts/FluidLayout.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FluidTopNavbar = require('../components/FluidTopNavbar');

var _FluidTopNavbar2 = _interopRequireDefault(_FluidTopNavbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FluidLayout = exports.FluidLayout = (function (_React$Component) {
  (0, _inherits3.default)(FluidLayout, _React$Component);

  function FluidLayout() {
    (0, _classCallCheck3.default)(this, FluidLayout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FluidLayout).apply(this, arguments));
  }

  (0, _createClass3.default)(FluidLayout, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'fluid-layout', __source: {
            fileName: _jsxFileName,
            lineNumber: 8
          }
        },
        _react2.default.createElement(_FluidTopNavbar2.default, { children: this.props.navbarItems, __source: {
            fileName: _jsxFileName,
            lineNumber: 9
          }
        }),
        _react2.default.createElement(
          'div',
          { className: 'container-fluid container-fluid-spacious', __source: {
              fileName: _jsxFileName,
              lineNumber: 11
            }
          },
          this.props.children
        )
      );
    }
  }]);
  return FluidLayout;
})(_react2.default.Component);

FluidLayout.propTypes = {
  children: _react2.default.PropTypes.array,
  navbarItems: _react2.default.PropTypes.array
};

exports.default = FluidLayout;