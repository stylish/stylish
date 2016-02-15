require("source-map-support").install();
exports.id = 0;
exports.modules = {

/***/ 77:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.shell = shell;
	
	var _shelljs = __webpack_require__(78);
	
	var _shelljs2 = _interopRequireDefault(_shelljs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function shell() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  options.async = true;
	
	  var proc = _shelljs2.default.default(options.cmd, options);
	
	  var data = options.data;
	  var log = options.log;
	
	
	  proc.stdout.on('data', function (buffer) {
	    data(buffer.toString());
	  });
	
	  return proc;
	}

/***/ }

};
//# sourceMappingURL=0.20396ec9184f9ec18864.hot-update.js.map