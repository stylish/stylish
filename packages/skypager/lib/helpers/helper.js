'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * Skypager.Helper
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * The Skypager.Helper is a way of specifying the interface and behavior of
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * different categories of javascript modules used by the project.  The different
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * categories of modules such as Actions or Models can provide their own DSLs through
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * the helper system.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _util = require('../util');

var util = _interopRequireWildcard(_util);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Helper = (function () {
  _createClass(Helper, null, [{
    key: 'fromDefinition',

    /*
    * Creates a Helper from a Definition object that was
    * created by a required' script file from one of the dedicated
    * locations for the type of helper.
    */
    value: function fromDefinition(uri, definition, options) {
      if (definition && options.required) {
        Object.defineProperty(definition, 'helperExport', {
          enumerable: false,
          get: function get() {
            return options.required;
          }
        });
      }

      var helper = new this(uri, Object.assign(options, { definition: definition }));

      Object.defineProperties(definition, {
        _helper: {
          enumerable: false,
          get: function get() {
            return helper;
          }
        },
        _requirePath: {
          enumerable: false,
          get: function get() {
            return uri;
          }
        }
      });

      return helper;
    }
  }]);

  function Helper(uri) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Helper);

    var helper = this;
    var raw = undefined;

    util.assign(this, {
      get raw() {
        return raw;
      },

      set raw(val) {
        raw = val;
        //helper.contentDidChange(helper)
      }
    });

    this.hidden('uri', uri);
    this.hidden('options', options);
    this.hidden('project', function () {
      return options.project;
    });
    this.getter('owner', function () {
      return options.owner;
    });
    this.getter('required', function () {
      return options.required || _this.require(uri);
    }, true);

    var definition = options.definition;

    // before returning the definition make sure to call any configure methods we have
    this.getter('definition', function () {
      var _this2 = this;

      var d = options.definition || this.required.definition;

      if (d && d.configure) {
        d.configure();
      }

      if (this.required && this.required.config) {
        Object.keys(this.required.config).forEach(function (key) {
          if (d && d.config && d.config[key]) {
            d.config[key] = Object.assign(_this2.required.config[key], d.config[key]);
          } else {
            d.config[key] = _this2.required.config[key];
          }
        });
      }

      return d;
    });

    this.id = this.paths.relative.replace(this.extension, '');

    this.hidden('api', function () {
      return _this.buildAPI(options.api, _this.required);
    });
  }

  /**
  * Every helper should expose an api with a function which is responsible
  * for handling calls to the run function that get dispatched to the helper.
  *
  */

  _createClass(Helper, [{
    key: 'run',
    value: function run() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var project = options.project || context.project || this.project;
      var fn = project ? this.runner.bind(project) : this.runner;

      return util.noConflict(function () {
        return fn(options, context);
      }, {
        project: project,
        skypager: _index2.default,
        util: util,
        currentHelper: this
      })();
    }
  }, {
    key: 'hidden',
    value: function hidden() {
      var _util$hidden;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_util$hidden = util.hidden).getter.apply(_util$hidden, [this].concat(args));
    }
  }, {
    key: 'lazy',
    value: function lazy() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return util.lazy.apply(util, [this].concat(args));
    }
  }, {
    key: 'buildAPI',
    value: function buildAPI(api) {
      if (api) {
        return api;
      }

      var mod = this.required;

      var runner = undefined;

      // if this helper module exported a function
      if (typeof mod === 'function') {
        runner = this.project ? mod.bind(this.project) : mod;

        return Object.assign(runner, {
          runner: runner,
          id: this.id,
          definition: this.definition
        });
      }

      if ((typeof mod === 'undefined' ? 'undefined' : _typeof(mod)) === 'object' && typeof mod.default === 'function') {
        return Object.assign(mod, {
          runner: this.project ? mod.default.bind(this.project) : mod.default,
          id: this.id,
          definition: this.definition
        });
      }

      if ((typeof mod === 'undefined' ? 'undefined' : _typeof(mod)) === 'object') {
        return Object.assign(this.definition.api || {}, mod);
      }

      throw 'There was a problem building an API for the helper id: ' + this.id + ' at ' + this.uri;
    }
  }, {
    key: 'require',
    value: function require(uri) {
      var result = module.require(uri);
      return result;
    }
  }, {
    key: 'contentWillChange',
    value: function contentWillChange(oldContent, newContent) {}
  }, {
    key: 'contentDidChange',
    value: function contentDidChange(asset) {}
  }, {
    key: 'getter',
    value: function getter(name, obj, configurable) {
      util.hide.getter(this, name, obj, configurable);
    }
  }, {
    key: 'idPath',
    get: function get() {
      return this.id.replace('-', '_').replace('/', '.');
    }
  }, {
    key: 'runner',
    get: function get() {
      return this.api.runner;
    }
  }, {
    key: 'paths',
    get: function get() {
      var asset = this;
      return {
        get summary() {
          var parts = asset.uri.split(/\/|\\/);
          return parts.reverse().slice(0, 3).reverse().join('/');
        },
        get relative() {
          return asset.uri.replace(asset.owner.root + '/', '');
        },
        get absolute() {
          return (0, _path.resolve)(asset.uri);
        }
      };
    }
  }, {
    key: 'extension',
    get: function get() {
      return (0, _path.extname)(this.uri);
    }
  }]);

  return Helper;
})();

exports.default = Helper;

Helper.apiMethods = [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2hlbHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFTWSxJQUFJOzs7Ozs7Ozs7Ozs7OztJQUtLLE1BQU07ZUFBTixNQUFNOzs7Ozs7OzttQ0FNRixHQUFHLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRTtBQUMvQyxVQUFHLFVBQVUsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO0FBQ2pDLGNBQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLGNBQWMsRUFBRTtBQUNoRCxvQkFBVSxFQUFFLEtBQUs7QUFDakIsYUFBRyxFQUFFLGVBQVc7QUFDZCxtQkFBTyxPQUFPLENBQUMsUUFBUSxDQUFBO1dBQ3hCO1NBQ0YsQ0FBQyxDQUFBO09BQ0g7O0FBRUQsVUFBSSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLEVBQUMsVUFBVSxFQUFWLFVBQVUsRUFBQyxDQUFDLENBQUMsQ0FBQTs7QUFFaEUsWUFBTSxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFBRTtBQUNsQyxlQUFPLEVBQUU7QUFDUCxvQkFBVSxFQUFFLEtBQUs7QUFDakIsYUFBRyxFQUFFLGVBQVU7QUFBRSxtQkFBTyxNQUFNLENBQUE7V0FBRTtTQUNqQztBQUNELG9CQUFZLEVBQUU7QUFDWixvQkFBVSxFQUFFLEtBQUs7QUFDakIsYUFBRyxFQUFFLGVBQVU7QUFBRSxtQkFBTyxHQUFHLENBQUE7V0FBRTtTQUM5QjtPQUNGLENBQUMsQ0FBQTs7QUFFRixhQUFPLE1BQU0sQ0FBQTtLQUNkOzs7QUFFRCxXQWhDbUIsTUFBTSxDQWdDWixHQUFHLEVBQWdCOzs7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQWhDWCxNQUFNOztBQWlDdkIsUUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBO0FBQ2pCLFFBQUksR0FBRyxZQUFBLENBQUE7O0FBRVAsUUFBSSxDQUFDLE1BQU0s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LGNBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3BDLGlCQUFPLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUN0RDtBQUNELFlBQUksUUFBUSxHQUFJO0FBQ2QsaUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1NBQ3JEO0FBQ0QsWUFBSSxRQUFRLEdBQUk7QUFDZCxpQkFBTyxVQS9KWSxPQUFPLEVBK0pYLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUMxQjtPQUNGLENBQUE7S0FDRjs7O3dCQVVnQjtBQUNmLGFBQU8sVUE3S08sT0FBTyxFQTZLTixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDekI7OztTQTVLa0IsTUFBTTs7O2tCQUFOLE1BQU07O0FBbUwzQixNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUcsQ0FBQSIsImZpbGUiOiJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNreXBhZ2VyLkhlbHBlclxuICpcbiAqIFRoZSBTa3lwYWdlci5IZWxwZXIgaXMgYSB3YXkgb2Ygc3BlY2lmeWluZyB0aGUgaW50ZXJmYWNlIGFuZCBiZWhhdmlvciBvZlxuICogZGlmZmVyZW50IGNhdGVnb3JpZXMgb2YgamF2YXNjcmlwdCBtb2R1bGVzIHVzZWQgYnkgdGhlIHByb2plY3QuICBUaGUgZGlmZmVyZW50XG4gKiBjYXRlZ29yaWVzIG9mIG1vZHVsZXMgc3VjaCBhcyBBY3Rpb25zIG9yIE1vZGVscyBjYW4gcHJvdmlkZSB0aGVpciBvd24gRFNMcyB0aHJvdWdoXG4gKiB0aGUgaGVscGVyIHN5c3RlbS5cbiovXG5pbXBvcnQgc2t5cGFnZXIgZnJvbSAnLi4vaW5kZXgnXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgeyBkaXJuYW1lLCBleHRuYW1lLCByZXNvbHZlLCBqb2luIH0gZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVscGVyIHtcbiAgLypcbiAgKiBDcmVhdGVzIGEgSGVscGVyIGZyb20gYSBEZWZpbml0aW9uIG9iamVjdCB0aGF0IHdhc1xuICAqIGNyZWF0ZWQgYnkgYSByZXF1aXJlZCcgc2NyaXB0IGZpbGUgZnJvbSBvbmUgb2YgdGhlIGRlZGljYXRlZFxuICAqIGxvY2F0aW9ucyBmb3IgdGhlIHR5cGUgb2YgaGVscGVyLlxuICAqL1xuICBzdGF0aWMgZnJvbURlZmluaXRpb24gKHVyaSwgZGVmaW5pdGlvbiwgb3B0aW9ucykge1xuICAgIGlmKGRlZmluaXRpb24gJiYgb3B0aW9ucy5yZXF1aXJlZCkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlZmluaXRpb24sICdoZWxwZXJFeHBvcnQnLCB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBvcHRpb25zLnJlcXVpcmVkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbGV0IGhlbHBlciA9IG5ldyB0aGlzKHVyaSwgT2JqZWN0LmFzc2lnbihvcHRpb25zLCB7ZGVmaW5pdGlvbn0pKVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZGVmaW5pdGlvbiwge1xuICAgICAgX2hlbHBlcjoge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gaGVscGVyIH1cbiAgICAgIH0sXG4gICAgICBfcmVxdWlyZVBhdGg6IHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHVyaSB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBoZWxwZXJcbiAgfVxuXG4gIGNvbnN0cnVjdG9yICh1cmksIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBoZWxwZXIgPSB0aGlzXG4gICAgbGV0IHJhd1xuXG4gICAgdXRpbC5hc3NpZ24odGhpcywge1xuICAgICAgZ2V0IHJhdyAoKSB7IHJldHVybiByYXcgfSxcblxuICAgICAgc2V0IHJhdyAodmFsKSB7XG4gICAgICAgIHJhdyA9IHZhbFxuICAgICAgICAvL2hlbHBlci5jb250ZW50RGlkQ2hhbmdlKGhlbHBlcilcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5oaWRkZW4oJ3VyaScsIHVyaSlcbiAgICB0aGlzLmhpZGRlbignb3B0aW9ucycsIG9wdGlvbnMpXG4gICAgdGhpcy5oaWRkZW4oJ3Byb2plY3QnLCAoKSA9PiBvcHRpb25zLnByb2plY3QpXG4gICAgdGhpcy5nZXR0ZXIoJ293bmVyJywgKCkgPT4gb3B0aW9ucy5vd25lcilcbiAgICB0aGlzLmdldHRlcigncmVxdWlyZWQnLCAoKCkgPT4gb3B0aW9ucy5yZXF1aXJlZCB8fCB0aGlzLnJlcXVpcmUodXJpKSksIHRydWUpXG5cbiAgICBsZXQgZGVmaW5pdGlvbiA9IG9wdGlvbnMuZGVmaW5pdGlvblxuXG4gICAgLy8gYmVmb3JlIHJldHVybmluZyB0aGUgZGVmaW5pdGlvbiBtYWtlIHN1cmUgdG8gY2FsbCBhbnkgY29uZmlndXJlIG1ldGhvZHMgd2UgaGF2ZVxuICAgIHRoaXMuZ2V0dGVyKCdkZWZpbml0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGQgPSBvcHRpb25zLmRlZmluaXRpb24gfHwgdGhpcy5yZXF1aXJlZC5kZWZpbml0aW9uXG5cbiAgICAgIGlmIChkICYmIGQuY29uZmlndXJlKSB7IGQuY29uZmlndXJlKCkgfVxuXG4gICAgICBpZih0aGlzLnJlcXVpcmVkICYmIHRoaXMucmVxdWlyZWQuY29uZmlnKXtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5yZXF1aXJlZC5jb25maWcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBpZihkICYmIGQuY29uZmlnICYmIGQuY29uZmlnW2tleV0pe1xuICAgICAgICAgICAgZC5jb25maWdba2V5XSA9IE9iamVjdC5hc3NpZ24odGhpcy5yZXF1aXJlZC5jb25maWdba2V5XSwgZC5jb25maWdba2V5XSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZC5jb25maWdba2V5XSA9IHRoaXMucmVxdWlyZWQuY29uZmlnW2tleV1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkXG4gICAgfSlcblxuICAgIHRoaXMuaWQgPSB0aGlzLnBhdGhzLnJlbGF0aXZlLnJlcGxhY2UodGhpcy5leHRlbnNpb24sICcnKVxuXG4gICAgdGhpcy5oaWRkZW4oJ2FwaScsICgpID0+IHRoaXMuYnVpbGRBUEkob3B0aW9ucy5hcGksIHRoaXMucmVxdWlyZWQpKVxuICB9XG5cbiAgLyoqXG4gICogRXZlcnkgaGVscGVyIHNob3VsZCBleHBvc2UgYW4gYXBpIHdpdGggYSBmdW5jdGlvbiB3aGljaCBpcyByZXNwb25zaWJsZVxuICAqIGZvciBoYW5kbGluZyBjYWxscyB0byB0aGUgcnVuIGZ1bmN0aW9uIHRoYXQgZ2V0IGRpc3BhdGNoZWQgdG8gdGhlIGhlbHBlci5cbiAgKlxuICAqL1xuICBydW4gKG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gICAgbGV0IHByb2plY3QgPSBvcHRpb25zLnByb2plY3QgfHwgY29udGV4dC5wcm9qZWN0IHx8IHRoaXMucHJvamVjdFxuICAgIGxldCBmbiA9IHByb2plY3QgPyB0aGlzLnJ1bm5lci5iaW5kKHByb2plY3QpIDogdGhpcy5ydW5uZXJcblxuICAgIHJldHVybiB1dGlsLm5vQ29uZmxpY3QoZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZm4ob3B0aW9ucywgY29udGV4dClcbiAgICB9LCB7XG4gICAgICBwcm9qZWN0LFxuICAgICAgc2t5cGFnZXIsXG4gICAgICB1dGlsLFxuICAgICAgY3VycmVudEhlbHBlcjogdGhpc1xuICAgIH0pKClcbiAgfVxuXG4gIGdldCBpZFBhdGggKCkge1xuICAgIHJldHVybiB0aGlzLmlkLnJlcGxhY2UoJy0nLCAnXycpLnJlcGxhY2UoJy8nLCAnLicpXG4gIH1cblxuICBoaWRkZW4gKC4uLmFyZ3MpIHsgcmV0dXJuIHV0aWwuaGlkZGVuLmdldHRlcih0aGlzLCAuLi5hcmdzKSB9XG5cbiAgbGF6eSAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5sYXp5KHRoaXMsIC4uLmFyZ3MpIH1cblxuICBidWlsZEFQSSAoYXBpKSB7XG4gICAgaWYgKGFwaSkgeyByZXR1cm4gYXBpIH1cblxuICAgIGxldCBtb2QgPSB0aGlzLnJlcXVpcmVkXG5cbiAgICBsZXQgcnVubmVyXG5cbiAgICAvLyBpZiB0aGlzIGhlbHBlciBtb2R1bGUgZXhwb3J0ZWQgYSBmdW5jdGlvblxuICAgIGlmICggdHlwZW9mIG1vZCA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJ1bm5lciA9IHRoaXMucHJvamVjdCA/IG1vZC5iaW5kKHRoaXMucHJvamVjdCkgOiBtb2RcblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ocnVubmVyLCB7XG4gICAgICAgIHJ1bm5lcixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGRlZmluaXRpb246IHRoaXMuZGVmaW5pdGlvblxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG1vZCA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZC5kZWZhdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihtb2QsIHtcbiAgICAgICAgcnVubmVyOiB0aGlzLnByb2plY3QgPyBtb2QuZGVmYXVsdC5iaW5kKHRoaXMucHJvamVjdCkgOiBtb2QuZGVmYXVsdCxcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGRlZmluaXRpb246IHRoaXMuZGVmaW5pdGlvblxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG1vZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHRoaXMuZGVmaW5pdGlvbi5hcGkgfHwge30sIG1vZClcbiAgICB9XG5cbiAgICB0aHJvdyAoJ1RoZXJlIHdhcyBhIHByb2JsZW0gYnVpbGRpbmcgYW4gQVBJIGZvciB0aGUgaGVscGVyIGlkOiAnICsgdGhpcy5pZCArICcgYXQgJyArIHRoaXMudXJpKVxuICB9XG5cbiAgZ2V0IHJ1bm5lciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBpLnJ1bm5lclxuICB9XG5cbiAgcmVxdWlyZSAodXJpKSB7XG4gICAgbGV0IHJlc3VsdCA9IG1vZHVsZS5yZXF1aXJlKHVyaSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBnZXQgcGF0aHMgKCkge1xuICAgIGxldCBhc3NldCA9IHRoaXNcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0IHN1bW1hcnkgKCkge1xuICAgICAgICBsZXQgcGFydHMgPSBhc3NldC51cmkuc3BsaXQoL1xcL3xcXFxcLylcbiAgICAgICAgcmV0dXJuIHBhcnRzLnJldmVyc2UoKS5zbGljZSgwLDMpLnJldmVyc2UoKS5qb2luKCcvJylcbiAgICAgIH0sXG4gICAgICBnZXQgcmVsYXRpdmUgKCkge1xuICAgICAgICByZXR1cm4gYXNzZXQudXJpLnJlcGxhY2UoYXNzZXQub3duZXIucm9vdCArICcvJywgJycpXG4gICAgICB9LFxuICAgICAgZ2V0IGFic29sdXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoYXNzZXQudXJpKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnRlbnRXaWxsQ2hhbmdlIChvbGRDb250ZW50LCBuZXdDb250ZW50KSB7XG5cbiAgfVxuXG4gIGNvbnRlbnREaWRDaGFuZ2UgKGFzc2V0KSB7XG5cbiAgfVxuXG4gIGdldCBleHRlbnNpb24gKCkge1xuICAgIHJldHVybiBleHRuYW1lKHRoaXMudXJpKVxuICB9XG5cbiAgZ2V0dGVyIChuYW1lLCBvYmosIGNvbmZpZ3VyYWJsZSkge1xuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgbmFtZSwgb2JqLCBjb25maWd1cmFibGUpXG4gIH1cbn1cblxuSGVscGVyLmFwaU1ldGhvZHMgPSBbIF1cbiJdfQ==