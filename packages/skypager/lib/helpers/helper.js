'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util');

var util = _interopRequireWildcard(_util);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Helper = (function () {
  _createClass(Helper, null, [{
    key: 'fromDefinition',
    value: function fromDefinition(uri, definition, options) {
      if (definition && options.required) {
        definition.helperExport = options.required;
      }

      var helper = new this(uri, Object.assign(options, { definition: definition }));

      Object.assign(definition, {
        get _helper() {
          return helper;
        },
        get _requirePath() {
          return uri;
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
      var _runner;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this.project ? (_runner = this.runner).call.apply(_runner, [this.project].concat(args)) : this.runner.apply(this, args);
    }
  }, {
    key: 'hidden',
    value: function hidden() {
      var _util$hidden;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return (_util$hidden = util.hidden).getter.apply(_util$hidden, [this].concat(args));
    }
  }, {
    key: 'lazy',
    value: function lazy() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return util.lazy.apply(util, [this].concat(args));
    }
  }, {
    key: 'buildAPI',
    value: function buildAPI(api) {
      var mod = this.required;

      if (api) {
        return api;
      }

      var runner = undefined;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2hlbHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQVksSUFBSTs7Ozs7Ozs7Ozs7Ozs7SUFLSyxNQUFNO2VBQU4sTUFBTTs7bUNBQ0YsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUU7QUFDL0MsVUFBRyxVQUFVLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtBQUNqQyxrQkFBVSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFBO09BQzNDOztBQUVELFVBQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFDLFVBQVUsRUFBVixVQUFVLEVBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRWhFLFlBQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQ3hCLFlBQUksT0FBTyxHQUFHO0FBQUUsaUJBQU8sTUFBTSxDQUFBO1NBQUU7QUFDL0IsWUFBSSxZQUFZLEdBQUc7QUFBRSxpQkFBTyxHQUFHLENBQUE7U0FBRTtPQUNsQyxDQUFDLENBQUE7O0FBRUYsYUFBTyxNQUFNLENBQUE7S0FDZDs7O0FBRUQsV0FoQm1CLE1BQU0sQ0FnQlosR0FBRyxFQUFnQjs7O1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFoQlgsTUFBTTs7QUFpQnZCLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLEdBQUcsWUFBQSxDQUFBOztBQUVQLFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQUksR0FBRyxHQUFJO0FBQUUsZUFBTyxHQUFHLENBQUE7T0FBRTs7QUFFekIsVUFBSSxHQUFHLENBQUUsR0FBRyxFQUFFO0FBQ1osV0FBRyxHQUFHLEdBQUc7O0FBQUEsT0FFVjtLQUNGLENBQUMsQ0FBQTs7QUFFRixRQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN2QixR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QUcsQ0FBQyxDQUFBO0FBQ2hDLGFBQU8sTUFBTSxDQUFBO0tBQ2Q7OztzQ0Fja0IsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUUxQzs7O3FDQUVpQixLQUFLLEVBQUUsRUFFeEI7OzsyQkFNTyxJQUFJLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRTtBQUMvQixVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQTtLQUNoRDs7O3dCQTNFYTtBQUNaLGFBQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7S0FDbkQ7Ozt3QkFzQ2E7QUFDWixhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFBO0tBQ3ZCOzs7d0JBT1k7QUFDWCxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDaEIsYUFBTztBQUNMLFlBQUksUUFBUSxHQUFJO0FBQ2QsaUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1NBQ3JEO0FBQ0QsWUFBSSxRQUFRLEdBQUk7QUFDZCxpQkFBTyxVQS9IWSxPQUFPLEVBK0hYLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUMxQjtPQUNGLENBQUE7S0FDRjs7O3dCQVVnQjtBQUNmLGFBQU8sVUE3SU8sT0FBTyxFQTZJTixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDekI7OztTQTVJa0IsTUFBTTs7O2tCQUFOLE1BQU07O0FBbUozQixNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUcsQ0FBQSIsImZpbGUiOiJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgeyBkaXJuYW1lLCBleHRuYW1lLCByZXNvbHZlLCBqb2luIH0gZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVscGVyIHtcbiAgc3RhdGljIGZyb21EZWZpbml0aW9uICh1cmksIGRlZmluaXRpb24sIG9wdGlvbnMpIHtcbiAgICBpZihkZWZpbml0aW9uICYmIG9wdGlvbnMucmVxdWlyZWQpIHtcbiAgICAgIGRlZmluaXRpb24uaGVscGVyRXhwb3J0ID0gb3B0aW9ucy5yZXF1aXJlZFxuICAgIH1cblxuICAgIGxldCBoZWxwZXIgPSBuZXcgdGhpcyh1cmksIE9iamVjdC5hc3NpZ24ob3B0aW9ucywge2RlZmluaXRpb259KSlcblxuICAgIE9iamVjdC5hc3NpZ24oZGVmaW5pdGlvbiwge1xuICAgICAgZ2V0IF9oZWxwZXIoKSB7IHJldHVybiBoZWxwZXIgfSxcbiAgICAgIGdldCBfcmVxdWlyZVBhdGgoKSB7IHJldHVybiB1cmkgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gaGVscGVyXG4gIH1cblxuICBjb25zdHJ1Y3RvciAodXJpLCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgaGVscGVyID0gdGhpc1xuICAgIGxldCByYXdcblxuICAgIHV0aWwuYXNzaWduKHRoaXMsIHtcbiAgICAgIGdldCByYXcgKCkgeyByZXR1cm4gcmF3IH0sXG5cbiAgICAgIHNldCByYXcgKHZhbCkge1xuICAgICAgICByYXcgPSB2YWxcbiAgICAgICAgLy9oZWxwZXIuY29udGVudERpZENoYW5nZShoZWxwZXIpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuaGlkZGVuKCd1cmknLCB1cmkpXG4gICAgdGhpcy5oaWRkZW4oJ29wdGlvbnMnLCBvcHRpb25zKVxuICAgIHRoaXMuaGlkZGVuKCdwcm9qZWN0JywgKCkgPT4gb3B0aW9ucy5wcm9qZWN0KVxuICAgIHRoaXMuZ2V0dGVyKCdvd25lcicsICgpID0+IG9wdGlvbnMub3duZXIpXG4gICAgdGhpcy5nZXR0ZXIoJ3JlcXVpcmVkJywgKCgpID0+IG9wdGlvbnMucmVxdWlyZWQgfHwgdGhpcy5yZXF1aXJlKHVyaSkpLCB0cnVlKVxuXG4gICAgbGV0IGRlZmluaXRpb24gPSBvcHRpb25zLmRlZmluaXRpb25cblxuICAgIHRoaXMuZ2V0dGVyKCdkZWZpbml0aW9uJywgZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IGQgPSBvcHRpb25zLmRlZmluaXRpb24gfHwgdGhpcy5yZXF1aXJlZC5kZWZpbml0aW9uXG5cbiAgICAgIGlmIChkICYmIGQuY29uZmlndXJlKSB7IGQuY29uZmlndXJlKCkgfVxuXG4gICAgICBpZih0aGlzLnJlcXVpcmVkICYmIHRoaXMucmVxdWlyZWQuY29uZmlnKXtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5yZXF1aXJlZC5jb25maWcpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICBpZihkICYmIGQuY29uZmlnICYmIGQuY29uZmlnW2tleV0pe1xuICAgICAgICAgICAgZC5jb25maWdba2V5XSA9IE9iamVjdC5hc3NpZ24odGhpcy5yZXF1aXJlZC5jb25maWdba2V5XSwgZC5jb25maWdba2V5XSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZC5jb25maWdba2V5XSA9IHRoaXMucmVxdWlyZWQuY29uZmlnW2tleV1cbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBkXG4gICAgfSlcblxuICAgIHRoaXMuaWQgPSB0aGlzLnBhdGhzLnJlbGF0aXZlLnJlcGxhY2UodGhpcy5leHRlbnNpb24sICcnKVxuXG4gICAgdGhpcy5oaWRkZW4oJ2FwaScsICgpID0+IHRoaXMuYnVpbGRBUEkob3B0aW9ucy5hcGksIHRoaXMucmVxdWlyZWQpKVxuICB9XG5cbiAgLyoqXG4gICogRXZlcnkgaGVscGVyIHNob3VsZCBleHBvc2UgYW4gYXBpIHdpdGggYSBmdW5jdGlvbiB3aGljaCBpcyByZXNwb25zaWJsZVxuICAqIGZvciBoYW5kbGluZyBjYWxscyB0byB0aGUgcnVuIGZ1bmN0aW9uIHRoYXQgZ2V0IGRpc3BhdGNoZWQgdG8gdGhlIGhlbHBlci5cbiAgKlxuICAqL1xuICBydW4gKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9qZWN0ID8gdGhpcy5ydW5uZXIuY2FsbCh0aGlzLnByb2plY3QsIC4uLmFyZ3MpIDogdGhpcy5ydW5uZXIoLi4uYXJncylcbiAgfVxuXG4gIGdldCBpZFBhdGggKCkge1xuICAgIHJldHVybiB0aGlzLmlkLnJlcGxhY2UoJy0nLCAnXycpLnJlcGxhY2UoJy8nLCAnLicpXG4gIH1cblxuICBoaWRkZW4gKC4uLmFyZ3MpIHsgcmV0dXJuIHV0aWwuaGlkZGVuLmdldHRlcih0aGlzLCAuLi5hcmdzKSB9XG5cbiAgbGF6eSAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5sYXp5KHRoaXMsIC4uLmFyZ3MpIH1cblxuICBidWlsZEFQSSAoYXBpKSB7XG4gICAgbGV0IG1vZCA9IHRoaXMucmVxdWlyZWRcblxuICAgIGlmIChhcGkpIHsgcmV0dXJuIGFwaSB9XG5cbiAgICBsZXQgcnVubmVyXG5cbiAgICBpZiAoIHR5cGVvZiBtb2QgPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICBydW5uZXIgPSB0aGlzLnByb2plY3QgPyBtb2QuYmluZCh0aGlzLnByb2plY3QpIDogbW9kXG5cbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHJ1bm5lciwge1xuICAgICAgICBydW5uZXIsXG4gICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICBkZWZpbml0aW9uOiB0aGlzLmRlZmluaXRpb25cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBtb2QgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2QuZGVmYXVsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obW9kLCB7XG4gICAgICAgIHJ1bm5lcjogdGhpcy5wcm9qZWN0ID8gbW9kLmRlZmF1bHQuYmluZCh0aGlzLnByb2plY3QpIDogbW9kLmRlZmF1bHQsXG4gICAgICAgIGlkOiB0aGlzLmlkLFxuICAgICAgICBkZWZpbml0aW9uOiB0aGlzLmRlZmluaXRpb25cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBtb2QgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih0aGlzLmRlZmluaXRpb24uYXBpIHx8IHt9LCBtb2QpXG4gICAgfVxuXG4gICAgdGhyb3cgKCdUaGVyZSB3YXMgYSBwcm9ibGVtIGJ1aWxkaW5nIGFuIEFQSSBmb3IgdGhlIGhlbHBlciBpZDogJyArIHRoaXMuaWQgKyAnIGF0ICcgKyB0aGlzLnVyaSlcbiAgfVxuXG4gIGdldCBydW5uZXIgKCkge1xuICAgIHJldHVybiB0aGlzLmFwaS5ydW5uZXJcbiAgfVxuXG4gIHJlcXVpcmUgKHVyaSkge1xuICAgIGxldCByZXN1bHQgPSBtb2R1bGUucmVxdWlyZSh1cmkpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgZ2V0IHBhdGhzICgpIHtcbiAgICBsZXQgYXNzZXQgPSB0aGlzXG4gICAgcmV0dXJuIHtcbiAgICAgIGdldCByZWxhdGl2ZSAoKSB7XG4gICAgICAgIHJldHVybiBhc3NldC51cmkucmVwbGFjZShhc3NldC5vd25lci5yb290ICsgJy8nLCAnJylcbiAgICAgIH0sXG4gICAgICBnZXQgYWJzb2x1dGUgKCkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZShhc3NldC51cmkpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29udGVudFdpbGxDaGFuZ2UgKG9sZENvbnRlbnQsIG5ld0NvbnRlbnQpIHtcblxuICB9XG5cbiAgY29udGVudERpZENoYW5nZSAoYXNzZXQpIHtcblxuICB9XG5cbiAgZ2V0IGV4dGVuc2lvbiAoKSB7XG4gICAgcmV0dXJuIGV4dG5hbWUodGhpcy51cmkpXG4gIH1cblxuICBnZXR0ZXIgKG5hbWUsIG9iaiwgY29uZmlndXJhYmxlKSB7XG4gICAgdXRpbC5oaWRlLmdldHRlcih0aGlzLCBuYW1lLCBvYmosIGNvbmZpZ3VyYWJsZSlcbiAgfVxufVxuXG5IZWxwZXIuYXBpTWV0aG9kcyA9IFsgXVxuIl19