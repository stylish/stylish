require("source-map-support").install();
exports.id = 0;
exports.modules = {

/***/ 79:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.CommandLogger = undefined;
	
	var _extends2 = __webpack_require__(71);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _getPrototypeOf = __webpack_require__(6);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(18);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(19);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(23);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(60);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _jsxFileName = '/Users/jonathan/Skypager/packages/skypager-server/src/dashboard/components/CommandLogger.js';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _lodash = __webpack_require__(76);
	
	var _util = __webpack_require__(77);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var CommandLogger = exports.CommandLogger = function (_Component) {
	  (0, _inherits3.default)(CommandLogger, _Component);
	
	  function CommandLogger() {
	    (0, _classCallCheck3.default)(this, CommandLogger);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CommandLogger).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(CommandLogger, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _props = this.props;
	      var options = _props.options;
	      var cmd = _props.cmd;
	
	
	      this.log = this.refs.log;
	
	      this.proc = (0, _util.shell)((0, _extends3.default)({
	        cmd: cmd
	      }, options, {
	        data: function data(content) {
	          log.add(content);
	        }
	      }));
	    }
	  }, {
	    key: 'componentDidUnmount',
	    value: function componentDidUnmount() {
	      this.proc && this.proc.kill();
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement('log', { ref: 'log', scrollable: true, __source: {
	          fileName: _jsxFileName,
	          lineNumber: 26
	        }
	      });
	    }
	  }]);
	  return CommandLogger;
	}(_react.Component);
	
	exports.default = CommandLogger;

/***/ }

};
//# sourceMappingURL=0.379d286436999ac4357a.hot-update.js.map