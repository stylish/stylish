'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SidebarNav = undefined;

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

var _jsxFileName = 'src/ui/components/SidebarNav.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SidebarNav = exports.SidebarNav = (function (_React$Component) {
  (0, _inherits3.default)(SidebarNav, _React$Component);

  function SidebarNav() {
    (0, _classCallCheck3.default)(this, SidebarNav);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SidebarNav).apply(this, arguments));
  }

  (0, _createClass3.default)(SidebarNav, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'nav',
        { className: 'sidebar-nav', __source: {
            fileName: _jsxFileName,
            lineNumber: 9
          }
        },
        _react2.default.createElement(
          'div',
          { className: 'sidebar-header', __source: {
              fileName: _jsxFileName,
              lineNumber: 10
            }
          },
          _react2.default.createElement(
            'button',
            { className: 'nav-toggler nav-toggler-sm sidebar-toggler', type: 'button', 'data-toggle': 'collapse', 'data-target': '#nav-toggleable-sm', __source: {
                fileName: _jsxFileName,
                lineNumber: 11
              }
            },
            _react2.default.createElement(
              'span',
              { className: 'sr-only', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 12
                }
              },
              'Toggle nav'
            )
          ),
          _react2.default.createElement(
            _reactRouter.Link,
            { className: 'sidebar-brand img-responsive', to: '/', __source: {
                fileName: _jsxFileName,
                lineNumber: 14
              }
            },
            _react2.default.createElement(_index.Icon, { icon: 'leaf', className: 'sidebar-brand-icon', __source: {
                fileName: _jsxFileName,
                lineNumber: 15
              }
            })
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'collapse nav-toggleable-sm', id: 'nav-toggleable-sm', __source: {
              fileName: _jsxFileName,
              lineNumber: 19
            }
          },
          _react2.default.createElement(_index.SidebarSearchForm, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 20
            }
          }),
          _react2.default.createElement(
            'ul',
            { className: 'nav nav-pills nav-stacked', __source: {
                fileName: _jsxFileName,
                lineNumber: 22
              }
            },
            this.props.children
          )
        )
      );
    }
  }]);
  return SidebarNav;
})(_react2.default.Component);

SidebarNav.propTypes = {
  children: _react2.default.PropTypes.array
};

exports.default = SidebarNav;