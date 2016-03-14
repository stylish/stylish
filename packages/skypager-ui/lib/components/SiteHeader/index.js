'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SiteHeader = undefined;

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

var _jsxFileName = 'src/components/SiteHeader/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _applications = require('ui/applications');

var _Icon = require('ui/components/Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SiteHeader = exports.SiteHeader = (function (_Component) {
  (0, _inherits3.default)(SiteHeader, _Component);

  function SiteHeader() {
    (0, _classCallCheck3.default)(this, SiteHeader);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SiteHeader).apply(this, arguments));
  }

  (0, _createClass3.default)(SiteHeader, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var copy = _props.copy;
      var branding = _props.branding;
      var brand = branding.brand;
      var icon = branding.icon;

      return _react2.default.createElement(
        'div',
        { className: 'site-header', __source: {
            fileName: _jsxFileName,
            lineNumber: 22
          }
        },
        _react2.default.createElement(
          'h1',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 23
            }
          },
          _react2.default.createElement(_Icon2.default, { icon: icon, __source: {
              fileName: _jsxFileName,
              lineNumber: 24
            }
          }),
          ' ',
          brand
        )
      );
    }
  }]);
  return SiteHeader;
})(_react.Component);

SiteHeader.displayName = 'SiteHeader';
SiteHeader.propTypes = {
  branding: _react.PropTypes.shape({
    brand: _react.PropTypes.string.isRequired,
    icon: _react.PropTypes.string
  }),
  copy: _react.PropTypes.object.isRequired
};
exports.default = (0, _applications.stateful)(SiteHeader, 'settings.branding', 'copy');