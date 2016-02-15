require("source-map-support").install();
exports.id = 0;
exports.modules = {

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _jsxFileName = '/Users/jonathan/Skypager/packages/skypager-server/src/dashboard/index.js';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _blessed = __webpack_require__(3);
	
	var _blessed2 = _interopRequireDefault(_blessed);
	
	var _reactBlessed = __webpack_require__(4);
	
	var _App = __webpack_require__(91);
	
	var _App2 = _interopRequireDefault(_App);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Create our screen
	var screen = _blessed2.default.screen({
	  autoPadding: true,
	  smartCSR: true,
	  title: 'Skypager'
	});
	
	// Let user quit the app
	screen.key(['escape', 'q', 'C-c'], function (ch, key) {
	  return process.exit(0);
	});
	
	// Render React component into screen
	(0, _reactBlessed.render)(_react2.default.createElement(_App2.default, {
	  __source: {
	    fileName: _jsxFileName,
	    lineNumber: 19
	  }
	}), screen);
	
	// Don't overwrite the screen
	console.log = function () {};
	console.warn = function () {};
	console.error = function () {};
	console.info = function () {};
	console.debug = function () {};
	
	// Listen to SIGUSR2 indicating hot updates:
	//require('./signal')
	
	// This is dumb but I don't understand how else to prevent process from exiting.
	// If it exits, it will get restarted by nodemon, but then hot reloading won't work.
	setInterval(function () {}, 1000);

/***/ },

/***/ 91:
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
	
	var _jsxFileName = '/Users/jonathan/Skypager/packages/skypager-server/src/dashboard/App.js';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _CommandLogger = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./CommandLogger\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
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
	          _react2.default.createElement(_CommandLogger2.default, { cmd: 'skypager serve', __source: {
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
	          _react2.default.createElement(_CommandLogger2.default, { cmd: 'skypager --help', __source: {
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

/***/ }

};
//# sourceMappingURL=0.45bb0d3fe60a379e4d77.hot-update.js.map