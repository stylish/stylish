'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Icon = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Icon = exports.Icon = function Icon() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var className = [props.className || '', 'icon', 'icon-' + props.icon].join(' ');
  return _react2.default.createElement('span', { className: className });
};

Icon.propTypes = {
  icon: _react2.default.PropTypes.string.isRequired,
  className: _react2.default.PropTypes.string
};

exports.default = Icon;