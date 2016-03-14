'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _jsxFileName = 'src/components/Icon/index.js';
exports.Icon = Icon;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Sizes = ['small', 'medium', 'large'];

function Icon() {
  var _cx;

  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var icon = props.icon;
  var size = props.size;
  var inverse = props.inverse;

  var sizeClass = size ? 'icon-' + size : 'icon-default';

  var classes = (0, _classnames2.default)((_cx = {
    icon: true
  }, (0, _defineProperty3.default)(_cx, 'icon-' + icon, true), (0, _defineProperty3.default)(_cx, sizeClass, sizeClass), (0, _defineProperty3.default)(_cx, 'inverse', inverse), _cx));

  return _react2.default.createElement('span', (0, _extends3.default)({}, props, { className: classes, __source: {
      fileName: _jsxFileName,
      lineNumber: 25
    }
  }));
}

exports.default = Icon;

Icon.Sizes = Sizes;

Icon.propTypes = {
  icon: _react.PropTypes.string.isRequired,
  size: _react.PropTypes.oneOf(Sizes),
  inverse: _react.PropTypes.bool
};