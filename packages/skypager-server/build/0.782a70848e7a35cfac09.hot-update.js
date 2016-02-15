require("source-map-support").install();
exports.id = 0;
exports.modules = {

/***/ 67:
/***/ function(module, exports) {

	module.exports = require("child_process");

/***/ },

/***/ 68:
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },

/***/ 77:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.shell = shell;
	
	var _child_process = __webpack_require__(67);
	
	var _fs = __webpack_require__(68);
	
	var _lodash = __webpack_require__(76);
	
	function shell() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var data = options.data;
	
	
	  var log = options.log ? (0, _fs.createWriteStream)(options.log) : undefined;
	
	  var proc = (0, _child_process.spawn)(cmd, args, (0, _lodash.pick)(options, 'cwd', 'env', 'input', 'output'));
	
	  var handleData = function handleData(buffer) {
	    var content = buffer.toString();
	    data(content);
	    log && log.write(content);
	  };
	
	  proc.stdout.on('data', handleData);
	  proc.stderr.on('data', handleData);
	
	  return proc;
	}

/***/ }

};
//# sourceMappingURL=0.782a70848e7a35cfac09.hot-update.js.map