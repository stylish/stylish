'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginDefinition = undefined;
exports.DSL = DSL;
exports.lookup = lookup;

var _util = require('../../util');

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var tracker = {};
var _curr = undefined;

function current() {
  var clear = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

  var c = tracker[_curr];

  if (clear) {
    delete tracker[_curr];
  }

  return c;
}

var PluginDefinition = exports.PluginDefinition = (function () {
  function PluginDefinition(pluginName) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, PluginDefinition);

    this.name = pluginName;

    this.config = {
      aliases: [],
      dependencies: [],
      modifiers: [],
      provides: {},
      supportChecker: function supportChecker() {
        return true;
      }
    };

    this.version = '0.0.1';
  }

  _createClass(PluginDefinition, [{
    key: 'provides',

    /**
    * What does this plugin provide? Valid options are:
    * - helpers: action, exporter, importer, model, view, store
    * - configuration: additions to the configuration schema
    */
    value: function provides(what, value) {
      if ((typeof what === 'undefined' ? 'undefined' : _typeof(what)) === 'object' && !value) {
        return this.config.provides = Object.assign(this.config.provides, what);
      }

      if (value) {
        this.config.provides[what] = value;
      }

      return this.config.provides[what];
    }
  }, {
    key: 'runner',
    value: function runner() {
      var _config;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if ((_config = this.config).supportChecker.apply(_config, args)) {
        this.modifiers.forEach(function (fn) {
          return fn.apply(undefined, args);
        });
      }
    }
  }, {
    key: 'aka',
    value: function aka() {
      for (var _len2 = arguments.length, list = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        list[_key2] = arguments[_key2];
      }

      this.config.aliases = this.config.aliases.concat(list);
    }
  }, {
    key: 'aliases',
    value: function aliases() {
      this.aka.apply(this, arguments);
    }
  }, {
    key: 'dependencies',
    value: function dependencies() {
      for (var _len3 = arguments.length, list = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        list[_key3] = arguments[_key3];
      }

      this.config.dependencies = this.config.dependencies.concat(list);
    }
  }, {
    key: 'modify',
    value: function modify() {
      for (var _len4 = arguments.length, modifiers = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        modifiers[_key4] = arguments[_key4];
      }

      this.config.modifiers = this.config.modifiers.concat(modifiers);
    }
  }, {
    key: 'isSupported',
    value: function isSupported(fn) {
      this.config.supportChecker = fn;
    }
  }, {
    key: 'api',
    get: function get() {
      return {
        name: this.name,
        aliases: this.config.aliases,
        dependencies: this.config.dependencies,
        modifiers: this.config.modifiers,
        modify: this.config.modifiers[0],
        version: this.version,
        runner: this.runner,
        provides: this.provides
      };
    }
  }]);

  return PluginDefinition;
})();

PluginDefinition.current = current;
PluginDefinition.clearDefinition = function () {
  current(true);
};

function DSL(fn) {
  (0, _util.noConflict)(fn, DSL)();
}

function lookup(pluginName) {
  return tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(pluginName)).toLowerCase()];
}

(0, _util.assign)(DSL, {
  plugin: function plugin(pluginName) {
    tracker[_curr = (0, _util.tabelize)((0, _util.parameterize)(pluginName))] = new PluginDefinition(pluginName);
  },
  aliases: function aliases() {
    var _tracker$_curr;

    (_tracker$_curr = tracker[_curr]).aliases.apply(_tracker$_curr, arguments);
  },
  aka: function aka() {
    var _tracker$_curr2;

    (_tracker$_curr2 = tracker[_curr]).aka.apply(_tracker$_curr2, arguments);
  },
  dependencies: function dependencies() {
    var _tracker$_curr3;

    (_tracker$_curr3 = tracker[_curr]).dependencies.apply(_tracker$_curr3, arguments);
  },
  isSupported: function isSupported() {
    var _tracker$_curr4;

    (_tracker$_curr4 = tracker[_curr]).isSupported.apply(_tracker$_curr4, arguments);
  },
  modify: function modify() {
    var _tracker$_curr5;

    (_tracker$_curr5 = tracker[_curr]).modify.apply(_tracker$_curr5, arguments);
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2RlZmluaXRpb25zL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQTJGZ0IsR0FBRyxHQUFILEdBQUc7UUFJSCxNQUFNLEdBQU4sTUFBTTs7Ozs7Ozs7QUE3RnRCLElBQUksT0FBTyxHQUFHLEVBQUcsQ0FBQTtBQUNqQixJQUFJLEtBQUssWUFBQSxDQUFBOztBQUVULFNBQVMsT0FBTyxHQUFpQjtNQUFmLEtBQUsseURBQUcsS0FBSzs7QUFDN0IsTUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBOztBQUV0QixNQUFJLEtBQUssRUFBRTtBQUFFLFdBQVEsT0FBTyxDQUFDLEtBQUssQ0FBQyxBQUFDLENBQUE7R0FBRTs7QUFFdEMsU0FBTyxDQUFDLENBQUE7Q0FDVDs7SUFFWSxnQkFBZ0IsV0FBaEIsZ0JBQWdCO0FBQzNCLFdBRFcsZ0JBQWdCLENBQ2QsVUFBVSxFQUFnQjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBRDFCLGdCQUFnQjs7QUFFekIsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUE7O0FBRXRCLFFBQUksQ0FBQyxNQUFNLEdBQUc7QUFDWixhQUFPLEVBQUUsRUFBRztBQUNaLGtCQUFZLEVBQUUsRUFBRTtBQUNoQixlQUFTLEVBQUUsRUFBRTtBQUNiLGNBQVEsRUFBRSxFQUFHO0FBQ2Isb0JBQWMsRUFBRSwwQkFBWTtBQUMxQixlQUFPLElBQUksQ0FBQTtPQUNaO0tBQ0YsQ0FBQTs7QUFFRCxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtHQUN2Qjs7ZUFmVSxnQkFBZ0I7Ozs7Ozs7OzZCQW1DakIsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUNyQixVQUFJLFFBQU8sSUFBSSx5Q0FBSixJQUFJLE9BQUssUUFBUSxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ3RDLGVBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0s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O0dBQ3pGO0FBQ0QsU0FBTyxFQUFFLG1CQUFtQjs7O0FBQUUsc0JBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFDLE9BQU8sTUFBQSwyQkFBUyxDQUFBO0dBQUU7QUFDL0QsS0FBRyxFQUFFLGVBQW1COzs7QUFBRSx1QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUMsR0FBRyxNQUFBLDRCQUFTLENBQUE7R0FBRTtBQUN2RCxjQUFZLEVBQUUsd0JBQW1COzs7QUFBRSx1QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUMsWUFBWSxNQUFBLDRCQUFTLENBQUE7R0FBRTtBQUN6RSxhQUFXLEVBQUUsdUJBQW1COzs7QUFBRSx1QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUMsV0FBVyxNQUFBLDRCQUFTLENBQUE7R0FBRTtBQUN2RSxRQUFNLEVBQUUsa0JBQW1COzs7QUFBRSx1QkFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUMsTUFBTSxNQUFBLDRCQUFTLENBQUE7R0FBRTtDQUM5RCxDQUFDLENBQUEiLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NpZ24sIG5vQ29uZmxpY3QsIHRhYmVsaXplLCBwYXJhbWV0ZXJpemUsIHNpbmd1bGFyaXplLCB1bmRlcnNjb3JlfSBmcm9tICcuLi8uLi91dGlsJ1xuXG5sZXQgdHJhY2tlciA9IHsgfVxubGV0IF9jdXJyXG5cbmZ1bmN0aW9uIGN1cnJlbnQgKGNsZWFyID0gZmFsc2UpIHtcbiAgbGV0IGMgPSB0cmFja2VyW19jdXJyXVxuXG4gIGlmIChjbGVhcikgeyBkZWxldGUgKHRyYWNrZXJbX2N1cnJdKSB9XG5cbiAgcmV0dXJuIGNcbn1cblxuZXhwb3J0IGNsYXNzIFBsdWdpbkRlZmluaXRpb24ge1xuICBjb25zdHJ1Y3RvciAocGx1Z2luTmFtZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5uYW1lID0gcGx1Z2luTmFtZVxuXG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBhbGlhc2VzOiBbIF0sXG4gICAgICBkZXBlbmRlbmNpZXM6IFtdLFxuICAgICAgbW9kaWZpZXJzOiBbXSxcbiAgICAgIHByb3ZpZGVzOiB7IH0sXG4gICAgICBzdXBwb3J0Q2hlY2tlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudmVyc2lvbiA9ICcwLjAuMSdcbiAgfVxuXG4gIGdldCBhcGkgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiB0aGlzLm5hbWUsXG4gICAgICBhbGlhc2VzOiB0aGlzLmNvbmZpZy5hbGlhc2VzLFxuICAgICAgZGVwZW5kZW5jaWVzOiB0aGlzLmNvbmZpZy5kZXBlbmRlbmNpZXMsXG4gICAgICBtb2RpZmllcnM6IHRoaXMuY29uZmlnLm1vZGlmaWVycyxcbiAgICAgIG1vZGlmeTogdGhpcy5jb25maWcubW9kaWZpZXJzWzBdLFxuICAgICAgdmVyc2lvbjogdGhpcy52ZXJzaW9uLFxuICAgICAgcnVubmVyOiB0aGlzLnJ1bm5lcixcbiAgICAgIHByb3ZpZGVzOiB0aGlzLnByb3ZpZGVzXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICogV2hhdCBkb2VzIHRoaXMgcGx1Z2luIHByb3ZpZGU/IFZhbGlkIG9wdGlvbnMgYXJlOlxuICAqIC0gaGVscGVyczogYWN0aW9uLCBleHBvcnRlciwgaW1wb3J0ZXIsIG1vZGVsLCB2aWV3LCBzdG9yZVxuICAqIC0gY29uZmlndXJhdGlvbjogYWRkaXRpb25zIHRvIHRoZSBjb25maWd1cmF0aW9uIHNjaGVtYVxuICAqL1xuICBwcm92aWRlcyAod2hhdCwgdmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHdoYXQgPT09ICdvYmplY3QnICYmICF2YWx1ZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29uZmlnLnByb3ZpZGVzID0gT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZy5wcm92aWRlcywgd2hhdClcbiAgICB9XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuY29uZmlnLnByb3ZpZGVzW3doYXRdID0gdmFsdWVcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jb25maWcucHJvdmlkZXNbd2hhdF1cbiAgfVxuXG4gIHJ1bm5lciAoLi4uYXJncykge1xuICAgIGlmICh0aGlzLmNvbmZpZy5zdXBwb3J0Q2hlY2tlciguLi5hcmdzKSkge1xuICAgICAgdGhpcy5tb2RpZmllcnMuZm9yRWFjaChmbiA9PiBmbiguLi5hcmdzKSlcbiAgICB9XG4gIH1cblxuICBha2EgKC4uLmxpc3QpIHtcbiAgICB0aGlzLmNvbmZpZy5hbGlhc2VzID0gdGhpcy5jb25maWcuYWxpYXNlcy5jb25jYXQobGlzdClcbiAgfVxuXG4gIGFsaWFzZXMgKC4uLmxpc3QpIHtcbiAgICB0aGlzLmFrYSguLi5saXN0KVxuICB9XG5cbiAgZGVwZW5kZW5jaWVzICguLi5saXN0KSB7XG4gICAgdGhpcy5jb25maWcuZGVwZW5kZW5jaWVzID0gdGhpcy5jb25maWcuZGVwZW5kZW5jaWVzLmNvbmNhdChsaXN0KVxuICB9XG5cbiAgbW9kaWZ5ICguLi5tb2RpZmllcnMpIHtcbiAgICB0aGlzLmNvbmZpZy5tb2RpZmllcnMgPSB0aGlzLmNvbmZpZy5tb2RpZmllcnMuY29uY2F0KG1vZGlmaWVycylcbiAgfVxuXG4gIGlzU3VwcG9ydGVkIChmbikge1xuICAgIHRoaXMuY29uZmlnLnN1cHBvcnRDaGVja2VyID0gZm5cbiAgfVxuXG59XG5cblBsdWdpbkRlZmluaXRpb24uY3VycmVudCA9IGN1cnJlbnRcblBsdWdpbkRlZmluaXRpb24uY2xlYXJEZWZpbml0aW9uID0gZnVuY3Rpb24oKSB7IGN1cnJlbnQodHJ1ZSkgfVxuXG5leHBvcnQgZnVuY3Rpb24gRFNMIChmbikge1xuICBub0NvbmZsaWN0KGZuLCBEU0wpKClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxvb2t1cChwbHVnaW5OYW1lKSB7XG4gIHJldHVybiB0cmFja2VyWyhfY3VyciA9IHRhYmVsaXplKHBhcmFtZXRlcml6ZShwbHVnaW5OYW1lKSkudG9Mb3dlckNhc2UoKSldXG59XG5cbmFzc2lnbihEU0wsIHtcbiAgcGx1Z2luOiBmdW5jdGlvbiAocGx1Z2luTmFtZSkge1xuICAgIHRyYWNrZXJbKF9jdXJyID0gdGFiZWxpemUocGFyYW1ldGVyaXplKHBsdWdpbk5hbWUpKSldID0gbmV3IFBsdWdpbkRlZmluaXRpb24ocGx1Z2luTmFtZSlcbiAgfSxcbiAgYWxpYXNlczogZnVuY3Rpb24gKC4uLmFyZ3MpIHsgdHJhY2tlcltfY3Vycl0uYWxpYXNlcyguLi5hcmdzKSB9LFxuICBha2E6IGZ1bmN0aW9uICguLi5hcmdzKSB7IHRyYWNrZXJbX2N1cnJdLmFrYSguLi5hcmdzKSB9LFxuICBkZXBlbmRlbmNpZXM6IGZ1bmN0aW9uICguLi5hcmdzKSB7IHRyYWNrZXJbX2N1cnJdLmRlcGVuZGVuY2llcyguLi5hcmdzKSB9LFxuICBpc1N1cHBvcnRlZDogZnVuY3Rpb24gKC4uLmFyZ3MpIHsgdHJhY2tlcltfY3Vycl0uaXNTdXBwb3J0ZWQoLi4uYXJncykgfSxcbiAgbW9kaWZ5OiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5tb2RpZnkoLi4uYXJncykgfVxufSlcbiJdfQ==