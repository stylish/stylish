require("source-map-support").install();
exports.id = 0;
exports.modules = [
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var _jsxFileName = '/Users/jonathan/Skypager/packages/skypager-server/src/Dashboard/index.js';
	exports.Dashboard = Dashboard;
	
	var _react = __webpack_require__(2);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _blessed = __webpack_require__(3);
	
	var _blessed2 = _interopRequireDefault(_blessed);
	
	var _reactBlessed = __webpack_require__(4);
	
	var _App = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./components/App\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _App2 = _interopRequireDefault(_App);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Dashboard() {
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
	      lineNumber: 20
	    }
	  }), screen);
	
	  // Don't overwrite the screen
	  //console.log = function () { };
	  console.warn = function () {};
	  //console.error = function () { };
	  console.info = function () {};
	  console.debug = function () {};
	
	  // Listen to SIGUSR2 indicating hot updates:
	  //require('./signal')
	
	  // This is dumb but I don't understand how else to prevent process from exiting.
	  // If it exits, it will get restarted by nodemon, but then hot reloading won't work.
	  setInterval(function () {}, 1000);
	}
	
	exports.default = Dashboard;

/***/ }
];
//# sourceMappingURL=0.3b36d157442f1d7ee179.hot-update.js.map