'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlideDrawer = undefined;

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

var _jsxFileName = 'src/ui/components/SlideDrawer.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

var _SlideDrawerCss = require('./SlideDrawer.css.less');

var _SlideDrawerCss2 = _interopRequireDefault(_SlideDrawerCss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SlideDrawer = exports.SlideDrawer = (function (_React$Component) {
  (0, _inherits3.default)(SlideDrawer, _React$Component);

  function SlideDrawer() {
    (0, _classCallCheck3.default)(this, SlideDrawer);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SlideDrawer).apply(this, arguments));
  }

  (0, _createClass3.default)(SlideDrawer, [{
    key: 'render',
    value: function render() {
      var _cx;

      var classes = (0, _classnames2.default)((_cx = {}, (0, _defineProperty3.default)(_cx, 'position-' + this.props.position || 'right', true), (0, _defineProperty3.default)(_cx, _SlideDrawerCss2.default.drawer, true), (0, _defineProperty3.default)(_cx, _SlideDrawerCss2.default.light, true), (0, _defineProperty3.default)(_cx, 'slide-drawer', true), (0, _defineProperty3.default)(_cx, 'active', this.props.active), _cx));

      return _react2.default.createElement(
        'div',
        { className: classes, __source: {
            fileName: _jsxFileName,
            lineNumber: 19
          }
        },
        _react2.default.createElement(
          'div',
          { className: _SlideDrawerCss2.default.inner, __source: {
              fileName: _jsxFileName,
              lineNumber: 20
            }
          },
          _react2.default.createElement(
            'div',
            { onClick: this.props.handleCloseClick, __source: {
                fileName: _jsxFileName,
                lineNumber: 21
              }
            },
            _react2.default.createElement(_Icon2.default, { className: 'close-icon', icon: 'cross', __source: {
                fileName: _jsxFileName,
                lineNumber: 22
              }
            })
          ),
          this.props.children
        )
      );
    }
  }]);
  return SlideDrawer;
})(_react2.default.Component);

SlideDrawer.propTypes = {
  position: _react2.default.PropTypes.string
};

exports.default = SlideDrawer;