'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVG = SVG;

var _react = require('react');

function SVG() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return (0, _react.createElement)(props.tag || 'svg', {
    className: props.className,
    dangerouslySetInnerHTML: { __html: props.raw }
  });
}

SVG.propTypes = {
  tag: _react.PropTypes.string,
  raw: _react.PropTypes.string.isRequired
};

exports.default = SVG;