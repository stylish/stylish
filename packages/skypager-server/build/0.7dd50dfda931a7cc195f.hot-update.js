require("source-map-support").install();
exports.id = 0;
exports.modules = {

/***/ 91:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.App = undefined;
	
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
	
	var _jsxFileName = '/Users/jonathan/Skypager/packages/skypager-server/src/dashboard/App.js';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _CommandLogger = __webpack_require__(92);
	
	var _CommandLogger2 = _interopRequireDefault(_CommandLogger);
	
	var _lodash = __webpack_require__(76);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var App = exports.App = function (_Component) {
	  (0, _inherits3.default)(App, _Component);
	
	  function App() {
	    var props = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	    (0, _classCallCheck3.default)(this, App);
	
	    var screen = props.screen;
	
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(App).call(this, (0, _lodash.omit)(props, 'screen'), context));
	  }
	
	  (0, _createClass3.default)(App, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {}
	  }, {
	    key: 'render',
	    value: function render() {
	
	      return _react2.default.createElement(
	        'box',
	        (0, _extends3.default)({}, borderStyles('magenta'), {
	          __source: {
	            fileName: _jsxFileName,
	            lineNumber: 19
	          }
	        }),
	        _react2.default.createElement(_CommandLogger2.default, (0, _extends3.default)({ ref: 'server',
	          top: '4%',
	          height: '95%',
	          left: '2%',
	          width: '40%',
	          cmd: 'skypager serve'
	        }, borderStyles('green'), {
	          __source: {
	            fileName: _jsxFileName,
	            lineNumber: 20
	          }
	        })),
	        _react2.default.createElement(_CommandLogger2.default, (0, _extends3.default)({ ref: 'webpack',
	          top: '4%',
	          height: '78%',
	          left: '42%',
	          width: '58%',
	          cmd: 'skypager dev --theme dashboard-dark --proxy-target="localhost:6020" --proxy-path="/engine.io"',
	          options: { cwd: '/Users/jonathan/Skypager' }
	        }, borderStyles('cyan'), {
	          __source: {
	            fileName: _jsxFileName,
	            lineNumber: 29
	          }
	        })),
	        _react2.default.createElement(
	          'box',
	          (0, _extends3.default)({ label: 'console', top: '82%', height: '16%', left: '42%', width: '58%' }, borderStyles('yellow'), {
	            __source: {
	              fileName: _jsxFileName,
	              lineNumber: 39
	            }
	          }),
	          'repl'
	        )
	      );
	    }
	  }]);
	  return App;
	}(_react.Component);
	
	exports.default = App;
	
	
	function borderStyles() {
	  var color = arguments.length <= 0 || arguments[0] === undefined ? 'white' : arguments[0];
	  var style = arguments.length <= 1 || arguments[1] === undefined ? 'line' : arguments[1];
	
	  return {
	    border: {
	      type: style
	    },
	    style: {
	      border: {
	        fg: color
	      }
	    }
	  };
	}

/***/ }

};
//# sourceMappingURL=0.7dd50dfda931a7cc195f.hot-update.js.map