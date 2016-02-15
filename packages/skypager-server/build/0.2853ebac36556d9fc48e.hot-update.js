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
	exports.colorize = colorize;
	
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
	
	function colorize(object) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	  var engine = __webpack_require__(99);
	
	  engine.setOptions((0, _lodash.defaultsDeep)(options, {
	    colors: {
	      num: 'cyan',
	      str: 'magenta',
	      bool: 'red',
	      regex: 'blue',
	      undef: 'grey',
	      null: 'grey',
	      attr: 'green',
	      quot: 'yellow',
	      punc: 'yellow',
	      brack: 'yellow',
	      func: 'grey'
	    },
	    display: {
	      func: false,
	      date: false,
	      xarr: true
	    },
	    level: {
	      show: false,
	      char: '.',
	      color: 'red',
	      spaces: 2,
	      start: 0
	    },
	    params: {
	      async: false,
	      colored: true
	    }
	  }));
	
	  return engine.gen(object, options.level.start);
	}

/***/ }

};
//# sourceMappingURL=0.2853ebac36556d9fc48e.hot-update.js.map