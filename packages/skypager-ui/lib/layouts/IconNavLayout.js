'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconNavLayout = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _jsxFileName = 'src/layouts/IconNavLayout.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

var _IconNav = require('../components/IconNav');

var _IconNav2 = _interopRequireDefault(_IconNav);

var _IconNavLayoutCss = require('./IconNavLayout.css.less');

var _IconNavLayoutCss2 = _interopRequireDefault(_IconNavLayoutCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IconNavLayout = exports.IconNavLayout = (function (_React$Component) {
  (0, _inherits3.default)(IconNavLayout, _React$Component);

  function IconNavLayout() {
    (0, _classCallCheck3.default)(this, IconNavLayout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(IconNavLayout).apply(this, arguments));
  }

  (0, _createClass3.default)(IconNavLayout, [{
    key: 'render',
    value: function render() {
      var classes = (0, _classnames3.default)((0, _defineProperty3.default)({
        'with-iconav': true,
        'iconav-wide': this.props.wide
      }, _IconNavLayoutCss2.default.wrapper, true));

      var _props = this.props;
      var brandStyle = _props.brandStyle;
      var brandIcon = _props.brandIcon;
      var children = _props.children;
      var containerClassName = _props.containerClassName;
      var links = _props.links;

      return _react2.default.createElement(
        'div',
        { className: classes, __source: {
            fileName: _jsxFileName,
            lineNumber: 35
          }
        },
        _react2.default.createElement(_IconNav2.default, { brandStyle: brandStyle,
          brandIcon: brandIcon,
          links: links, __source: {
            fileName: _jsxFileName,
            lineNumber: 36
          }
        }),
        _react2.default.createElement(
          'div',
          { className: containerClassName || 'container', __source: {
              fileName: _jsxFileName,
              lineNumber: 40
            }
          },
          children
        )
      );
    }
  }]);
  return IconNavLayout;
})(_react2.default.Component);

IconNavLayout.displayName = 'IconNavLayout';
IconNavLayout.propTypes = {
  children: _react.PropTypes.node.isRequired,
  wide: _react.PropTypes.bool,
  containerClassName: _react.PropTypes.string,
  links: _react.PropTypes.array.isRequired,
  brandIcon: _react.PropTypes.string,
  brandStyle: _react.PropTypes.string
};
exports.default = IconNavLayout;