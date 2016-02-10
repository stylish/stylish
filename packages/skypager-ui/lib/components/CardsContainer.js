'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/CardsContainer.js';
exports.CardsContainer = CardsContainer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CardsContainer() {
  var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var num = props.perRow || 4;
  var items = each_cons(_react.Children.toArray(props.children), num);

  var colSize = 12 / num;

  var rows = items.map(function (row, i) {
    var columns = row.map(function (item, j) {
      return _react2.default.createElement(
        _reactBootstrap.Col,
        { key: j, xs: colSize, __source: {
            fileName: _jsxFileName,
            lineNumber: 14
          }
        },
        item
      );
    });

    return _react2.default.createElement(
      _reactBootstrap.Row,
      { key: i, __source: {
          fileName: _jsxFileName,
          lineNumber: 17
        }
      },
      columns
    );
  });

  return _react2.default.createElement(
    _reactBootstrap.Grid,
    {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 20
      }
    },
    rows
  );
}

exports.default = CardsContainer;

function each_cons(list, size) {
  var groupsCount = list.length <= size ? 1 : list.length / size;

  return (0, _lodash.range)(0, groupsCount).reduce(function (m, s, k) {
    var beginAt = s * size;
    var endAt = size * (s + 1);

    m.push(list.slice(beginAt, endAt));

    return m;
  }, []);
}