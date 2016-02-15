require("source-map-support").install();
exports.id = 0;
exports.modules = {

/***/ 5:
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
	
	var _jsxFileName = '/Users/jonathan/Skypager/packages/skypager-server/src/Dashboard/components/App.js';
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _child_process = __webpack_require__(67);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var App = exports.App = function (_Component) {
	  (0, _inherits3.default)(App, _Component);
	
	  function App() {
	    (0, _classCallCheck3.default)(this, App);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(App).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(App, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;
	
	      var devserver = (0, _child_process.spawn)('skypager', ['dev']);
	
	      console.log('this', this.refs.devserver);
	      devserver.on('data', function (data) {
	        _this2.refs.devserver.add(data.toString());
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'box',
	        { label: 'Skypager', __source: {
	            fileName: _jsxFileName,
	            lineNumber: 16
	          }
	        },
	        _react2.default.createElement(
	          'box',
	          { ref: 'left', top: '10%', left: '2%', border: { type: 'line' }, style: { border: { fg: 'cyan' } }, __source: {
	              fileName: _jsxFileName,
	              lineNumber: 17
	            }
	          },
	          _react2.default.createElement('log', { ref: 'deepstream', __source: {
	              fileName: _jsxFileName,
	              lineNumber: 18
	            }
	          })
	        ),
	        _react2.default.createElement(
	          'box',
	          { ref: 'right', top: '10%', left: '53%', border: { type: 'line' }, style: { border: { fg: 'cyan' } }, __source: {
	              fileName: _jsxFileName,
	              lineNumber: 20
	            }
	          },
	          _react2.default.createElement('log', { ref: 'devserver', __source: {
	              fileName: _jsxFileName,
	              lineNumber: 21
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
//# sourceMappingURL=0.70765e785e00fcd2d525.hot-update.js.map