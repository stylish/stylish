'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToggleGroup = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

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

var _jsxFileName = 'src/components/ToggleGroup/index.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Button = require('react-bootstrap/lib/Button');

var _Button2 = _interopRequireDefault(_Button);

var _ButtonGroup = require('react-bootstrap/lib/ButtonGroup');

var _ButtonGroup2 = _interopRequireDefault(_ButtonGroup);

var _DropdownButton = require('react-bootstrap/lib/DropdownButton');

var _DropdownButton2 = _interopRequireDefault(_DropdownButton);

var _MenuItem = require('react-bootstrap/lib/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

var _Icon = require('ui/components/Icon');

var _Icon2 = _interopRequireDefault(_Icon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The ToggleGroup is a button group with mutiple buttons which can be toggled on or off in any combination.
 */

var ToggleGroup = exports.ToggleGroup = (function (_Component) {
  (0, _inherits3.default)(ToggleGroup, _Component);

  function ToggleGroup(props, context) {
    (0, _classCallCheck3.default)(this, ToggleGroup);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ToggleGroup).call(this, props, context));

    _this.onChange = props.onChange && props.onChange.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(ToggleGroup, [{
    key: 'render',
    value: function render() {
      var onChange = this.onChange;
      var buttons = this.props.items.map(function (item) {
        return _react2.default.createElement(
          _Button2.default,
          (0, _extends3.default)({}, btnProps, {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 39
            }
          }),
          item.label
        );
      });

      return _react2.default.createElement(
        _ButtonGroup2.default,
        { bsClass: 'btn-group ' + (props.className || ''), __source: {
            fileName: _jsxFileName,
            lineNumber: 43
          }
        },
        buttons
      );
    }
  }]);
  return ToggleGroup;
})(_react.Component);

ToggleGroup.displayName = 'ToggleGroup';
ToggleGroup.propTypes = {
  /** an array of labels for the buttons */
  items: _react.PropTypes.arrayOf(_react.PropTypes.shape({
    label: _react.PropTypes.string.isRequired,
    icon: _react.PropTypes.string,
    color: _react.PropTypes.string,
    style: _react.PropTypes.string,
    size: _react.PropTypes.string
  })),
  /** an additional onChange handler */
  onChange: _react.PropTypes.func
};
exports.default = ToggleGroup;