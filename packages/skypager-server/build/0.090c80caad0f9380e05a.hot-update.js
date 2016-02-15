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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function shell() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var data = options.data;
	
	
	  var log = options.log ? (0, _fs.createWriteStream)(options.log) : undefined;
	
	  var _options$cmd$split = options.cmd.split(' ');
	
	  var _options$cmd$split2 = (0, _toArray3.default)(_options$cmd$split);
	
	  var cmd = _options$cmd$split2[0];
	
	  var args = _options$cmd$split2.slice(1);
	
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

/***/ },

/***/ 80:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _from = __webpack_require__(81);
	
	var _from2 = _interopRequireDefault(_from);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (arr) {
	  return Array.isArray(arr) ? arr : (0, _from2.default)(arr);
	};

/***/ },

/***/ 81:
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(82), __esModule: true };

/***/ },

/***/ 82:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(27);
	__webpack_require__(83);
	module.exports = __webpack_require__(14).Array.from;

/***/ },

/***/ 83:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx         = __webpack_require__(15)
	  , $export     = __webpack_require__(12)
	  , toObject    = __webpack_require__(9)
	  , call        = __webpack_require__(84)
	  , isArrayIter = __webpack_require__(85)
	  , toLength    = __webpack_require__(86)
	  , getIterFn   = __webpack_require__(87);
	$export($export.S + $export.F * !__webpack_require__(89)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , $$      = arguments
	      , $$len   = $$.length
	      , mapfn   = $$len > 1 ? $$[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        result[index] = mapping ? mapfn(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },

/***/ 84:
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(57);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },

/***/ 85:
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(37)
	  , ITERATOR   = __webpack_require__(40)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },

/***/ 86:
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(29)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },

/***/ 87:
/***/ function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(88)
	  , ITERATOR  = __webpack_require__(40)('iterator')
	  , Iterators = __webpack_require__(37);
	module.exports = __webpack_require__(14).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },

/***/ 88:
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(49)
	  , TAG = __webpack_require__(40)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },

/***/ 89:
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(40)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ }

};
//# sourceMappingURL=0.090c80caad0f9380e05a.hot-update.js.map