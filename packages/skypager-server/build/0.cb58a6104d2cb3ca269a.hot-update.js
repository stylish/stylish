require("source-map-support").install();
exports.id = 0;
exports.modules = {

/***/ 69:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.App = undefined;
	
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
	
	var _jsxFileName = '/Users/jonathan/Skypager/packages/skypager-server/src/dashboard/components/App.js';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _CommandLogger = __webpack_require__(79);
	
	var _CommandLogger2 = _interopRequireDefault(_CommandLogger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var App = exports.App = function (_Component) {
	  (0, _inherits3.default)(App, _Component);
	
	  function App() {
	    (0, _classCallCheck3.default)(this, App);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(App).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(App, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'box',
	        {
	          __source: {
	            fileName: _jsxFileName,
	            lineNumber: 7
	          }
	        },
	        _react2.default.createElement(
	          'box',
	          { ref: 'left', top: '4%', left: '2%', width: '20%', border: { type: 'line' }, style: { border: { fg: 'cyan' } }, __source: {
	              fileName: _jsxFileName,
	              lineNumber: 8
	            }
	          },
	          _react2.default.createElement(_CommandLogger2.default, { command: { cmd: 'skypager serve' }, __source: {
	              fileName: _jsxFileName,
	              lineNumber: 9
	            }
	          })
	        ),
	        _react2.default.createElement(
	          'box',
	          { ref: 'right', top: '4%', width: '', width: '60%', left: '33%', __source: {
	              fileName: _jsxFileName,
	              lineNumber: 11
	            }
	          },
	          _react2.default.createElement(_CommandLogger2.default, { cmd: 'skypager dev', __source: {
	              fileName: _jsxFileName,
	              lineNumber: 12
	            }
	          })
	        )
	      );
	    }
	  }]);
	  return App;
	}(_react.Component);
	
	exports.default = App;

/***/ },

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
	      var command = this.props.command;
	
	      this.log = this.refs.log;
	
	      this.proc = (0, _util.shell)((0, _extends3.default)({}, command, {
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
	          lineNumber: 25
	        }
	      });
	    }
	  }]);
	  return CommandLogger;
	}(_react.Component);
	
	exports.default = CommandLogger;

/***/ }

};
//# sourceMappingURL=0.cb58a6104d2cb3ca269a.hot-update.js.map