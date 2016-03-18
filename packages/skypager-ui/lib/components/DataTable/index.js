'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataTable = undefined;

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

var _jsxFileName = 'src/components/DataTable/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _get = require('lodash/get');

var _get2 = _interopRequireDefault(_get);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataTable = exports.DataTable = (function (_Component) {
  (0, _inherits3.default)(DataTable, _Component);

  function DataTable() {
    (0, _classCallCheck3.default)(this, DataTable);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DataTable).apply(this, arguments));
  }

  (0, _createClass3.default)(DataTable, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'table-full', __source: {
            fileName: _jsxFileName,
            lineNumber: 33
          }
        },
        _react2.default.createElement(
          'div',
          { className: 'table-responsive', __source: {
              fileName: _jsxFileName,
              lineNumber: 34
            }
          },
          _react2.default.createElement(
            'table',
            { className: 'table', __source: {
                fileName: _jsxFileName,
                lineNumber: 35
              }
            },
            _react2.default.createElement(
              'thead',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 36
                }
              },
              _react2.default.createElement(
                'tr',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 37
                  }
                },
                this.tableColumns
              )
            ),
            _react2.default.createElement(
              'tbody',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 39
                }
              },
              this.tableRows
            )
          )
        )
      );
    }
  }, {
    key: 'tableColumns',
    get: function get() {
      return this.props.columns.map(function (_ref, key) {
        var label = _ref.label;
        var width = _ref.width;
        return _react2.default.createElement(
          'th',
          { key: key, __source: {
              fileName: _jsxFileName,
              lineNumber: 23
            }
          },
          label
        );
      });
    }
  }, {
    key: 'tableRows',
    get: function get() {
      var _this2 = this;

      return this.props.records.map(function (record, index) {
        return _react2.default.createElement(
          'tr',
          { key: index, index: index, __source: {
              fileName: _jsxFileName,
              lineNumber: 28
            }
          },
          buildRow(record, _this2.props.columns)
        );
      });
    }
  }]);
  return DataTable;
})(_react.Component);

DataTable.displayName = 'DataTable';
DataTable.propTypes = {
  /** column configuration */
  columns: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    label: _react.PropTypes.string.isRequired,
    field: _react.PropTypes.string.isRequired,
    width: _react.PropTypes.number
  })).isRequired,

  /** an array of records to be put in the columns */
  records: _react.PropTypes.array.isRequired
};
exports.default = DataTable;

function buildRow(record, columns) {
  return columns.map(function (column, columnIndex) {
    return _react2.default.createElement(
      'td',
      { key: columnIndex, columnIndex: columnIndex, __source: {
          fileName: _jsxFileName,
          lineNumber: 53
        }
      },
      buildColumn(record, column, columnIndex)
    );
  });
}

function buildColumn(record, columnConfig) {
  console.log('record', record, columnConfig);
  return _react2.default.createElement(
    'div',
    {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 59
      }
    },
    (0, _get2.default)(record, columnConfig.field)
  );
}