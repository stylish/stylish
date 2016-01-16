'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginDefinition = undefined;
exports.DSL = DSL;
exports.lookup = lookup;

var _util = require('../../util');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9oZWxwZXJzL2RlZmluaXRpb25zL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQXVGZ0IsR0FBRyxHQUFILEdBQUc7UUFJSCxNQUFNLEdBQU4sTUFBTTs7Ozs7O0FBekZ0QixJQUFJLE9BQU8sR0FBRyxFQUFHLENBQUE7QUFDakIsSUFBSSxLQUFLLFlBQUEsQ0FBQTs7QUFFVCxTQUFTLE9BQU8sR0FBaUI7TUFBZixLQUFLLHlEQUFHLEtBQUs7O0FBQzdCLE1BQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTs7QUFFdEIsTUFBSSxLQUFLLEVBQUU7QUFBRSxXQUFRLE9BQU8sQ0FBQyxLQUFLLENBQUMsQUFBQyxDQUFBO0dBQUU7O0FBRXRDLFNBQU8sQ0FBQyxDQUFBO0NBQ1Q7O0lBRVksZ0JBQWdCLFdBQWhCLGdCQUFnQjtBQUMzQixXQURXLGdCQUFnQixDQUNkLFVBQVUsRUFBZ0I7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQixnQkFBZ0I7O0FBRXpCLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFBOztBQUV0QixRQUFJLENBQUMsTUFBTSxHQUFHO0FBQ1osYUFBTyxFQUFFLEVBQUc7QUFDWixrQkFBWSxFQUFFLEVBQUU7QUFDaEIsZUFBUyxFQUFFLEVBQUU7QUFDYixjQUFRLEVBQUUsRUFBRztBQUNiLG9CQUFjLEVBQUUsMEJBQVk7QUFDMUIsZUFBTyxJQUFJLENBQUE7T0FDWjtLQUNGLENBQUE7O0FBRUQsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7R0FDdkI7O2VBZlUsZ0JBQWdCOzs7Ozs7Ozs2QkFtQ2pCLElBQUksRUFBRSxLQUFLLEVBQUU7QUFDckIsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUE7T0FDbkM7O0FBRUQsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFB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QUU7QUFDdkQsY0FBWSxFQUFFLHdCQUFtQjs7O0FBQUUsdUJBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFDLFlBQVksTUFBQSw0QkFBUyxDQUFBO0dBQUU7QUFDekUsYUFBVyxFQUFFLHVCQUFtQjs7O0FBQUUsdUJBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFDLFdBQVcsTUFBQSw0QkFBUyxDQUFBO0dBQUU7QUFDdkUsUUFBTSxFQUFFLGtCQUFtQjs7O0FBQUUsdUJBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFDLE1BQU0sTUFBQSw0QkFBUyxDQUFBO0dBQUU7Q0FDOUQsQ0FBQyxDQUFBIiwiZmlsZSI6InBsdWdpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzaWduLCBub0NvbmZsaWN0LCB0YWJlbGl6ZSwgcGFyYW1ldGVyaXplLCBzaW5ndWxhcml6ZSwgdW5kZXJzY29yZX0gZnJvbSAnLi4vLi4vdXRpbCdcblxubGV0IHRyYWNrZXIgPSB7IH1cbmxldCBfY3VyclxuXG5mdW5jdGlvbiBjdXJyZW50IChjbGVhciA9IGZhbHNlKSB7XG4gIGxldCBjID0gdHJhY2tlcltfY3Vycl1cblxuICBpZiAoY2xlYXIpIHsgZGVsZXRlICh0cmFja2VyW19jdXJyXSkgfVxuXG4gIHJldHVybiBjXG59XG5cbmV4cG9ydCBjbGFzcyBQbHVnaW5EZWZpbml0aW9uIHtcbiAgY29uc3RydWN0b3IgKHBsdWdpbk5hbWUsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMubmFtZSA9IHBsdWdpbk5hbWVcblxuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgYWxpYXNlczogWyBdLFxuICAgICAgZGVwZW5kZW5jaWVzOiBbXSxcbiAgICAgIG1vZGlmaWVyczogW10sXG4gICAgICBwcm92aWRlczogeyB9LFxuICAgICAgc3VwcG9ydENoZWNrZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnZlcnNpb24gPSAnMC4wLjEnXG4gIH1cblxuICBnZXQgYXBpICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgYWxpYXNlczogdGhpcy5jb25maWcuYWxpYXNlcyxcbiAgICAgIGRlcGVuZGVuY2llczogdGhpcy5jb25maWcuZGVwZW5kZW5jaWVzLFxuICAgICAgbW9kaWZpZXJzOiB0aGlzLmNvbmZpZy5tb2RpZmllcnMsXG4gICAgICBtb2RpZnk6IHRoaXMuY29uZmlnLm1vZGlmaWVyc1swXSxcbiAgICAgIHZlcnNpb246IHRoaXMudmVyc2lvbixcbiAgICAgIHJ1bm5lcjogdGhpcy5ydW5uZXIsXG4gICAgICBwcm92aWRlczogdGhpcy5wcm92aWRlc1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIFdoYXQgZG9lcyB0aGlzIHBsdWdpbiBwcm92aWRlPyBWYWxpZCBvcHRpb25zIGFyZTpcbiAgKiAtIGhlbHBlcnM6IGFjdGlvbiwgZXhwb3J0ZXIsIGltcG9ydGVyLCBtb2RlbCwgdmlldywgc3RvcmVcbiAgKiAtIGNvbmZpZ3VyYXRpb246IGFkZGl0aW9ucyB0byB0aGUgY29uZmlndXJhdGlvbiBzY2hlbWFcbiAgKi9cbiAgcHJvdmlkZXMgKHdoYXQsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmNvbmZpZy5wcm92aWRlc1t3aGF0XSA9IHZhbHVlXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuY29uZmlnLnByb3ZpZGVzW3doYXRdXG4gIH1cblxuICBydW5uZXIgKC4uLmFyZ3MpIHtcbiAgICBpZiAodGhpcy5jb25maWcuc3VwcG9ydENoZWNrZXIoLi4uYXJncykpIHtcbiAgICAgIHRoaXMubW9kaWZpZXJzLmZvckVhY2goZm4gPT4gZm4oLi4uYXJncykpXG4gICAgfVxuICB9XG5cbiAgYWthICguLi5saXN0KSB7XG4gICAgdGhpcy5jb25maWcuYWxpYXNlcyA9IHRoaXMuY29uZmlnLmFsaWFzZXMuY29uY2F0KGxpc3QpXG4gIH1cblxuICBhbGlhc2VzICguLi5saXN0KSB7XG4gICAgdGhpcy5ha2EoLi4ubGlzdClcbiAgfVxuXG4gIGRlcGVuZGVuY2llcyAoLi4ubGlzdCkge1xuICAgIHRoaXMuY29uZmlnLmRlcGVuZGVuY2llcyA9IHRoaXMuY29uZmlnLmRlcGVuZGVuY2llcy5jb25jYXQobGlzdClcbiAgfVxuXG4gIG1vZGlmeSAoLi4ubW9kaWZpZXJzKSB7XG4gICAgdGhpcy5jb25maWcubW9kaWZpZXJzID0gdGhpcy5jb25maWcubW9kaWZpZXJzLmNvbmNhdChtb2RpZmllcnMpXG4gIH1cblxuICBpc1N1cHBvcnRlZCAoZm4pIHtcbiAgICB0aGlzLmNvbmZpZy5zdXBwb3J0Q2hlY2tlciA9IGZuXG4gIH1cblxufVxuXG5QbHVnaW5EZWZpbml0aW9uLmN1cnJlbnQgPSBjdXJyZW50XG5QbHVnaW5EZWZpbml0aW9uLmNsZWFyRGVmaW5pdGlvbiA9IGZ1bmN0aW9uKCkgeyBjdXJyZW50KHRydWUpIH1cblxuZXhwb3J0IGZ1bmN0aW9uIERTTCAoZm4pIHtcbiAgbm9Db25mbGljdChmbiwgRFNMKSgpXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb29rdXAocGx1Z2luTmFtZSkge1xuICByZXR1cm4gdHJhY2tlclsoX2N1cnIgPSB0YWJlbGl6ZShwYXJhbWV0ZXJpemUocGx1Z2luTmFtZSkpLnRvTG93ZXJDYXNlKCkpXVxufVxuXG5hc3NpZ24oRFNMLCB7XG4gIHBsdWdpbjogZnVuY3Rpb24gKHBsdWdpbk5hbWUpIHtcbiAgICB0cmFja2VyWyhfY3VyciA9IHRhYmVsaXplKHBhcmFtZXRlcml6ZShwbHVnaW5OYW1lKSkpXSA9IG5ldyBQbHVnaW5EZWZpbml0aW9uKHBsdWdpbk5hbWUpXG4gIH0sXG4gIGFsaWFzZXM6IGZ1bmN0aW9uICguLi5hcmdzKSB7IHRyYWNrZXJbX2N1cnJdLmFsaWFzZXMoLi4uYXJncykgfSxcbiAgYWthOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5ha2EoLi4uYXJncykgfSxcbiAgZGVwZW5kZW5jaWVzOiBmdW5jdGlvbiAoLi4uYXJncykgeyB0cmFja2VyW19jdXJyXS5kZXBlbmRlbmNpZXMoLi4uYXJncykgfSxcbiAgaXNTdXBwb3J0ZWQ6IGZ1bmN0aW9uICguLi5hcmdzKSB7IHRyYWNrZXJbX2N1cnJdLmlzU3VwcG9ydGVkKC4uLmFyZ3MpIH0sXG4gIG1vZGlmeTogZnVuY3Rpb24gKC4uLmFyZ3MpIHsgdHJhY2tlcltfY3Vycl0ubW9kaWZ5KC4uLmFyZ3MpIH1cbn0pXG4iXX0=