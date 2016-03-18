'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/CodeHighlighter/index.js';
exports.default = CodeHighlighter;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactHighlight = require('react-highlight');

var _reactHighlight2 = _interopRequireDefault(_reactHighlight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Displays a Code snippet using Highlight.js
* */
function CodeHighlighter() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var language = props.language;
  var code = props.code;
  var theme = props.theme;

  require('!!style!css!highlight.js/styles/' + theme + '.css');

  return _react2.default.createElement(
    _reactHighlight2.default,
    { className: language, __source: {
        fileName: _jsxFileName,
        lineNumber: 13
      }
    },
    '' + code
  );
}

CodeHighlighter.defaultProps = {
  language: 'javascript',
  theme: 'solarized_dark'
};

CodeHighlighter.propTypes = {
  /** the language is the code written in */
  language: _react.PropTypes.string.isRequired,
  /** the code you want to highlight */
  code: _react.PropTypes.string.isRequired,
  /** the theme to use */
  theme: _react.PropTypes.string
};