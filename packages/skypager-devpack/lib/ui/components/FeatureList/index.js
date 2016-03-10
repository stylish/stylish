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

var _jsxFileName = 'src/ui/components/FeatureList/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FeatureList = exports.FeatureList = (function (_Component) {
  (0, _inherits3.default)(FeatureList, _Component);

  function FeatureList() {
    (0, _classCallCheck3.default)(this, FeatureList);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FeatureList).apply(this, arguments));
  }

  (0, _createClass3.default)(FeatureList, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        }
      });
    }
  }]);
  return FeatureList;
})(_react.Component);

FeatureList.displayName = 'FeatureList';
FeatureList.propTypes = {
  features: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    icon: _react.PropTypes.string.isRequired,
    iconSize: _react.PropTypes.oneOf(['small', 'medium', 'large', 'huge']),
    title: _react.PropTypes.string.isRequired,
    text: _react.PropTypes.string.isRequired
  })).isRequired
};
exports.default = FeatureList;