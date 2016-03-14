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

var _jsxFileName = 'src/layouts/IconNavLayout/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _IconNav = require('ui/components/IconNav');

var _IconNav2 = _interopRequireDefault(_IconNav);

var _style = require('./style.less');

var _style2 = _interopRequireDefault(_style);

var _stateful = require('ui/util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

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
      var _classnames2;

      var _props = this.props;
      var settings = _props.settings;
      var children = _props.children;
      var containerClassName = _props.containerClassName;
      var branding = settings.branding;
      var navigation = settings.navigation;

      var classes = (0, _classnames4.default)((0, _defineProperty3.default)({
        'iconav-layout': true,
        'with-iconav': true,
        'iconav-wide': this.props.wide !== false && !this.props.thin
      }, _style2.default.wrapper, true));

      var containerClasses = (0, _classnames4.default)((_classnames2 = {}, (0, _defineProperty3.default)(_classnames2, containerClassName, true), (0, _defineProperty3.default)(_classnames2, 'iconav-container', true), _classnames2));

      return _react2.default.createElement(
        'div',
        { className: classes, __source: {
            fileName: _jsxFileName,
            lineNumber: 53
          }
        },
        _react2.default.createElement(_IconNav2.default, { brandStyle: branding.style,
          brandIcon: branding.icon,
          links: navigation.links, __source: {
            fileName: _jsxFileName,
            lineNumber: 54
          }
        }),
        _react2.default.createElement(
          'div',
          { className: containerClasses, __source: {
              fileName: _jsxFileName,
              lineNumber: 58
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
  containerClassName: _react.PropTypes.string,
  settings: _react.PropTypes.shape({
    navigation: _react.PropTypes.shape({
      links: _react.PropTypes.array
    }),
    branding: _react.PropTypes.shape({
      icon: _react.PropTypes.string,
      brand: _react.PropTypes.string,
      style: _react.PropTypes.string
    })
  }).isRequired,
  thin: _react.PropTypes.bool,
  wide: _react.PropTypes.bool
};
IconNavLayout.defaultProps = {
  wide: true,
  thin: false,
  containerClassName: 'container'
};
exports.default = (0, _stateful2.default)(IconNavLayout, 'settings');