'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Block = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _jsxFileName = 'src/ui/components/Block/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames2 = require('classnames');

var _classnames3 = _interopRequireDefault(_classnames2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Block = exports.Block = (function (_Component) {
  (0, _inherits3.default)(Block, _Component);

  function Block() {
    (0, _classCallCheck3.default)(this, Block);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Block).apply(this, arguments));
  }

  (0, _createClass3.default)(Block, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var bordered = _props.bordered;
      var angled = _props.angled;
      var background = _props.background;
      var fillHeight = _props.fillHeight;
      var title = _props.title;
      var text = _props.text;
      var children = _props.children;
      var inverse = _props.inverse;
      var centerText = _props.centerText;
      var muteText = _props.muteText;

      var classes = (0, _classnames3.default)({
        'block': true,
        'block-inverse': inverse,
        'text-center': centerText,
        'block-bordered': bordered,
        'block-angled': angled,
        'block-fill-height': fillHeight
      });

      // TODO: Look into sensible defaults
      var textMargin = 'm-b-md';

      var textClasses = (0, _classnames3.default)((0, _defineProperty3.default)({
        'muted-text': muteText
      }, textMargin, true));

      var titleEl = title ? _react2.default.createElement(
        'h1',
        { className: 'block-title', __source: {
            fileName: _jsxFileName,
            lineNumber: 50
          }
        },
        title
      ) : null;
      var textEl = text ? _react2.default.createElement(
        'h4',
        { className: textClasses, __source: {
            fileName: _jsxFileName,
            lineNumber: 51
          }
        },
        text
      ) : null;

      return _react2.default.createElement(
        'div',
        { className: classes, __source: {
            fileName: _jsxFileName,
            lineNumber: 54
          }
        },
        _react2.default.createElement(
          'div',
          { className: 'block-foreground', __source: {
              fileName: _jsxFileName,
              lineNumber: 55
            }
          },
          titleEl,
          textEl,
          children
        ),
        _react2.default.createElement(
          'div',
          { className: 'block-background', __source: {
              fileName: _jsxFileName,
              lineNumber: 60
            }
          },
          background
        )
      );
    }
  }]);
  return Block;
})(_react.Component);

Block.displayName = 'Block';
Block.propTypes = {
  inverse: _react.PropTypes.bool,
  text: _react.PropTypes.string,
  title: _react.PropTypes.string,
  muteText: _react.PropTypes.bool,
  centerText: _react.PropTypes.bool,
  background: _react.PropTypes.element,
  children: _react.PropTypes.node,
  angled: _react.PropTypes.bool,
  bordered: _react.PropTypes.bool,
  fillHeight: _react.PropTypes.bool
};
Block.defaultProps = {
  inverse: false,
  muteText: true,
  centerText: true,
  bordered: false,
  angled: false,
  fillHeight: false
};
exports.default = Block;