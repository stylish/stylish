'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BasicFluidLayout = undefined;

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

var _jsxFileName = 'src/ui/layouts/BasicFluidLayout.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicFluidLayout = exports.BasicFluidLayout = (function (_Component) {
  (0, _inherits3.default)(BasicFluidLayout, _Component);

  function BasicFluidLayout() {
    (0, _classCallCheck3.default)(this, BasicFluidLayout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BasicFluidLayout).apply(this, arguments));
  }

  (0, _createClass3.default)(BasicFluidLayout, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var navigation = _props.navigation;
      var branding = _props.branding;
      var searchForm = _props.searchForm;

      return _react2.default.createElement(
        'div',
        { className: 'fluid-layout', __source: {
            fileName: _jsxFileName,
            lineNumber: 36
          }
        },
        _react2.default.createElement(
          'div',
          { className: 'container-fluid container-fluid-spacious', __source: {
              fileName: _jsxFileName,
              lineNumber: 37
            }
          },
          this.props.children
        )
      );
    }
  }]);
  return BasicFluidLayout;
})(_react.Component);

BasicFluidLayout.displayName = 'BasicFluidLayout';
BasicFluidLayout.propTypes = {
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
BasicFluidLayout.defaultProps = {
  branding: {
    icon: 'rocket',
    style: 'default',
    brand: 'Skypager'
  }
};
exports.default = BasicFluidLayout;