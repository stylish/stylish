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

var _jsxFileName = 'src/ui/layouts/FluidLayout.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FluidTopNavbar = require('../components/FluidTopNavbar');

var _FluidTopNavbar2 = _interopRequireDefault(_FluidTopNavbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FluidLayout = exports.FluidLayout = (function (_Component) {
  (0, _inherits3.default)(FluidLayout, _Component);

  function FluidLayout() {
    (0, _classCallCheck3.default)(this, FluidLayout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FluidLayout).apply(this, arguments));
  }

  (0, _createClass3.default)(FluidLayout, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var navigation = _props.navigation;
      var branding = _props.branding;
      var searchForm = _props.searchForm;
      var links = navigation.links;

      return _react2.default.createElement(
        'div',
        { className: 'fluid-layout', __source: {
            fileName: _jsxFileName,
            lineNumber: 48
          }
        },
        _react2.default.createElement(_FluidTopNavbar2.default, { searchForm: searchForm, branding: branding, links: links, __source: {
            fileName: _jsxFileName,
            lineNumber: 49
          }
        }),
        _react2.default.createElement(
          'div',
          { className: 'container-fluid container-fluid-spacious', __source: {
              fileName: _jsxFileName,
              lineNumber: 51
            }
          },
          this.props.children
        )
      );
    }
  }]);
  return FluidLayout;
})(_react.Component);

FluidLayout.displayName = 'FluidLayout';
FluidLayout.propTypes = {
  branding: _react.PropTypes.shape({
    icon: _react.PropTypes.string,
    style: _react.PropTypes.string,
    brand: _react.PropTypes.string
  }),
  children: _react.PropTypes.node.isRequired,
  containerClassName: _react.PropTypes.string,
  searchForm: _react.PropTypes.node,
  navigation: _react.PropTypes.shape({
    links: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      icon: _react.PropTypes.string,
      label: _react.PropTypes.string,
      link: _react.PropTypes.string
    }))
  })
};
FluidLayout.defaultProps = {
  searchForm: _react2.default.createElement('div', {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    }
  }),
  branding: {
    icon: 'rocket',
    style: 'default',
    brand: 'Skypager'
  },
  navigation: {
    links: [{
      label: 'Home',
      link: '/',
      icon: 'home'
    }]
  }
};
exports.default = FluidLayout;