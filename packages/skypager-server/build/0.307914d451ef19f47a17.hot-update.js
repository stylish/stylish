require("source-map-support").install();
exports.id = 0;
exports.modules = {

/***/ 77:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _toArray2 = __webpack_require__(80);
	
	var _toArray3 = _interopRequireDefault(_toArray2);
	
	exports.shell = shell;
	
	var _child_process = __webpack_require__(67);
	
	var _fs = __webpack_require__(68);
	
	var _lodash = __webpack_require__(76);
	
	var _yargs = __webpack_require__(90);
	
	var _yargs2 = _interopRequireDefault(_yargs);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function shell(command) {
	   var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	   var handle = arguments[2];
	
	   if (typeof options === 'function') {
	      handle = options;
	      options = {};
	   }
	
	   var _command$split = command.split(' ');
	
	   var _command$split2 = (0, _toArray3.default)(_command$split);
	
	   var cmd = _command$split2[0];
	
	   var args = _command$split2.slice(1);
	
	   var proc = (0, _child_process.spawn)(cmd, args, options);
	
	   proc.stdout.on('data', function (data) {
	      return handle(data.toString());
	   });
	   proc.stderr.on('data', function (data) {
	      return handle(data.toString());
	   });
	   proc.on('error', function (data) {
	      return handle(data.toString());
	   });
	
	   return proc;
	}

/***/ }

};
//# sourceMappingURL=0.307914d451ef19f47a17.hot-update.js.map