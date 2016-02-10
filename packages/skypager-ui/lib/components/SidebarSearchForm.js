'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SidebarSearchForm = undefined;

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

var _jsxFileName = 'src/components/SidebarSearchForm.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SidebarSearchForm = exports.SidebarSearchForm = (function (_React$Component) {
  (0, _inherits3.default)(SidebarSearchForm, _React$Component);

  function SidebarSearchForm() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, SidebarSearchForm);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SidebarSearchForm).call(this, props));

    _this.state = {
      searchTerm: ''
    };
    return _this;
  }

  (0, _createClass3.default)(SidebarSearchForm, [{
    key: 'handleChange',
    value: function handleChange(e) {
      var target = e.target;

      this.setState((0, _defineProperty3.default)({}, target.name, target.value));
    }
  }, {
    key: 'performSearch',
    value: function performSearch(e) {}
  }, {
    key: 'render',
    value: function render() {
      var handleChange = this.handleChange.bind(this);
      var performSearch = this.performSearch.bind(this);

      var searchTerm = this.state.searchTerm;

      return _react2.default.createElement(
        'form',
        { onSubmit: function onSubmit(e) {
            return e.preventDefault();
          }, className: 'sidebar-form', __source: {
            fileName: _jsxFileName,
            lineNumber: 30
          }
        },
        _react2.default.createElement('input', { className: 'form-control', value: searchTerm, onChange: handleChange, type: 'text', placeholder: 'Search...', __source: {
            fileName: _jsxFileName,
            lineNumber: 31
          }
        }),
        _react2.default.createElement(
          'button',
          { onClick: performSearch, type: 'submit', className: 'btn-link', __source: {
              fileName: _jsxFileName,
              lineNumber: 32
            }
          },
          _react2.default.createElement('span', { className: 'icon icon-magnifying-glass', __source: {
              fileName: _jsxFileName,
              lineNumber: 33
            }
          })
        )
      );
    }
  }]);
  return SidebarSearchForm;
})(_react2.default.Component);