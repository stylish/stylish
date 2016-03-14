'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _jsxFileName = 'src/components/AutoGrid/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Automatically renders an array of elements in an evenly spaced grid
 */

var AutoGrid = (function (_Component) {
  (0, _inherits3.default)(AutoGrid, _Component);

  function AutoGrid() {
    (0, _classCallCheck3.default)(this, AutoGrid);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AutoGrid).apply(this, arguments));
  }

  (0, _createClass3.default)(AutoGrid, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        CardsContainer,
        { wrapper: this.props.wrapper, perRow: this.props.columns, __source: {
            fileName: _jsxFileName,
            lineNumber: 26
          }
        },
        this.props.children
      );
    }
  }]);
  return AutoGrid;
})(_react.Component);

AutoGrid.displayName = 'AutoGrid';
AutoGrid.propTypes = {
  /** children will automatically be wrapped in rows and columns */
  children: _react.PropTypes.node.isRequired,

  /** how many items per row */
  columns: _react.PropTypes.number,

  /** wrap each child in this wrapper component */
  wrapper: _react.PropTypes.element
};
AutoGrid.defaultProps = {
  columns: 4
};
exports.default = AutoGrid;