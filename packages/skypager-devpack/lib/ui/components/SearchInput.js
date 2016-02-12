'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchInput = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _jsxFileName = 'src/ui/components/SearchInput.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InputWithIcon = require('./InputWithIcon');

var _InputWithIcon2 = _interopRequireDefault(_InputWithIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SearchInput = exports.SearchInput = (function (_React$Component) {
  (0, _inherits3.default)(SearchInput, _React$Component);

  function SearchInput(props) {
    (0, _classCallCheck3.default)(this, SearchInput);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SearchInput).call(this, props));

    _this.state = {
      value: props.value
    };
    return _this;
  }

  (0, _createClass3.default)(SearchInput, [{
    key: 'handleChange',
    value: function handleChange(e) {
      var target = e.target;
      var name = target.name;
      var value = target.value;

      var oldValue = this.state.value;

      this.setState((0, _defineProperty3.default)({}, name, value));

      this.props.onChange(value, oldValue);
    }
  }, {
    key: 'render',
    value: function render() {
      var handleChange = this.handleChange.bind(this);
      var value = this.state.value;

      return _react2.default.createElement('input', { type: 'text', __source: {
          fileName: _jsxFileName,
          lineNumber: 30
        }
      });
    }
  }]);
  return SearchInput;
})(_react2.default.Component);

SearchInput.propTypes = {
  value: _react2.default.PropTypes.string,
  onChange: _react2.default.PropTypes.func
};

exports.default = SearchInput;