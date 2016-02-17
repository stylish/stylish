'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CommandLogger = undefined;

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

var _jsxFileName = 'src/dashboard/components/CommandLogger.js';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _util = require('../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CommandLogger = exports.CommandLogger = (function (_Component) {
  (0, _inherits3.default)(CommandLogger, _Component);

  function CommandLogger() {
    (0, _classCallCheck3.default)(this, CommandLogger);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CommandLogger).apply(this, arguments));
  }

  (0, _createClass3.default)(CommandLogger, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      (0, _util.shell)(this.props.cmd, this.props.options || {}, function (content) {
        _this2.refs.log.add(content);
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.proc && this.proc.kill();
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('log', { ref: 'log', scrollable: true, __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        }
      });
    }
  }]);
  return CommandLogger;
})(_react.Component);

exports.default = CommandLogger;