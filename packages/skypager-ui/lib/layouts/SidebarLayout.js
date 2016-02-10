'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SidebarLayout = undefined;

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

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

var _jsxFileName = 'src/layouts/SidebarLayout.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SidebarLayout = exports.SidebarLayout = (function (_React$Component) {
  (0, _inherits3.default)(SidebarLayout, _React$Component);

  function SidebarLayout() {
    (0, _classCallCheck3.default)(this, SidebarLayout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SidebarLayout).apply(this, arguments));
  }

  (0, _createClass3.default)(SidebarLayout, [{
    key: 'render',
    value: function render() {
      var _props$children = (0, _toArray3.default)(this.props.children);

      var sidebar = _props$children[0];

      var content = _props$children.slice(1);

      return _react2.default.createElement(
        'div',
        { className: 'container', __source: {
            fileName: _jsxFileName,
            lineNumber: 8
          }
        },
        _react2.default.createElement(
          'div',
          { className: 'row', __source: {
              fileName: _jsxFileName,
              lineNumber: 9
            }
          },
          _react2.default.createElement(
            'div',
            { className: 'col-sm-3 sidebar', __source: {
                fileName: _jsxFileName,
                lineNumber: 10
              }
            },
            sidebar
          ),
          _react2.default.createElement(
            'div',
            { className: 'col-sm-9 content', __source: {
                fileName: _jsxFileName,
                lineNumber: 13
              }
            },
            content
          )
        )
      );
    }
  }]);
  return SidebarLayout;
})(_react2.default.Component);

SidebarLayout.propTypes = {
  children: _react2.default.PropTypes.node
};

exports.default = SidebarLayout;