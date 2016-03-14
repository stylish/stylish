'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/CardsContainer/index.js';
exports.CardsContainer = CardsContainer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Col = require('react-bootstrap/lib/Col');

var _Col2 = _interopRequireDefault(_Col);

var _Grid = require('react-bootstrap/lib/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Row = require('react-bootstrap/lib/Row');

var _Row2 = _interopRequireDefault(_Row);

var _range = require('lodash/range');

var _range2 = _interopRequireDefault(_range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The CardsContainer aligns a list of items in a grid pattern.
*/
function CardsContainer() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var num = props.perRow || 4;
  var items = each_cons(_react.Children.toArray(props.children), num);
  var wrapper = props.wrapper ? props.wrapper : undefined;

  var colSize = 12 / num;

  var rows = items.map(function (row, i) {
    var columns = row.map(function (_item, j) {
      var item = wrapper ? _react2.default.createElement(
        'wrapper',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 22
          }
        },
        _item
      ) : _item;

      return _react2.default.createElement(
        _Col2.default,
        { key: j, xs: colSize, __source: {
            fileName: _jsxFileName,
            lineNumber: 26
          }
        },
        item
      );
    });

    return _react2.default.createElement(
      _Row2.default,
      { key: i, __source: {
          fileName: _jsxFileName,
          lineNumber: 31
        }
      },
      columns
    );
  });

  return _react2.default.createElement(
    _Grid2.default,
    {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 35
      }
    },
    rows
  );
}

exports.default = CardsContainer;

// investigate whether it is better to use lodash.chunk which i discovered after this solution

function each_cons(list, size) {
  var groupsCount = list.length <= size ? 1 : list.length / size;

  return (0, _range2.default)(0, groupsCount).reduce(function (m, s, k) {
    var beginAt = s * size;
    var endAt = size * (s + 1);

    m.push(list.slice(beginAt, endAt));

    return m;
  }, []);
}