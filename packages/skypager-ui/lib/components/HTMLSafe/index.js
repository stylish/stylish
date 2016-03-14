'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLSafe = HTMLSafe;

var _react = require('react');

function HTMLSafe(_ref) {
  var _ref$html = _ref.html;
  var html = _ref$html === undefined ? '' : _ref$html;
  var _ref$tag = _ref.tag;
  var tag = _ref$tag === undefined ? 'div' : _ref$tag;
  var _ref$className = _ref.className;
  var className = _ref$className === undefined ? 'html-wrapper' : _ref$className;

  return (0, _react.createElement)(tag || 'div', {
    className: className,
    dangerouslySetInnerHTML: { __html: html }
  });
}

HTMLSafe.propTypes = {
  tag: _react.PropTypes.string,
  html: _react.PropTypes.string.isRequired
};

exports.default = HTMLSafe;