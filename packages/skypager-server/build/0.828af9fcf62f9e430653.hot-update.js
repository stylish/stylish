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
	function shell() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	  options.async = true;
	
	  var proc = __webpack_require__(78)(options.cmd, options);
	
	  var data = options.data;
	  var log = options.log;
	
	
	  proc.stdout.on('data', function (buffer) {
	    data(buffer.toString());
	  });
	
	  return proc;
	}

/***/ }

};
//# sourceMappingURL=0.828af9fcf62f9e430653.hot-update.js.map