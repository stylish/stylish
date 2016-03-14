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

var _jsxFileName = 'src/components/SidebarNav/index.js';

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
            lineNumber: 17
          }
        },
        this.props.header,
        _react2.default.createElement(
          'div',
          { className: 'nav-toggleable-sm', id: 'nav-toggleable-sm', __source: {
              fileName: _jsxFileName,
              lineNumber: 20
            }
          },
          this.props.searchForm,
          _react2.default.createElement(
            'ul',
            { className: 'nav nav-pills nav-stacked', __source: {
                fileName: _jsxFileName,
                lineNumber: 23
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

SidebarNav.displayName = 'SidebarNav';
SidebarNav.propTypes = {
  children: _react.PropTypes.node,
  header: _react.PropTypes.element,
  searchForm: _react.PropTypes.element
};
exports.default = SidebarNav;

var SidebarNavHeader = (function (_Component) {
  (0, _inherits3.default)(SidebarNavHeader, _Component);

  function SidebarNavHeader() {
    (0, _classCallCheck3.default)(this, SidebarNavHeader);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SidebarNavHeader).apply(this, arguments));
  }

  (0, _createClass3.default)(SidebarNavHeader, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'sidebar-header', __source: {
            fileName: _jsxFileName,
            lineNumber: 43
          }
        },
        _react2.default.createElement(
          'button',
          { className: 'nav-toggler nav-toggler-sm sidebar-toggler', type: 'button', 'data-toggle': 'collapse', 'data-target': '#nav-toggleable-sm', __source: {
              fileName: _jsxFileName,
              lineNumber: 44
            }
          },
          _react2.default.createElement(
            'span',
            { className: 'sr-only', __source: {
                fileName: _jsxFileName,
                lineNumber: 45
              }
            },
            'Toggle nav'
          )
        ),
        _react2.default.createElement(
          _reactRouter.Link,
          { className: 'sidebar-brand img-responsive', to: '/', __source: {
              fileName: _jsxFileName,
              lineNumber: 47
            }
          },
          _react2.default.createElement(_index.Icon, { icon: this.props.icon, className: 'sidebar-brand-icon', __source: {
              fileName: _jsxFileName,
              lineNumber: 48
            }
          })
        )
      );
    }
  }]);
  return SidebarNavHeader;
})(_react.Component);

SidebarNavHeader.displayName = 'SidebarNavHeader';
SidebarNavHeader.propTypes = {
  icon: _react.PropTypes.string
};

var SidebarNavLink = (function (_React$Component2) {
  (0, _inherits3.default)(SidebarNavLink, _React$Component2);

  function SidebarNavLink() {
    (0, _classCallCheck3.default)(this, SidebarNavLink);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SidebarNavLink).apply(this, arguments));
  }

  (0, _createClass3.default)(SidebarNavLink, [{
    key: 'render',
    value: function render() {
      var icon = this.props.icon ? _react2.default.createElement(_index.Icon, { icon: this.props.icon, __source: {
          fileName: _jsxFileName,
          lineNumber: 59
        }
      }) : null;

      return _react2.default.createElement(
        'li',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 62
          }
        },
        _react2.default.createElement(
          _reactRouter.Link,
          { to: this.props.to, __source: {
              fileName: _jsxFileName,
              lineNumber: 63
            }
          },
          this.props.label
        )
      );
    }
  }]);
  return SidebarNavLink;
})(_react2.default.Component);

SidebarNavLink.displayName = 'SidebarNavLink';

SidebarNav.Link = SidebarNavLink;
SidebarNav.Header = SidebarNavHeader;