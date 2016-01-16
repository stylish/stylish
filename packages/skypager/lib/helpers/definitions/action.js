'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionDefinition = undefined;
exports.DSL = DSL;
exports.lookup = lookup;

var _util = require('../../util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tracker = {};
var _curr = undefined;

function current() {
  return tracker[_curr];
}
function clearDefinition() {
  _curr = null;delete tracker[_curr];
}

var ActionDefinition = exports.ActionDefinition = (function () {
  function ActionDefinition(actionName) {
    _classCallCheck(this, ActionDefinition);

    this.name = actionName;
    this.config = {};
    this.parameters = {};
    this.aliases = {};
    this.validator = function () {
      return true;
    };
    this.executor = function () {
      throw 'Define your own executor function';
    };
  }

  _createClass(ActionDefinition, [{
    key: 'aka',
    value: function aka() {
      var _this = this;

      for (var _len = arguments.length, list = Array(_len), _key = 0; _key < _len; _key++) {
        list[_key] = arguments[_key];
      }

      list.forEach(function (alias) {
        _this.aliases[(0, _util.parameterize)((0, _util.underscore)(alias.toLowerCase()))] = true;
      });
    }
  }, {
    key: 'aliases',
    value: function aliases() {
      this.aka.apply(this, arguments);
    }
  }, {
    key: 'params',
    value: function params(fn) {
      this.paramBuilder(fn);
    }
  }, {
    key: 'required',
    value: function required(fn) {
      this.paramBuilder(fn, false);
    }
  }, {
    key: 'optional',
    value: function optional(fn) {
      this.paramBuilder(fn);
    }
  }, {
    key: 'validate',
    value: function validate(fn) {
      this.validator = fn;
    }
  }, {
    key: 'execute',
    value: function execute(fn) {
      this.executor = fn;
    }
  }, {
    key: 'paramBuilder',
    value: function paramBuilder(fn, required) {}
  }, {
    key: 'api',
    get: function get() {
      var def = this;

      return {
        name: this.name,
        aliases: this.aliases,
        execute: this.executor,
        validate: this.validator,
        parameters: this.parameters,
        runner: function runner(params, action) {
          if (def.api.validate(params, action)) {
            return def.api.execute(params, action);
          }
        }
      };
    }
  }]);

  return ActionDefinition;
})();

ActionDefinition.current = current;
ActionDefinition.clearDefinition = clearDefinition;

function DSL(fn) {
  (0, _util.noConflict)(fn, DSL)();
}

function lookup(actionName) {
  return tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(actionName)).toLowerCase()];
}

(0, _util.assign)(DSL, {
  action: function action(actionName) {
    tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(actionName))] = new ActionDefinition(actionName);
  },
  aliases: function aliases() {
    var _tracker$_curr;

    (_tracker$_curr = tracker[_curr]).aliases.apply(_tracker$_curr, arguments);
  },
  aka: function aka() {
    var _tracker$_curr2;

    (_tracker$_curr2 = tracker[_curr]).aka.apply(_tracker$_curr2, arguments);
  },
  validate: function validate() {
    var _tracker$_curr3;

    (_tracker$_curr3 = tracker[_curr]).validate.apply(_tracker$_curr3, arguments);
  },
  execute: function execute() {
    var _tracker$_curr4;

    (_tracker$_curr4 = tracker[_curr]).execute.apply(_tracker$_curr4, arguments);
  },
  required: function required() {
    var _tracker$_curr5;

    (_tracker$_curr5 = tracker[_curr]).required.apply(_tracker$_curr5, arguments);
  },
  optional: function optional() {
    var _tracker$_curr6;

    (_tracker$_curr6 = tracker[_curr]).optional.apply(_tracker$_curr6, arguments);
  },
  params: function params() {
    var _tracker$_curr7;

    (_tracker$_curr7 = tracker[_curr]).params.apply(_tracker$_curr7, arguments);
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2RlZmluaXRpb25zL2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQStFZ0IsR0FBRyxHQUFILEdBQUc7UUFJSCxNQUFNLEdBQU4sTUFBTTs7Ozs7O0FBMUV0QixJQUFJLE9BQU8sR0FBRyxFQUFHLENBQUE7QUFDakIsSUFBSSxLQUFLLFlBQUEsQ0FBQTs7QUFFVCxTQUFTLE9BQU8sR0FBSTtBQUFFLFNBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQUU7QUFDN0MsU0FBUyxlQUFlLEdBQUk7QUFBRSxPQUFLLEdBQUcsSUFBSSxDQUFDLEFBQUMsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7Q0FBRTs7SUFFdEQsZ0JBQWdCLFdBQWhCLGdCQUFnQjtBQUMzQixXQURXLGdCQUFnQixDQUNkLFVBQVUsRUFBRTswQkFEZCxnQkFBZ0I7O0FBRXpCLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRyxDQUFBO0FBQ2pCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRyxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO0FBQ2pCLFFBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWTtBQUFFLGFBQU8sSUFBSSxDQUFBO0tBQUUsQ0FBQTtBQUM1QyxRQUFJLENBQUMsUUFBUSxHQUFHLFlBQVk7QUFBRSxZQUFPLG1DQUFtQyxDQUFDO0tBQUUsQ0FBQTtHQUM1RTs7ZUFSVSxnQkFBZ0I7OzBCQTJCYjs7O3dDQUFOLElBQUk7QUFBSixZQUFJOzs7QUFDVixVQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ3BCLGNBQUssT0FBTyxDQUFFLFVBeENsQixZQUFZLEVBd0NtQixVQXRDL0IsVUFBVSxFQXNDZ0MsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBRSxHQUFHLElBQUksQ0FBQTtPQUNy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QUFRLEVBQUUsb0JBQW1COzs7QUFBRSx1QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUMsUUFBUSxNQUFBLDRCQUFTLENBQUE7R0FBRTtBQUNqRSxRQUFNLEVBQUUsa0JBQW1COzs7QUFBRSx1QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUMsTUFBTSxNQUFBLDRCQUFTLENBQUE7R0FBRTtDQUM5RCxDQUFDLENBQUEiLCJmaWxlIjoiYWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgYXNzaWduLFxuICBub0NvbmZsaWN0LFxuICB0YWJlbGl6ZSxcbiAgcGFyYW1ldGVyaXplLFxuICBzaW5ndWxhcml6ZSxcbiAgdW5kZXJzY29yZVxufSBmcm9tICcuLi8uLi91dGlsJ1xuXG5sZXQgdHJhY2tlciA9IHsgfVxubGV0IF9jdXJyXG5cbmZ1bmN0aW9uIGN1cnJlbnQgKCkgeyByZXR1cm4gdHJhY2tlcltfY3Vycl0gfVxuZnVuY3Rpb24gY2xlYXJEZWZpbml0aW9uICgpIHsgX2N1cnIgPSBudWxsOyBkZWxldGUgdHJhY2tlcltfY3Vycl0gfVxuXG5leHBvcnQgY2xhc3MgQWN0aW9uRGVmaW5pdGlvbiB7XG4gIGNvbnN0cnVjdG9yIChhY3Rpb25OYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gYWN0aW9uTmFtZVxuICAgIHRoaXMuY29uZmlnID0geyB9XG4gICAgdGhpcy5wYXJhbWV0ZXJzID0geyB9XG4gICAgdGhpcy5hbGlhc2VzID0ge31cbiAgICB0aGlzLnZhbGlkYXRvciA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWUgfVxuICAgIHRoaXMuZXhlY3V0b3IgPSBmdW5jdGlvbiAoKSB7IHRocm93ICgnRGVmaW5lIHlvdXIgb3duIGV4ZWN1dG9yIGZ1bmN0aW9uJykgfVxuICB9XG5cbiAgZ2V0IGFwaSAoKSB7XG4gICAgbGV0IGRlZiA9IHRoaXNcblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBhbGlhc2VzOiB0aGlzLmFsaWFzZXMsXG4gICAgICBleGVjdXRlOiB0aGlzLmV4ZWN1dG9yLFxuICAgICAgdmFsaWRhdGU6IHRoaXMudmFsaWRhdG9yLFxuICAgICAgcGFyYW1ldGVyczogdGhpcy5wYXJhbWV0ZXJzLFxuICAgICAgcnVubmVyOiBmdW5jdGlvbiAocGFyYW1zLCBhY3Rpb24pIHtcbiAgICAgICAgaWYgKGRlZi5hcGkudmFsaWRhdGUocGFyYW1zLCBhY3Rpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIGRlZi5hcGkuZXhlY3V0ZShwYXJhbXMsIGFjdGlvbilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFrYSAoLi4ubGlzdCkge1xuICAgIGxpc3QuZm9yRWFjaChhbGlhcyA9PiB7XG4gICAgICB0aGlzLmFsaWFzZXNbIHBhcmFtZXRlcml6ZSh1bmRlcnNjb3JlKGFsaWFzLnRvTG93ZXJDYXNlKCkpKSBdID0gdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBhbGlhc2VzICguLi5saXN0KSB7XG4gICAgdGhpcy5ha2EoLi4ubGlzdClcbiAgfVxuXG4gIHBhcmFtcyAoZm4pIHtcbiAgICB0aGlzLnBhcmFtQnVpbGRlcihmbilcbiAgfVxuXG4gIHJlcXVpcmVkIChmbikge1xuICAgIHRoaXMucGFyYW1CdWlsZGVyKGZuLCBmYWxzZSlcbiAgfVxuXG4gIG9wdGlvbmFsIChmbikge1xuICAgIHRoaXMucGFyYW1CdWlsZGVyKGZuKVxuICB9XG5cbiAgdmFsaWRhdGUgKGZuKSB7XG4gICAgdGhpcy52YWxpZGF0b3IgPSBmblxuICB9XG5cbiAgZXhlY3V0ZSAoZm4pIHtcbiAgICB0aGlzLmV4ZWN1dG9yID0gZm5cbiAgfVxuXG4gIHBhcmFtQnVpbGRlciAoZm4sIHJlcXVpcmVkKSB7XG4gIH1cbn1cblxuQWN0aW9uRGVmaW5pdGlvbi5jdXJyZW50ID0gY3VycmVudFxuQWN0aW9uRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24gPSBjbGVhckRlZmluaXRpb25cblxuZXhwb3J0IGZ1bmN0aW9uIERTTCAoZm4pIHtcbiAgbm9Db25mbGljdChmbiwgRFNMKSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rdXAoYWN0aW9uTmFtZSkge1xuICByZXR1cm4gdHJhY2tlclsoX2N1cnIgPSB0YWJlbGl6ZShwYXJhbWV0ZXJpemUoYWN0aW9uTmFtZSkpLnRvTG93ZXJDYXNlKCkpXVxufVxuXG5hc3NpZ24oRFNMLCB7XG4gIGFjdGlvbjogZnVuY3Rpb24gKGFjdGlvbk5hbWUpIHtcbiAgICB0cmFja2VyWyhfY3VyciA9IHRhYmVsaXplKHBhcmFtZXRlcml6ZShhY3Rpb25OYW1lKSkpXSA9IG5ldyBBY3Rpb25EZWZpbml0aW9uKGFjdGlvbk5hbWUpXG4gIH0sXG4gIGFsaWFzZXM6IGZ1bmN0aW9uICguLi5hcmdzKSB7IHRyYWNrZXJbX2N1cnJdLmFsaWFzZXMoLi4uYXJncykgfSxcbiAgYWthOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5ha2EoLi4uYXJncykgfSxcbiAgdmFsaWRhdGU6IGZ1bmN0aW9uICguLi5hcmdzKSB7IHRyYWNrZXJbX2N1cnJdLnZhbGlkYXRlKC4uLmFyZ3MpIH0sXG4gIGV4ZWN1dGU6IGZ1bmN0aW9uICguLi5hcmdzKSB7IHRyYWNrZXJbX2N1cnJdLmV4ZWN1dGUoLi4uYXJncykgfSxcbiAgcmVxdWlyZWQ6IGZ1bmN0aW9uICguLi5hcmdzKSB7IHRyYWNrZXJbX2N1cnJdLnJlcXVpcmVkKC4uLmFyZ3MpIH0sXG4gIG9wdGlvbmFsOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5vcHRpb25hbCguLi5hcmdzKSB9LFxuICBwYXJhbXM6IGZ1bmN0aW9uICguLi5hcmdzKSB7IHRyYWNrZXJbX2N1cnJdLnBhcmFtcyguLi5hcmdzKSB9XG59KVxuIl19