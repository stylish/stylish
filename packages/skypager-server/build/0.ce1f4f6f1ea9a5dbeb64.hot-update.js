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
	
	var _lodash = __webpack_require__(76);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var App = exports.App = function (_Component) {
	  (0, _inherits3.default)(App, _Component);
	
	  function App() {
	    var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	    (0, _classCallCheck3.default)(this, App);
	    var options = args.options;
	    var project = args.project;
	    var screen = args.screen;
	
	    var props = (0, _lodash.omit)(args, 'screen', 'project', 'options');
	
	    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(App).call(this, props));
	
	    _this.project = project;
	    _this.screen = screen;
	    _this.log = screen.log.bind(screen);
	
	    _this.state = {};
	    return _this;
	  }
	
	  (0, _createClass3.default)(App, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return {
	        project: this.project,
	        screen: this.screen,
	        settings: this.project.settings,
	        log: this.log,
	        processes: this.processes
	      };
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {}
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'box',
	        (0, _extends3.default)({ label: 'skypager' }, borderStyles({ color: 'magenta', style: 'line' }), {
	          __source: {
	            fileName: _jsxFileName,
	            lineNumber: 42
	          }
	        }),
	        this.state && this.state.output
	      );
	    }
	  }]);
	  return App;
	}(_react.Component);
	
	App.childContextTypes = {
	  project: _react.PropTypes.object,
	  screen: _react.PropTypes.object,
	  settings: _react.PropTypes.object,
	  processes: _react.PropTypes.object,
	  log: _react.PropTypes.func
	};
	exports.default = App;
	
	
	function borderStyles() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? { style: 'line', color: 'white' } : arguments[0];
	  var style = options.style;
	  var color = options.color;
	
	
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
//# sourceMappingURL=0.ce1f4f6f1ea9a5dbeb64.hot-update.js.map