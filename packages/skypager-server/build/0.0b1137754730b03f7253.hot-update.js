exports.id = 0;
exports.modules = {

/***/ 71:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _assign = __webpack_require__(72);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};

/***/ },

/***/ 72:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(73), __esModule: true };

/***/ },

/***/ 73:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(74);
	module.exports = __webpack_require__(14).Object.assign;

/***/ },

/***/ 74:
/***/ function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(12);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(75)});

/***/ },

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(22)
	  , toObject = __webpack_require__(9)
	  , IObject  = __webpack_require__(48);
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(17)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },

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
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'box',
	        (0, _extends3.default)({ label: 'skypager' }, borderStyles('red'), {
	          __source: {
	            fileName: _jsxFileName,
	            lineNumber: 36
	          }
	        }),
	        'skypager'
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
	
	
	function borderStyles(_ref) {
	  var style = _ref.style;
	  var color = _ref.color;
	
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
//# sourceMappingURL=0.0b1137754730b03f7253.hot-update.js.map