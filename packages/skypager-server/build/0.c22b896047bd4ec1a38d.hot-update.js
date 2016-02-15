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
	    }
	  }));
	
	  return engine.gen(object, options.level.start);
	}

/***/ },

/***/ 99:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof2 = __webpack_require__(24);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var colorz = __webpack_require__(100);
	
	function engine() {
	  var options;
	
	  function kindOf(value) {
	    if (value === null) return 'null';
	    if (value === undefined) return 'undefined';
	    if (Array.isArray(value)) return 'array';
	
	    return (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object' ? Object.prototype.toString.call(value).replace(/^\[object |\]$/g, '').toLowerCase() : typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value);
	  }
	
	  function isObject(obj) {
	    return Object.prototype.toString.call(obj) === '[object Object]';
	  }
	
	  function filter(arr, fn) {
	    var result = [];
	
	    var val;
	    var i = -1;
	    var j = -1;
	    var len = arr.length;
	
	    while (++i < len) {
	      val = arr[i];
	      if (fn(val, i, arr)) result[++j] = val;
	    }
	    return result;
	  }
	
	  function repeat(str, n) {
	    var result = '';
	
	    while (n > 0) {
	      if (n % 2) result += str;
	      n = Math.floor(n / 2);
	      str += str;
	    }
	    return result;
	  }
	
	  function indent(str, char, num) {
	    if (num === 0) return str;
	    char = num > 1 ? repeat(char, num) : char;
	
	    var re = /^(?!\s*$)/mg;
	    return str.replace(re, char);
	  }
	
	  function getType(value) {
	    var map = {
	      'number': 'num',
	      'string': 'str',
	      'boolean': 'bool',
	      'function': 'func',
	      'null': 'null',
	      'undefined': 'undef',
	      'object': 'obj',
	      'array': 'arr',
	      'regexp': 'regex',
	      'date': 'date'
	    };
	    return map[kindOf(value)] || map['' + value];
	  }
	
	  function cleanObject(obj) {
	    var lastKey = '';
	    var key;
	
	    for (key in obj) {
	      // get object's prototype last key for placement of trailing comma
	      lastKey = key;
	    }
	    return lastKey;
	  }
	
	  function cleanArray(arr) {
	    if (options.display.xarr) return arr;
	
	    return filter(arr, function (item) {
	      return ['func', 'date'].indexOf(getType(item)) === -1;
	    });
	  }
	
	  function generateLevel(level) {
	    var levelStr = repeat(' ', options.level.spaces);
	    var opts = options.level;
	
	    if (options.level.show && levelStr.length) {
	      levelStr = levelStr.replace(' ', useColorProvider(opts.char, opts.color));
	    }
	    return repeat(levelStr, level);
	  }
	
	  function hasChild(obj) {
	    var key;
	    for (key in obj) {
	      if (Array.isArray(obj[key]) || isObject(obj[key])) return true;
	    }
	  }
	
	  function colorify(value, level) {
	    var type = getType(value);
	    var color = options.colors[type];
	
	    return generateLevel(type === 'func' ? 0 : level) + (type === 'str' ? colorifySpec('"', 'quot') : '') + useColorProvider(formatOutputType(value, type, level), color) + (type === 'str' ? colorifySpec('"', 'quot') : '');
	  }
	
	  function colorifySpec(char, type, level) {
	    return generateLevel(level) + useColorProvider('' + char, options.colors[type]);
	  }
	
	  function useColorProvider(str, color) {
	    if (!color) return str;
	    if (options.params.colored) {
	      if (Array.isArray(color) && color.length > 1) {
	        return useColorProvider(colorz[color[0]](str), color.slice(1));
	      } else {
	        return colorz[Array.isArray(color) ? color[0] : color](str);
	      }
	    }
	    return str;
	  }
	
	  function formatOutputType(value, type, level) {
	    if (type === 'func') {
	      if (options.display.func) {
	        var str = value.toString().split(/\n/);
	        var first = str[0] + '\n';
	        var rest = str.slice(1);
	        return first + indent(rest.join('\n'), ' ', generateLevel(level).length);
	      } else {
	        return '[Function]';
	      }
	    }
	
	    if (type === 'date' && !options.display.date) return '[Date]';
	
	    return '' + value;
	  }
	
	  return {
	    gen: function gen(json, level, isChild) {
	      var colored = '';
	      var result;
	      var key;
	
	      level = level || 0;
	
	      if (isObject(json)) {
	        var lastKey = cleanObject(json);
	        colored += colorifySpec('{', 'brack', isChild ? 0 : level) + '\n';
	        level++;
	
	        for (key in json) {
	          result = colorifySpec(key, 'attr', level) + colorifySpec(': ', 'punc') + this.gen(json[key], level, true) + (key !== lastKey ? colorifySpec(',', 'punc') : '');
	
	          colored += result + '\n';
	        }
	
	        colored += colorifySpec('}', 'brack', --level);
	      } else if (Array.isArray(json)) {
	        json = cleanArray(json);
	
	        if (hasChild(json)) {
	          result = json.map(function (item) {
	            return this.gen(item, level + 1);
	          }.bind(this));
	
	          colored += colorifySpec('[', 'brack', isChild ? 0 : level);
	          colored += result.join(colorifySpec(', ', 'punc') + '\n');
	          colored += colorifySpec(']', 'brack', level);
	        } else {
	          var coloredArray = colorifySpec('[', 'brack', isChild ? 0 : level);
	
	          for (key in json) {
	            coloredArray += colorify(json[key]) + (json.length - 1 > key ? colorifySpec(', ', 'punc') : '');
	          }
	
	          colored += coloredArray + colorifySpec(']', 'brack');
	        }
	      } else {
	        return generateLevel(isChild ? 0 : level) + colorify(json, typeof json === 'function' ? level : '');
	      }
	
	      return colored;
	    },
	
	    setOptions: function setOptions(opts) {
	      options = opts;
	      return this;
	    }
	  };
	}
	
	module.exports = engine();

/***/ },

/***/ 100:
/***/ function(module, exports) {

	module.exports = require("colorz");

/***/ }

};
//# sourceMappingURL=0.c22b896047bd4ec1a38d.hot-update.js.map