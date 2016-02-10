'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.specInterface = specInterface;
exports.runSpecFunction = runSpecFunction;

var _util = require('./util');

var _asFunction = require('should/as-function');

var _asFunction2 = _interopRequireDefault(_asFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
*
* Returns a spec interface for the passed object.
*
* @example
*
*   function validator(objectUnderTest, spec){
*     let { please, should, must, report } = spec(objectUnderTest)
*     must.be.a.Function || report('This needs to be a function')
*     please.have.name.match(/^something/) || report('Function name should start with something')
*     return report
*   }
*
* @return SpecInterface an object with please, must, should, and report objects which can be used
*   to write requirements for the object's interface, with different consequences for failure.
*/
/**
*
* EXPERIMENTAL
*
* I want to find a way of wrapping the should library and responding
* to failures by logging them, instead of halting execution.
*
* This will allow models to export functions which contain a bunch of specifications:
*
* object.please - suggestion, can be silenced
* object.should - advice, warns on failure, can't be silenced easily
* object.must - requirement, failure is not optional
*
* and these functions can be used to validate a given document meets the requirements to be used as an entity
*/

function specInterface(subject) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return spec(subject, options);
}

/**
* wraps a spec function which expects to be passed an object under test, and an object that
* will provide this function with the tools it needs to write requirements and report on their failure.
*
* a validator function will never throw errors or break execution, it will return false.  details about
* any failures or errors wil be available on the report for this function.
*
* @return Report returns an instance of the Report class
*
*/
function runSpecFunction(validator, subject, scope) {
  var report = new Reporter(subject);
  var spec = specInterface(subject, { report: report });

  var result = undefined;

  try {
    for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      rest[_key - 3] = arguments[_key];
    }

    result = validator.call.apply(validator, [scope, subject, spec].concat(rest));
  } catch (error) {}

  report.result = result;

  return report;
}

var Reporter = (function () {
  function Reporter() {
    (0, _classCallCheck3.default)(this, Reporter);

    this.reminders = [];
    this.errors = [];
    this.warnings = [];
  }

  (0, _createClass3.default)(Reporter, [{
    key: 'reminder',
    set: function set(value) {
      this.reminders.push(value);
    }
  }, {
    key: 'warning',
    set: function set(value) {
      this.warnings.push(value);
    }
  }, {
    key: 'error',
    set: function set(value) {
      this.errors.push(value);
    }
  }, {
    key: 'success',
    get: function get() {
      this.errors.length === 0;
    }
  }]);
  return Reporter;
})();

function spec(subject) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var report = options.report || new Reporter(subject, options);

  var warn = function warn() {
    var w = (0, _asFunction2.default)(subject);
    w.seriousness = 'warn';
    // find some way to tap into the errors and respond sternly
    return w;
  };

  var must = function must() {
    var m = (0, _asFunction2.default)(subject);
    // find some way to tap into the errors and respond harshly
    m.seriousness = 'force';
    return m;
  };

  var please = function please() {
    var p = (0, _asFunction2.default)(subject);
    // find some way to tap into the errors and respond nicely
    m.seriousness = 'remind';
    return p;
  };

  return {
    should: wrapItUp(warn),
    please: wrapItUp(please),
    must: wrapItUp(must),
    report: report
  };
}

// wraps up one of the how serious are you about this advice methods
function wrapItUp(fn) {
  var chainMethods = ['an', 'of', 'a', 'and', 'be', 'have', 'with', 'is'];

  chainMethods.forEach(function (chain) {
    return _util.hide.getter(fn, chain, fn, false);
  });
}