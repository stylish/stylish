'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainLayout = undefined;

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

var _jsxFileName = 'src/ui/layouts/DefaultLayout.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _IconNavLayout = require('ui/layouts/IconNavLayout');

var _IconNavLayout2 = _interopRequireDefault(_IconNavLayout);

var _bundle = require('dist/bundle');

var _bundle2 = _interopRequireDefault(_bundle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MainLayout = exports.MainLayout = (function (_Component) {
  (0, _inherits3.default)(MainLayout, _Component);

  function MainLayout() {
    (0, _classCallCheck3.default)(this, MainLayout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MainLayout).apply(this, arguments));
  }

  (0, _createClass3.default)(MainLayout, [{
    key: 'render',
    value: function render() {
      var settings = _bundle2.default.settings;
      var branding = settings.branding;
      var navigation = settings.navigation;

      console.log(settings);

      return _react2.default.createElement(
        _IconNavLayout2.default,
        { wide: true, brandIcon: branding.icon, links: navigation.links, __source: {
            fileName: _jsxFileName,
            lineNumber: 16
          }
        },
        this.props.children
      );
    }
  }]);
  return MainLayout;
})(_react.Component);

MainLayout.displayName = 'MainLayout';
exports.default = MainLayout;