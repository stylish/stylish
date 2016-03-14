'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeatureList = undefined;

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

var _jsxFileName = 'src/components/FeatureList/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _Grid = require('react-bootstrap/lib/Grid');

var _Grid2 = _interopRequireDefault(_Grid);

var _Row = require('react-bootstrap/lib/Row');

var _Row2 = _interopRequireDefault(_Row);

var _Col = require('react-bootstrap/lib/Col');

var _Col2 = _interopRequireDefault(_Col);

var _chunk = require('lodash/chunk');

var _chunk2 = _interopRequireDefault(_chunk);

var _times = require('lodash/times');

var _times2 = _interopRequireDefault(_times);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The FeatureList displays content tiles that consist of
 * a large icon, a title, and short paragraphs. Perfect for describing
 * a list of features or highlights.
 */

var FeatureList = exports.FeatureList = (function (_Component) {
  (0, _inherits3.default)(FeatureList, _Component);

  function FeatureList() {
    (0, _classCallCheck3.default)(this, FeatureList);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FeatureList).apply(this, arguments));
  }

  (0, _createClass3.default)(FeatureList, [{
    key: 'render',
    value: function render() {
      var columns = this.props.columns;

      var xs = 12 / columns;
      var md = 12 / columns;

      return _react2.default.createElement(
        _Grid2.default,
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 71
          }
        },
        _react2.default.createElement(
          _Row2.default,
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 72
            }
          },
          this.lists.map(function (list, key) {
            return _react2.default.createElement(
              _Col2.default,
              { key: key, xs: xs, md: md, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 75
                }
              },
              list
            );
          })
        )
      );
    }
  }, {
    key: 'lists',

    /** Returns <ul> lists containing feature tiles */
    get: function get() {
      var _props = this.props;
      var bordered = _props.bordered;
      var columns = _props.columns;
      var features = _props.features;
      var spacer = _props.spacer;

      var classes = (0, _classnames2.default)({
        'featured-list': true,
        'featured-list-bordered': bordered
      });

      var groups = (0, _chunk2.default)(features, columns);

      return (0, _times2.default)(columns).map(function (i) {
        return _react2.default.createElement(
          'ul',
          { key: i, className: classes, __source: {
              fileName: _jsxFileName,
              lineNumber: 59
            }
          },
          groups.map(function (items, pos) {
            return _react2.default.createElement(FeatureTile, { item: items[i], key: pos, pos: pos, spacer: spacer, __source: {
                fileName: _jsxFileName,
                lineNumber: 60
              }
            });
          })
        );
      });
    }
  }]);
  return FeatureList;
})(_react.Component);

FeatureList.displayName = 'FeatureList';
FeatureList.propTypes = {
  /** use a border around the icons */
  bordered: _react.PropTypes.bool,

  /** how many columns to display? two or three */
  columns: _react.PropTypes.number,

  /** a spacing class to apply to each feature tile */
  spacer: _react.PropTypes.string,

  /** an array of objects which will be rendered as tiles */
  features: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    /** the icon which represents a feature */
    icon: _react.PropTypes.string.isRequired,
    /** A short descriptive title for this feature */
    title: _react.PropTypes.string.isRequired,
    /** a brief summary of the feature and why it matters */
    text: _react.PropTypes.string.isRequired
  })).isRequired
};
FeatureList.defaultProps = {
  columns: 2,
  bordered: true,
  spacer: 'm-b-md'
};
exports.default = FeatureList;

function FeatureTile(_ref) {
  var pos = _ref.pos;
  var spacer = _ref.spacer;
  var item = _ref.item;

  return _react2.default.createElement(
    'li',
    { key: pos, className: spacer, __source: {
        fileName: _jsxFileName,
        lineNumber: 90
      }
    },
    _react2.default.createElement(
      'div',
      { className: 'featured-list-icon', __source: {
          fileName: _jsxFileName,
          lineNumber: 91
        }
      },
      _react2.default.createElement('span', { className: 'icon icon-' + item.icon, __source: {
          fileName: _jsxFileName,
          lineNumber: 92
        }
      })
    ),
    _react2.default.createElement(
      'h3',
      {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 94
        }
      },
      item.title
    ),
    _react2.default.createElement(
      'p',
      {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 95
        }
      },
      item.text
    )
  );
}