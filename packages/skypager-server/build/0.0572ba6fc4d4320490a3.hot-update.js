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
	
	var _jsonColorz = __webpack_require__(95);
	
	var _jsonColorz2 = _interopRequireDefault(_jsonColorz);
	
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
	        (0, _extends3.default)({ label: 'skypager' }, borderStyles({ color: 'magenta', style: 'line' }), {
	          __source: {
	            fileName: _jsxFileName,
	            lineNumber: 37
	          }
	        }),
	        (0, _jsonColorz2.default)(this.project)
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

/***/ },

/***/ 95:
/***/ function(module, exports, __webpack_require__) {

	/*!
	 * json-colorz <https://github.com/akileez/json-colorz>
	 *
	 * Copyright (c) 2015 Keith Williams.
	 * Licensed under the ISC license.
	 *
	 * Original Code:
	 * jsome <https://github.com/Javascipt/Jsome>
	 * Copyright (c) 2015 Khalid REHIOUI <Array.prototype@gmail.com> (http://github.com/javascipt)
	 * Licensed under he MIT License (MIT)
	 */
	
	var colors = {
	  num   : 'cyan',
	  str   : 'magenta',
	  bool  : 'red',
	  regex : 'blue',
	  undef : 'grey',
	  null  : 'grey',
	  attr  : 'green',
	  quot  : 'yellow',
	  punc  : 'yellow',
	  brack : 'yellow',
	  func  : 'grey'
	}
	
	var display = {
	  func: false,
	  date: false
	}
	
	var level = {
	  show   : false,
	  char   : '.',
	  color  : 'red',
	  spaces : 2,
	  start  : 0
	}
	
	var params = {
	  colored: true,
	  async: false
	}
	
	var options = {
	  colors : colors,
	  display: display,
	  level  : level,
	  params : params
	}
	
	var engine = __webpack_require__(96).setOptions(options)
	
	function colorize (engine) {
	  // main function: jclrz
	  function jclrz (json, cb) {
	    if (!jclrz.params.async) {
	      process.stdout.write(engine.gen(json, options.level.start) + '\n')
	    } else {
	      process.nextTick(function () {
	        process.stdout.write(engine.gen(json, options.level.start) + '\n')
	        cb && cb()
	      })
	    }
	    return json
	  }
	
	  // parse
	  jclrz.parse = function (jsonString, cb) {
	    return jclrz(JSON.parse(jsonString), cb)
	  }
	
	  // options
	  jclrz.colors = colors
	  jclrz.display = display
	  jclrz.level = level
	  jclrz.params = params
	
	  return jclrz
	}
	
	module.exports = colorize(engine)


/***/ },

/***/ 96:
/***/ function(module, exports, __webpack_require__) {

	var colorz = __webpack_require__(97)
	
	function engine () {
	  var options
	
	  function kindOf (value) {
	    if (value === null) return 'null'
	    if (value === undefined) return 'undefined'
	
	    if (Array.isArray(value)) return 'array'
	
	    if (typeof value === 'string') return 'string'
	    if (typeof value === 'boolean') return 'boolean'
	    if (typeof value === 'number') return 'number'
	    if (typeof value === 'function') return 'function'
	
	    var type = value.constructor.name
	
	    if (type === 'Object') return 'object'
	    if (type === 'RegExp') return 'regexp'
	    if (type === 'Date') return 'date'
	
	    return type.toLowerCase()
	  }
	
	  function isObject (obj) {
	    return obj.constructor.name === 'Object'
	  }
	
	  function filter (arr, fn) {
	    var result = []
	
	    var val
	    var i = -1
	    var j = -1
	    var len = arr.length
	
	    while (++i < len) {
	      val = arr[i]
	      if (fn(val, i, arr)) result[++j] = val
	    }
	    return result
	  }
	
	  function repeat (str, n) {
	    var result = ''
	
	    while (n > 0) {
	      if (n % 2) result += str
	      n = Math.floor(n / 2)
	      str += str
	    }
	    return result
	  }
	
	  function indent (str, char, num) {
	    if (num === 0) return str
	    char = num > 1
	      ? repeat(char, num)
	      : char
	
	    var re = /^(?!\s*$)/mg
	    return str.replace(re, char)
	  }
	
	  function getType (value) {
	    var map = {
	      'number'    : 'num',
	      'string'    : 'str',
	      'boolean'   : 'bool',
	      'function'  : 'func',
	      'null'      : 'null',
	      'undefined' : 'undef',
	      'regexp'    : 'regex',
	      'date'      : 'date'
	    }
	    return map[kindOf(value)] || map['' + value]
	  }
	
	  function cleanObject (obj) {
	    var lastKey = ''
	    var key
	
	    for (key in obj) {
	      if (obj.hasOwnProperty(key)) lastKey = key
	      // (getType(obj[key]) === 'func') && delete obj[key] || (lastKey = key)
	    }
	    return lastKey
	  }
	
	  function cleanArray (arr) {
	    return filter(arr, function (item) {
	      return getType(item) !== 'func'
	    })
	  }
	
	  function generateLevel (level) {
	    var levelStr = repeat(' ', options.level.spaces)
	    var opts = options.level
	
	    if (options.level.show && levelStr.length) {
	      levelStr = levelStr.replace(' ', useColorProvider(opts.char, opts.color))
	    }
	    return repeat(levelStr, level)
	  }
	
	  function hasChild (obj) {
	    var key
	    for (key in obj) {
	      if (Array.isArray(obj[key]) || isObject(obj[key])) return true
	    }
	  }
	
	  function colorify (value, level) {
	    var type = getType(value)
	    var color = options.colors[type]
	
	    return generateLevel(type === 'func' ? 0 : level)
	      + (type === 'str' ? colorifySpec('"', 'quot') : '')
	      + useColorProvider(formatOutputType(value, type, level), color)
	      + (type === 'str' ? colorifySpec('"', 'quot') : '')
	  }
	
	  function colorifySpec (char, type, level) {
	    return generateLevel(level) + useColorProvider('' + char, options.colors[type])
	  }
	
	  function useColorProvider (str, color) {
	    if (!color) return str
	    if (options.params.colored) {
	      if (Array.isArray(color) && color.length > 1) {
	        return useColorProvider(colorz[color[0]](str), color.slice(1))
	      } else {
	        return colorz[Array.isArray(color) ? color[0] : color](str)
	      }
	    }
	    return str
	  }
	
	  function formatOutputType (value, type, level) {
	    if (type === 'func') {
	      if (options.display.func) {
	        var str = value.toString().split(/\n/)
	        var first = str[0] + '\n'
	        var rest = str.slice(1)
	        return first + indent(rest.join('\n'), ' ', generateLevel(level).length)
	      } else {
	        return '[Function]'
	      }
	    }
	
	    if (type === 'date' && !options.display.date) return '[Date]'
	
	    return '' + value
	  }
	
	  return {
	    gen: function (json, level, isChild) {
	      var colored = ''
	      var result
	      var key
	
	      level = level || 0
	
	      if (isObject(json)) {
	        var lastKey = cleanObject(json)
	        colored += colorifySpec('{', 'brack', isChild ? 0 : level) + '\n'
	        level++
	
	        for (key in json) {
	          result = colorifySpec(key, 'attr', level)
	            + colorifySpec(': ', 'punc')
	            + this.gen(json[key], level, true)
	            + (key !== lastKey ? colorifySpec(',', 'punc') : '')
	
	          colored += result + '\n'
	        }
	
	        colored += colorifySpec('}', 'brack', --level)
	      } else if (Array.isArray(json)) {
	        json = cleanArray(json)
	
	        if (hasChild(json)) {
	          result = json.map(function (item) {
	            return this.gen(item, level + 1)
	          }.bind(this))
	
	          colored += colorifySpec('[', 'brack', isChild ? 0 : level)
	          colored += result.join(colorifySpec(', ', 'punc') + '\n')
	          colored += colorifySpec(']', 'brack', level)
	        } else {
	          var coloredArray = colorifySpec('[', 'brack', isChild ? 0 : level)
	
	          for (key in json) {
	            coloredArray += colorify(json[key]) + (json.length - 1 > key ? colorifySpec(', ', 'punc') : '')
	          }
	
	          colored += coloredArray + colorifySpec(']', 'brack')
	        }
	      } else {
	        return generateLevel(isChild ? 0 : level)
	          + colorify(json, typeof json === 'function' ? level : '')
	      }
	
	      return colored
	    },
	
	    setOptions: function (opts) {
	      options = opts
	      return this
	    }
	  }
	}
	
	module.exports = engine()


/***/ },

/***/ 97:
/***/ function(module, exports) {

	/*!
	 * colorz <https://github.com/akileez/colorz>
	 *
	 * Copyright (c) 2015 Keith Williams.
	 * Licensed under the ISC license.
	 */
	
	var colorz = {}
	var styles = {
	  // modifiers
	  reset         : [0, 0],
	  bold          : [1, 22],
	  dim           : [2, 22],
	  italic        : [3, 23],
	  underline     : [4, 24],
	  inverse       : [7, 27],
	  hidden        : [8, 28],
	  strikethrough : [9, 29],
	  // foregrounds
	  black         : [30, 39],
	  gray          : [30, 39],
	  grey          : [30, 39],
	  red           : [31, 39],
	  green         : [32, 39],
	  yellow        : [33, 39],
	  blue          : [34, 39],
	  magenta       : [35, 39],
	  cyan          : [36, 39],
	  white         : [37, 39],
	  // bright foregrounds
	  brBlack       : [90, 39],
	  brGray        : [90, 39],
	  brGrey        : [90, 39],
	  brRed         : [91, 39],
	  brGreen       : [92, 39],
	  brYellow      : [93, 39],
	  brBlue        : [94, 39],
	  brMagenta     : [95, 39],
	  brCyan        : [96, 39],
	  brWhite       : [97, 39],
	  // backgrounds
	  bgBlack       : [40, 49],
	  bgGray        : [40, 49],
	  bgGrey        : [40, 49],
	  bgRed         : [41, 49],
	  bgGreen       : [42, 49],
	  bgYellow      : [43, 49],
	  bgBlue        : [44, 49],
	  bgMagenta     : [45, 49],
	  bgCyan        : [46, 49],
	  bgWhite       : [47, 49],
	  // bright backgrounds
	  bbBlack       : [100, 49],
	  bbGray        : [100, 49],
	  bbGrey        : [100, 49],
	  bbRed         : [101, 49],
	  bbGreen       : [102, 49],
	  bbYellow      : [103, 49],
	  bbBlue        : [104, 49],
	  bbMagenta     : [105, 49],
	  bbCyan        : [106, 49],
	  bbWhite       : [107, 49]
	}
	
	forEach(keys(styles), function (style) {
	  var open = '\u001b[' + styles[style][0] + 'm'
	  var clos = '\u001b[' + styles[style][1] + 'm'
	
	  colorz[style] = function (msg) {
	    return open + msg + clos
	  }
	})
	
	function strip (str) {
	  return str.replace(/(?:\u001b\[)\d+m/g, '')
	}
	
	function expose (style, str, noColor) {
	  if (typeof str === 'boolean') {
	    noColor = str
	    str = 'Hello World'
	  }
	
	  str = str || 'Hello World'
	
	  return noColor
	    ? style + ': ' + JSON.stringify(colorz[style](str))
	    : style + ': '
	      + JSON.stringify(colorz[style](str))
	      .replace(/(\\u001b\[\d+m)/g, colorz[style](['$1']))
	}
	
	function keys (obj) {
	  var result = []
	  var key
	
	  for (key in obj) {
	    if (obj.hasOwnProperty(key)) result.push(key)
	  }
	  return result
	}
	
	function forEach (arr, fn) {
	  var i = -1
	  var len = arr.length
	
	  while (++i < len) if (fn(arr[i], i, arr) === false) break
	}
	
	module.exports = colorz
	module.exports.strip = strip
	module.exports.expose = expose


/***/ }

};
//# sourceMappingURL=0.0572ba6fc4d4320490a3.hot-update.js.map