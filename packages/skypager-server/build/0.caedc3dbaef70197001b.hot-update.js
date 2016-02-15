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
	    value: function componentDidMount() {
	      console.log(this.refs.console.refs);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'box',
	        {
	          __source: {
	            fileName: _jsxFileName,
	            lineNumber: 19
	          }
	        },
	        _react2.default.createElement(
	          'box',
	          { ref: 'left', top: '4%', height: '60%', left: '1%', width: '40%', border: { type: 'line' }, style: { border: { fg: 'white' } }, __source: {
	              fileName: _jsxFileName,
	              lineNumber: 20
	            }
	          },
	          _react2.default.createElement(_CommandLogger2.default, { cmd: 'skypager serve', __source: {
	              fileName: _jsxFileName,
	              lineNumber: 21
	            }
	          })
	        ),
	        _react2.default.createElement(
	          'box',
	          { ref: 'console', top: '66%', height: '32%', left: '1%', width: '40%', border: { type: 'line' }, style: { border: { fg: 'green' } }, __source: {
	              fileName: _jsxFileName,
	              lineNumber: 23
	            }
	          },
	          _react2.default.createElement(_CommandLogger2.default, { ref: 'logger', cmd: 'skypager console --dev-mode', __source: {
	              fileName: _jsxFileName,
	              lineNumber: 24
	            }
	          })
	        ),
	        _react2.default.createElement(
	          'box',
	          { ref: 'right', top: '4%', width: '40%', left: '42%', __source: {
	              fileName: _jsxFileName,
	              lineNumber: 26
	            }
	          },
	          _react2.default.createElement(_CommandLogger2.default, { options: { cwd: '/Users/jonathan/Skypager' }, cmd: 'skypager dev --proxy-target="localhost:6020" --proxy-path="/engine.io"', __source: {
	              fileName: _jsxFileName,
	              lineNumber: 27
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
//# sourceMappingURL=0.caedc3dbaef70197001b.hot-update.js.map