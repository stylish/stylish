'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleGroup = undefined;

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

var _jsxFileName = 'src/ui/components/ToggleGroup.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = require('react-bootstrap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ToggleGroup = exports.ToggleGroup = (function (_React$Component) {
  (0, _inherits3.default)(ToggleGroup, _React$Component);

  function ToggleGroup() {
    (0, _classCallCheck3.default)(this, ToggleGroup);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ToggleGroup).apply(this, arguments));
  }

  (0, _createClass3.default)(ToggleGroup, [{
    key: 'render',
    value: function render() {
      var props = this.props;

      return _react2.default.createElement(_reactBootstrap.ButtonGroup, { bsClass: 'btn-group ' + props.className, __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      });
    }
  }]);
  return ToggleGroup;
})(_react2.default.Component);

ToggleGroup.propTypes = {
  className: _react2.default.PropTypes.string,
  items: _react2.default.PropTypes.array.isRequired,
  onChange: _react2.default.PropTypes.func,
  value: _react2.default.PropTypes.object.isRequired
};

exports.default = ToggleGroup;