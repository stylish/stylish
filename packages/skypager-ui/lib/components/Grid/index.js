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

var _jsxFileName = 'src/components/Grid/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _chunk = require('lodash/chunk');

var _chunk2 = _interopRequireDefault(_chunk);

var _Col = require('react-bootstrap/lib/Col');

var _Col2 = _interopRequireDefault(_Col);

var _Grid2 = require('react-bootstrap/lib/Grid');

var _Grid3 = _interopRequireDefault(_Grid2);

var _Row = require('react-bootstrap/lib/Row');

var _Row2 = _interopRequireDefault(_Row);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Renders its children as row of grid columns.
 *
 * For multiple rows, expects children which contain children. array of arrays.
 */

var Grid = (function (_Component) {
  (0, _inherits3.default)(Grid, _Component);

  function Grid() {
    (0, _classCallCheck3.default)(this, Grid);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Grid).apply(this, arguments));
  }

  (0, _createClass3.default)(Grid, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 32
        }
      });
    }
  }]);
  return Grid;
})(_react.Component);

/** expose access to the bootstrap grid class */

Grid.displayName = 'Grid';
Grid.propTypes = {
  /** how many columns is this grid */
  columns: _react.PropTypes.number.isRequired,

  /** controls the column width, if not evenly spaced */
  columnWidths: _react.PropTypes.arrayOf(_react.PropTypes.number),

  /** the elements that will be wrapped as a grid */
  children: _react.PropTypes.node.isRequired,

  /** set hasRows to true if the children is an array of columns */
  hasRows: _react.PropTypes.bool
};
exports.default = Grid;
Grid.Grid = _Grid3.default;
Grid.Col = _Col2.default;
Grid.Row = _Row2.default;