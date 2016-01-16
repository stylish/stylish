'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /**
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.specInterface = specInterface;
exports.runSpecFunction = runSpecFunction;

var _util = require('./util');

var _asFunction = require('should/as-function');

var _asFunction2 = _interopRequireDefault(_asFunction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    _classCallCheck(this, Reporter);

    this.reminders = [];
    this.errors = [];
    this.warnings = [];
  }

  _createClass(Reporter, [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy90ZXN0LXV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztRQW1DZ0IsYUFBYSxHQUFiLGFBQWE7UUFjYixlQUFlLEdBQWYsZUFBZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWR4QixTQUFTLGFBQWEsQ0FBRSxPQUFPLEVBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUNsRCxTQUFPLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7Q0FDOUI7Ozs7Ozs7Ozs7OztBQUFBLEFBWU0sU0FBUyxlQUFlLENBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQVc7QUFDbkUsTUFBSSxNQUFNLEdBQUcsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDbEMsTUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBTixNQUFNLEVBQUMsQ0FBQyxDQUFBOztBQUUzQyxNQUFJLE1BQU0sWUFBQSxDQUFBOztBQUVWLE1BQUk7c0NBTnlELElBQUk7QUFBSixVQUFJOzs7QUFPL0QsVUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLE1BQUEsQ0FBZCxTQUFTLEdBQU0sS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLFNBQUssSUFBSSxFQUFDLENBQUE7R0FDdkQsQ0FBQyxPQUFPLEtBQUssRUFBRSxFQUVmOztBQUVELFFBQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBOztBQUV0QixTQUFPLE1BQU0sQ0FBQTtDQUNkOztJQUVLLFFBQVE7QUFDWixXQURJLFFBQVEsR0FDRzswQkFEWCxRQUFROztBQUVWLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFBO0FBQ25CLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFBO0FBQ2hCLFFBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFBO0dBQ25COztlQUxHLFFBQVE7O3NCQU9FLEtBQUssRUFBRTtBQUNuQixVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUMzQjs7O3NCQUVZLEtBQUssRUFBRTtBQUNsQixVQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUMxQjs7O3NCQUVVLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUN4Qjs7O3dCQUVjO0FBQ2IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFBO0tBQ3pCOzs7U0FyQkcsUUFBUTs7O0FBd0JkLFNBQVMsSUFBSSxDQUFFLE9BQU8sRUFBZ0I7TUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ2xDLE1BQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxRQUFRLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFBOztBQUU3RCxNQUFJLElBQUksR0FBRyxTQUFQLElBQUksR0FBZTtBQUNyQixRQUFJLENBQUMsR0FBRywwQkFBTyxPQUFPLENBQUMsQ0FBQTtBQUN2QixLQUFDLENBQUMsV0FBVyxHQUFHLE1BQU07O0FBQUEsQUFFdEIsV0FBTyxDQUFDLENBQUE7R0FDVCxDQUFBOztBQUVELE1BQUksSUFBSSxHQUFHLFNBQVAsSUFBSSxHQUFlO0FBQ3JCLFFBQUksQ0FBQyxHQUFHLDBCQUFPLE9BQU8sQ0FBQzs7QUFBQSxBQUV2QixLQUFDLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQTtBQUN2QixXQUFPLENBQUMsQ0FBQTtHQUNULENBQUE7O0FBRUQsTUFBSSxNQUFNLEdBQUcsU0FBVCxNQUFNLEdBQWU7QUFDdkIsUUFBSSxDQUFDLEdBQUcsMEJBQU8sT0FBTyxDQUFDOztBQUFBLEFBRXZCLEtBQUMsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFBO0FBQ3hCLFdBQU8sQ0FBQyxDQUFBO0dBQ1QsQ0FBQTs7QUFFRCxTQUFPO0FBQ0wsVUFBTSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDdEIsVUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUM7QUFDeEIsUUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDcEIsVUFBTSxFQUFFLE1BQU07R0FDZixDQUFBO0NBQ0Y7OztBQUFBLEFBR0QsU0FBUyxRQUFRLENBQUUsRUFBRSxFQUFFO0FBQ3JCLE1BQUksWUFBWSxHQUFHLENBQ2pCLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQ25ELENBQUE7O0FBRUQsY0FBWSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7V0FBSSxNQWhIdkIsSUFBSSxDQWdId0IsTUFBTSxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQztHQUFBLENBQUMsQ0FBQTtDQUNqRSIsImZpbGUiOiJ0ZXN0LXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qXG4qIEVYUEVSSU1FTlRBTFxuKlxuKiBJIHdhbnQgdG8gZmluZCBhIHdheSBvZiB3cmFwcGluZyB0aGUgc2hvdWxkIGxpYnJhcnkgYW5kIHJlc3BvbmRpbmdcbiogdG8gZmFpbHVyZXMgYnkgbG9nZ2luZyB0aGVtLCBpbnN0ZWFkIG9mIGhhbHRpbmcgZXhlY3V0aW9uLlxuKlxuKiBUaGlzIHdpbGwgYWxsb3cgbW9kZWxzIHRvIGV4cG9ydCBmdW5jdGlvbnMgd2hpY2ggY29udGFpbiBhIGJ1bmNoIG9mIHNwZWNpZmljYXRpb25zOlxuKlxuKiBvYmplY3QucGxlYXNlIC0gc3VnZ2VzdGlvbiwgY2FuIGJlIHNpbGVuY2VkXG4qIG9iamVjdC5zaG91bGQgLSBhZHZpY2UsIHdhcm5zIG9uIGZhaWx1cmUsIGNhbid0IGJlIHNpbGVuY2VkIGVhc2lseVxuKiBvYmplY3QubXVzdCAtIHJlcXVpcmVtZW50LCBmYWlsdXJlIGlzIG5vdCBvcHRpb25hbFxuKlxuKiBhbmQgdGhlc2UgZnVuY3Rpb25zIGNhbiBiZSB1c2VkIHRvIHZhbGlkYXRlIGEgZ2l2ZW4gZG9jdW1lbnQgbWVldHMgdGhlIHJlcXVpcmVtZW50cyB0byBiZSB1c2VkIGFzIGFuIGVudGl0eVxuKi9cblxuaW1wb3J0IHsgaGlkZSB9IGZyb20gJy4vdXRpbCdcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJ1xuXG4vKipcbipcbiogUmV0dXJucyBhIHNwZWMgaW50ZXJmYWNlIGZvciB0aGUgcGFzc2VkIG9iamVjdC5cbipcbiogQGV4YW1wbGVcbipcbiogICBmdW5jdGlvbiB2YWxpZGF0b3Iob2JqZWN0VW5kZXJUZXN0LCBzcGVjKXtcbiogICAgIGxldCB7IHBsZWFzZSwgc2hvdWxkLCBtdXN0LCByZXBvcnQgfSA9IHNwZWMob2JqZWN0VW5kZXJUZXN0KVxuKiAgICAgbXVzdC5iZS5hLkZ1bmN0aW9uIHx8IHJlcG9ydCgnVGhpcyBuZWVkcyB0byBiZSBhIGZ1bmN0aW9uJylcbiogICAgIHBsZWFzZS5oYXZlLm5hbWUubWF0Y2goL15zb21ldGhpbmcvKSB8fCByZXBvcnQoJ0Z1bmN0aW9uIG5hbWUgc2hvdWxkIHN0YXJ0IHdpdGggc29tZXRoaW5nJylcbiogICAgIHJldHVybiByZXBvcnRcbiogICB9XG4qXG4qIEByZXR1cm4gU3BlY0ludGVyZmFjZSBhbiBvYmplY3Qgd2l0aCBwbGVhc2UsIG11c3QsIHNob3VsZCwgYW5kIHJlcG9ydCBvYmplY3RzIHdoaWNoIGNhbiBiZSB1c2VkXG4qICAgdG8gd3JpdGUgcmVxdWlyZW1lbnRzIGZvciB0aGUgb2JqZWN0J3MgaW50ZXJmYWNlLCB3aXRoIGRpZmZlcmVudCBjb25zZXF1ZW5jZXMgZm9yIGZhaWx1cmUuXG4qL1xuZXhwb3J0IGZ1bmN0aW9uIHNwZWNJbnRlcmZhY2UgKHN1YmplY3QsIG9wdGlvbnMgPSB7fSkge1xuICByZXR1cm4gc3BlYyhzdWJqZWN0LCBvcHRpb25zKVxufVxuXG4vKipcbiogd3JhcHMgYSBzcGVjIGZ1bmN0aW9uIHdoaWNoIGV4cGVjdHMgdG8gYmUgcGFzc2VkIGFuIG9iamVjdCB1bmRlciB0ZXN0LCBhbmQgYW4gb2JqZWN0IHRoYXRcbiogd2lsbCBwcm92aWRlIHRoaXMgZnVuY3Rpb24gd2l0aCB0aGUgdG9vbHMgaXQgbmVlZHMgdG8gd3JpdGUgcmVxdWlyZW1lbnRzIGFuZCByZXBvcnQgb24gdGhlaXIgZmFpbHVyZS5cbipcbiogYSB2YWxpZGF0b3IgZnVuY3Rpb24gd2lsbCBuZXZlciB0aHJvdyBlcnJvcnMgb3IgYnJlYWsgZXhlY3V0aW9uLCBpdCB3aWxsIHJldHVybiBmYWxzZS4gIGRldGFpbHMgYWJvdXRcbiogYW55IGZhaWx1cmVzIG9yIGVycm9ycyB3aWwgYmUgYXZhaWxhYmxlIG9uIHRoZSByZXBvcnQgZm9yIHRoaXMgZnVuY3Rpb24uXG4qXG4qIEByZXR1cm4gUmVwb3J0IHJldHVybnMgYW4gaW5zdGFuY2Ugb2YgdGhlIFJlcG9ydCBjbGFzc1xuKlxuKi9cbmV4cG9ydCBmdW5jdGlvbiBydW5TcGVjRnVuY3Rpb24gKHZhbGlkYXRvciwgc3ViamVjdCwgc2NvcGUsIC4uLnJlc3QpIHtcbiAgbGV0IHJlcG9ydCA9IG5ldyBSZXBvcnRlcihzdWJqZWN0KVxuICBsZXQgc3BlYyA9IHNwZWNJbnRlcmZhY2Uoc3ViamVjdCwge3JlcG9ydH0pXG5cbiAgbGV0IHJlc3VsdFxuXG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gdmFsaWRhdG9yLmNhbGwoc2NvcGUsIHN1YmplY3QsIHNwZWMsIC4uLnJlc3QpXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG5cbiAgfVxuXG4gIHJlcG9ydC5yZXN1bHQgPSByZXN1bHRcblxuICByZXR1cm4gcmVwb3J0XG59XG5cbmNsYXNzIFJlcG9ydGVyIHtcbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMucmVtaW5kZXJzID0gW11cbiAgICB0aGlzLmVycm9ycyA9IFtdXG4gICAgdGhpcy53YXJuaW5ncyA9IFtdXG4gIH1cblxuICBzZXQgcmVtaW5kZXIgKHZhbHVlKSB7XG4gICAgdGhpcy5yZW1pbmRlcnMucHVzaCh2YWx1ZSlcbiAgfVxuXG4gIHNldCB3YXJuaW5nICh2YWx1ZSkge1xuICAgIHRoaXMud2FybmluZ3MucHVzaCh2YWx1ZSlcbiAgfVxuXG4gIHNldCBlcnJvciAodmFsdWUpIHtcbiAgICB0aGlzLmVycm9ycy5wdXNoKHZhbHVlKVxuICB9XG5cbiAgZ2V0IHN1Y2Nlc3MgKCkge1xuICAgIHRoaXMuZXJyb3JzLmxlbmd0aCA9PT0gMFxuICB9XG59XG5cbmZ1bmN0aW9uIHNwZWMgKHN1YmplY3QsIG9wdGlvbnMgPSB7fSkge1xuICBsZXQgcmVwb3J0ID0gb3B0aW9ucy5yZXBvcnQgfHwgbmV3IFJlcG9ydGVyKHN1YmplY3QsIG9wdGlvbnMpXG5cbiAgbGV0IHdhcm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHcgPSBzaG91bGQoc3ViamVjdClcbiAgICB3LnNlcmlvdXNuZXNzID0gJ3dhcm4nXG4gICAgLy8gZmluZCBzb21lIHdheSB0byB0YXAgaW50byB0aGUgZXJyb3JzIGFuZCByZXNwb25kIHN0ZXJubHlcbiAgICByZXR1cm4gd1xuICB9XG5cbiAgbGV0IG11c3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG0gPSBzaG91bGQoc3ViamVjdClcbiAgICAvLyBmaW5kIHNvbWUgd2F5IHRvIHRhcCBpbnRvIHRoZSBlcnJvcnMgYW5kIHJlc3BvbmQgaGFyc2hseVxuICAgIG0uc2VyaW91c25lc3MgPSAnZm9yY2UnXG4gICAgcmV0dXJuIG1cbiAgfVxuXG4gIGxldCBwbGVhc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IHAgPSBzaG91bGQoc3ViamVjdClcbiAgICAvLyBmaW5kIHNvbWUgd2F5IHRvIHRhcCBpbnRvIHRoZSBlcnJvcnMgYW5kIHJlc3BvbmQgbmljZWx5XG4gICAgbS5zZXJpb3VzbmVzcyA9ICdyZW1pbmQnXG4gICAgcmV0dXJuIHBcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2hvdWxkOiB3cmFwSXRVcCh3YXJuKSxcbiAgICBwbGVhc2U6IHdyYXBJdFVwKHBsZWFzZSksXG4gICAgbXVzdDogd3JhcEl0VXAobXVzdCksXG4gICAgcmVwb3J0OiByZXBvcnRcbiAgfVxufVxuXG4vLyB3cmFwcyB1cCBvbmUgb2YgdGhlIGhvdyBzZXJpb3VzIGFyZSB5b3UgYWJvdXQgdGhpcyBhZHZpY2UgbWV0aG9kc1xuZnVuY3Rpb24gd3JhcEl0VXAgKGZuKSB7XG4gIGxldCBjaGFpbk1ldGhvZHMgPSBbXG4gICAgJ2FuJywgJ29mJywgJ2EnLCAnYW5kJywgJ2JlJywgJ2hhdmUnLCAnd2l0aCcsICdpcydcbiAgXVxuXG4gIGNoYWluTWV0aG9kcy5mb3JFYWNoKGNoYWluID0+IGhpZGUuZ2V0dGVyKGZuLCBjaGFpbiwgZm4sIGZhbHNlKSlcbn1cblxuXG4iXX0=