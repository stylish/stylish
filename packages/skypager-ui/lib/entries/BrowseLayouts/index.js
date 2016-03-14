'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BrowseLayouts = undefined;

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

var _jsxFileName = 'src/entries/BrowseLayouts/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stateful = require('ui/util/stateful');

var _stateful2 = _interopRequireDefault(_stateful);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BrowseLayouts = exports.BrowseLayouts = (function (_Component) {
  (0, _inherits3.default)(BrowseLayouts, _Component);

  function BrowseLayouts() {
    (0, _classCallCheck3.default)(this, BrowseLayouts);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BrowseLayouts).apply(this, arguments));
  }

  (0, _createClass3.default)(BrowseLayouts, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 11
          }
        },
        'BrowseLayouts'
      );
    }
  }]);
  return BrowseLayouts;
})(_react.Component);

BrowseLayouts.displayName = 'BrowseLayouts';
BrowseLayouts.propTypes = {};
exports.default = (0, _stateful2.default)(BrowseLayouts, 'settings');