'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultLayout = undefined;

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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _FluidLayout = require('ui/layouts/FluidLayout');

var _FluidLayout2 = _interopRequireDefault(_FluidLayout);

var _BasicFluidLayout = require('ui/layouts/BasicFluidLayout');

var _BasicFluidLayout2 = _interopRequireDefault(_BasicFluidLayout);

var _IconNavLayout = require('ui/layouts/IconNavLayout');

var _IconNavLayout2 = _interopRequireDefault(_IconNavLayout);

var _stateful = require('../applications/util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var layouts = {
  fluid: _FluidLayout2.default,
  iconNav: _IconNavLayout2.default,
  icon: _IconNavLayout2.default,
  basicFluid: _BasicFluidLayout2.default,
  basic: _BasicFluidLayout2.default
};

var DefaultLayout = exports.DefaultLayout = (function (_Component) {
  (0, _inherits3.default)(DefaultLayout, _Component);

  function DefaultLayout() {
    (0, _classCallCheck3.default)(this, DefaultLayout);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DefaultLayout).apply(this, arguments));
  }

  (0, _createClass3.default)(DefaultLayout, [{
    key: 'render',
    value: function render() {
      var settings = this.props.settings;

      var layoutComponent = settings.layout && layouts[settings.layout] ? layouts[settings.layout] : _BasicFluidLayout2.default;

      return _react2.default.createElement(layoutComponent, {
        settings: settings
      }, this.props.children);
    }
  }]);
  return DefaultLayout;
})(_react.Component);

DefaultLayout.displayName = 'DefaultLayout';
exports.default = (0, _stateful2.default)(DefaultLayout, 'settings');