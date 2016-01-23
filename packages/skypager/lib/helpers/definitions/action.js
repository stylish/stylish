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
    this.description = '';
    this.config = {};
    this.interfaces = {};
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
    key: 'describe',
    value: function describe(value) {
      this.description = value;
    }
  }, {
    key: 'expose',
    value: function expose(platform, configurator) {
      this.interfaces[platform] = configurator;
    }
  }, {
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
  describe: function describe() {
    var _tracker$_curr;

    (_tracker$_curr = tracker[_curr]).describe.apply(_tracker$_curr, arguments);
  },
  aliases: function aliases() {
    var _tracker$_curr2;

    (_tracker$_curr2 = tracker[_curr]).aliases.apply(_tracker$_curr2, arguments);
  },
  aka: function aka() {
    var _tracker$_curr3;

    (_tracker$_curr3 = tracker[_curr]).aka.apply(_tracker$_curr3, arguments);
  },
  validate: function validate() {
    var _tracker$_curr4;

    (_tracker$_curr4 = tracker[_curr]).validate.apply(_tracker$_curr4, arguments);
  },
  execute: function execute() {
    var _tracker$_curr5;

    (_tracker$_curr5 = tracker[_curr]).execute.apply(_tracker$_curr5, arguments);
  },
  required: function required() {
    var _tracker$_curr6;

    (_tracker$_curr6 = tracker[_curr]).required.apply(_tracker$_curr6, arguments);
  },
  optional: function optional() {
    var _tracker$_curr7;

    (_tracker$_curr7 = tracker[_curr]).optional.apply(_tracker$_curr7, arguments);
  },
  params: function params() {
    var _tracker$_curr8;

    (_tracker$_curr8 = tracker[_curr]).params.apply(_tracker$_curr8, arguments);
  },
  expose: function expose() {
    var _tracker$_curr9;

    (_tracker$_curr9 = tracker[_curr]).expose.apply(_tracker$_curr9, arguments);
  },
  cli: function cli() {
    var _tracker$_curr10;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    (_tracker$_curr10 = tracker[_curr]).expose.apply(_tracker$_curr10, ['cli'].concat(args));
  },
  ipc: function ipc() {
    var _tracker$_curr11;

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    (_tracker$_curr11 = tracker[_curr]).expose.apply(_tracker$_curr11, ['ipc'].concat(args));
  },
  web: function web() {
    var _tracker$_curr12;

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    (_tracker$_curr12 = tracker[_curr]).expose.apply(_tracker$_curr12, ['web'].concat(args));
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2RlZmluaXRpb25zL2FjdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQXlGZ0IsR0FBRyxHQUFILEdBQUc7UUFJSCxNQUFNLEdBQU4sTUFBTTs7Ozs7O0FBcEZ0QixJQUFJLE9BQU8sR0FBRyxFQUFHLENBQUE7QUFDakIsSUFBSSxLQUFLLFlBQUEsQ0FBQTs7QUFFVCxTQUFTLE9BQU8sR0FBSTtBQUFFLFNBQU8sT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBO0NBQUU7QUFDN0MsU0FBUyxlQUFlLEdBQUk7QUFBRSxPQUFLLEdBQUcsSUFBSSxDQUFDLEFBQUMsT0FBTyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7Q0FBRTs7SUFFdEQsZ0JBQWdCLFdBQWhCLGdCQUFnQjtBQUMzQixXQURXLGdCQUFnQixDQUNkLFVBQVUsRUFBRTswQkFEZCxnQkFBZ0I7O0FBRXpCLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFBO0FBQ3RCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFBO0FBQ2hCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFBO0FBQ3BCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRyxDQUFBO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO0FBQ2pCLFFBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWTtBQUFFLGFBQU8sSUFBSSxDQUFBO0tBQUUsQ0FBQTtBQUM1QyxRQUFJLENBQUMsUUFBUSxHQUFHLFlBQVk7QUFBRSxZQUFPLG1DQUFtQyxDQUFDO0tBQUUsQ0FBQTtHQUM1RTs7ZUFWVSxnQkFBZ0I7OzZCQVlsQixLQUFLLEVBQUU7QUFDZCxVQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtLQUN6Qjs7OzJCQUVPLFFBQVEsRUFBRSxZQUFZLEVBQUU7QUFDOUIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxR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QUFNLE1BQUEsb0JBQUMsS0FBSyxTQUFLLElBQUksRUFBQyxDQUFBO0dBQUU7Q0FDakUsQ0FBQyxDQUFBIiwiZmlsZSI6ImFjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIGFzc2lnbixcbiAgbm9Db25mbGljdCxcbiAgdGFiZWxpemUsXG4gIHBhcmFtZXRlcml6ZSxcbiAgc2luZ3VsYXJpemUsXG4gIHVuZGVyc2NvcmVcbn0gZnJvbSAnLi4vLi4vdXRpbCdcblxubGV0IHRyYWNrZXIgPSB7IH1cbmxldCBfY3VyclxuXG5mdW5jdGlvbiBjdXJyZW50ICgpIHsgcmV0dXJuIHRyYWNrZXJbX2N1cnJdIH1cbmZ1bmN0aW9uIGNsZWFyRGVmaW5pdGlvbiAoKSB7IF9jdXJyID0gbnVsbDsgZGVsZXRlIHRyYWNrZXJbX2N1cnJdIH1cblxuZXhwb3J0IGNsYXNzIEFjdGlvbkRlZmluaXRpb24ge1xuICBjb25zdHJ1Y3RvciAoYWN0aW9uTmFtZSkge1xuICAgIHRoaXMubmFtZSA9IGFjdGlvbk5hbWVcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gJydcbiAgICB0aGlzLmNvbmZpZyA9IHt9XG4gICAgdGhpcy5pbnRlcmZhY2VzID0ge31cbiAgICB0aGlzLnBhcmFtZXRlcnMgPSB7IH1cbiAgICB0aGlzLmFsaWFzZXMgPSB7fVxuICAgIHRoaXMudmFsaWRhdG9yID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZSB9XG4gICAgdGhpcy5leGVjdXRvciA9IGZ1bmN0aW9uICgpIHsgdGhyb3cgKCdEZWZpbmUgeW91ciBvd24gZXhlY3V0b3IgZnVuY3Rpb24nKSB9XG4gIH1cblxuICBkZXNjcmliZSh2YWx1ZSkge1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSB2YWx1ZVxuICB9XG5cbiAgZXhwb3NlIChwbGF0Zm9ybSwgY29uZmlndXJhdG9yKSB7XG4gICAgdGhpcy5pbnRlcmZhY2VzW3BsYXRmb3JtXSA9IGNvbmZpZ3VyYXRvclxuICB9XG5cbiAgZ2V0IGFwaSAoKSB7XG4gICAgbGV0IGRlZiA9IHRoaXNcblxuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBhbGlhc2VzOiB0aGlzLmFsaWFzZXMsXG4gICAgICBleGVjdXRlOiB0aGlzLmV4ZWN1dG9yLFxuICAgICAgdmFsaWRhdGU6IHRoaXMudmFsaWRhdG9yLFxuICAgICAgcGFyYW1ldGVyczogdGhpcy5wYXJhbWV0ZXJzLFxuICAgICAgcnVubmVyOiBmdW5jdGlvbiAocGFyYW1zLCBhY3Rpb24pIHtcbiAgICAgICAgaWYgKGRlZi5hcGkudmFsaWRhdGUocGFyYW1zLCBhY3Rpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIGRlZi5hcGkuZXhlY3V0ZShwYXJhbXMsIGFjdGlvbilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFrYSAoLi4ubGlzdCkge1xuICAgIGxpc3QuZm9yRWFjaChhbGlhcyA9PiB7XG4gICAgICB0aGlzLmFsaWFzZXNbIHBhcmFtZXRlcml6ZSh1bmRlcnNjb3JlKGFsaWFzLnRvTG93ZXJDYXNlKCkpKSBdID0gdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBhbGlhc2VzICguLi5saXN0KSB7XG4gICAgdGhpcy5ha2EoLi4ubGlzdClcbiAgfVxuXG4gIHBhcmFtcyAoZm4pIHtcbiAgICB0aGlzLnBhcmFtQnVpbGRlcihmbilcbiAgfVxuXG4gIHJlcXVpcmVkIChmbikge1xuICAgIHRoaXMucGFyYW1CdWlsZGVyKGZuLCBmYWxzZSlcbiAgfVxuXG4gIG9wdGlvbmFsIChmbikge1xuICAgIHRoaXMucGFyYW1CdWlsZGVyKGZuKVxuICB9XG5cbiAgdmFsaWRhdGUgKGZuKSB7XG4gICAgdGhpcy52YWxpZGF0b3IgPSBmblxuICB9XG5cbiAgZXhlY3V0ZSAoZm4pIHtcbiAgICB0aGlzLmV4ZWN1dG9yID0gZm5cbiAgfVxuXG4gIHBhcmFtQnVpbGRlciAoZm4sIHJlcXVpcmVkKSB7XG4gIH1cbn1cblxuQWN0aW9uRGVmaW5pdGlvbi5jdXJyZW50ID0gY3VycmVudFxuQWN0aW9uRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24gPSBjbGVhckRlZmluaXRpb25cblxuZXhwb3J0IGZ1bmN0aW9uIERTTCAoZm4pIHtcbiAgbm9Db25mbGljdChmbiwgRFNMKSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rdXAoYWN0aW9uTmFtZSkge1xuICByZXR1cm4gdHJhY2tlclsoX2N1cnIgPSB0YWJlbGl6ZShwYXJhbWV0ZXJpemUoYWN0aW9uTmFtZSkpLnRvTG93ZXJDYXNlKCkpXVxufVxuXG5hc3NpZ24oRFNMLCB7XG4gIGFjdGlvbjogZnVuY3Rpb24gKGFjdGlvbk5hbWUpIHtcbiAgICB0cmFja2VyWyhfY3VyciA9IHRhYmVsaXplKHBhcmFtZXRlcml6ZShhY3Rpb25OYW1lKSkpXSA9IG5ldyBBY3Rpb25EZWZpbml0aW9uKGFjdGlvbk5hbWUpXG4gIH0sXG4gIGRlc2NyaWJlOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5kZXNjcmliZSguLi5hcmdzKSB9LFxuICBhbGlhc2VzOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5hbGlhc2VzKC4uLmFyZ3MpIH0sXG4gIGFrYTogZnVuY3Rpb24gKC4uLmFyZ3MpIHsgdHJhY2tlcltfY3Vycl0uYWthKC4uLmFyZ3MpIH0sXG4gIHZhbGlkYXRlOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS52YWxpZGF0ZSguLi5hcmdzKSB9LFxuICBleGVjdXRlOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5leGVjdXRlKC4uLmFyZ3MpIH0sXG4gIHJlcXVpcmVkOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5yZXF1aXJlZCguLi5hcmdzKSB9LFxuICBvcHRpb25hbDogZnVuY3Rpb24gKC4uLmFyZ3MpIHsgdHJhY2tlcltfY3Vycl0ub3B0aW9uYWwoLi4uYXJncykgfSxcbiAgcGFyYW1zOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5wYXJhbXMoLi4uYXJncykgfSxcbiAgZXhwb3NlOiBmdW5jdGlvbiguLi5hcmdzKSB7IHRyYWNrZXJbX2N1cnJdLmV4cG9zZSguLi5hcmdzKSB9LFxuICBjbGk6IGZ1bmN0aW9uKC4uLmFyZ3MpIHsgdHJhY2tlcltfY3Vycl0uZXhwb3NlKCdjbGknLCAuLi5hcmdzKSB9LFxuICBpcGM6IGZ1bmN0aW9uKC4uLmFyZ3MpIHsgdHJhY2tlcltfY3Vycl0uZXhwb3NlKCdpcGMnLCAuLi5hcmdzKSB9LFxuICB3ZWI6IGZ1bmN0aW9uKC4uLmFyZ3MpIHsgdHJhY2tlcltfY3Vycl0uZXhwb3NlKCd3ZWInLCAuLi5hcmdzKSB9XG59KVxuIl19