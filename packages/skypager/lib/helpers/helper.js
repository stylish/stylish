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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2hlbHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQVksSUFBSTs7Ozs7Ozs7Ozs7Ozs7SUFLSyxNQUFNO2VBQU4sTUFBTTs7bUNBQ0YsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUU7QUFDL0MsVUFBRyxVQUFVLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtBQUNqQyxjQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUU7QUFDaEQsb0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGFBQUcsRUFBRSxlQUFXO0FBQ2QsbUJBQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQTtXQUN4QjtTQUNGLENBQUMsQ0FBQTtPQUNIOztBQUVELFVBQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFDLFVBQVUsRUFBVixVQUFVLEVBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRWhFLFlBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUU7QUFDbEMsZUFBTyxFQUFFO0FBQ1Asb0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGFBQUcsRUFBRSxlQUFVO0FBQUUsbUJBQU8sTUFBTSxDQUFBO1dBQUU7U0FDakM7QUFDRCxvQkFBWSxFQUFFO0FBQ1osb0JBQVUsRUFBRSxLQUFLO0FBQ2pCLGFBQUcsRUFBRSxlQUFVO0FBQUUsbUJBQU8sR0FBRyxDQUFBO1dBQUU7U0FDOUI7T0FDRixDQUFDLENBQUE7O0FBRUYsYUFBTyxNQUFNLENBQUE7S0FDZDs7O0FBRUQsV0EzQm1CLE1BQU0sQ0EyQlosR0FBRyxFQUFnQjs7O1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkEzQlgsTUFBTTs7QUE0QnZCLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLEdBQUcsWUFBQSxDQUFBOztBQUVQLFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0FB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QUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQTtTQUNyRDtBQUNELFlBQUksUUFBUSxHQUFJO0FBQ2QsaUJBQU8sVUEvSVksT0FBTyxFQStJWCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7U0FDMUI7T0FDRixDQUFBO0tBQ0Y7Ozt3QkFVZ0I7QUFDZixhQUFPLFVBN0pPLE9BQU8sRUE2Sk4sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3pCOzs7U0E1SmtCLE1BQU07OztrQkFBTixNQUFNOztBQW1LM0IsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFHLENBQUEiLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi91dGlsJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuaW1wb3J0IHsgZGlybmFtZSwgZXh0bmFtZSwgcmVzb2x2ZSwgam9pbiB9IGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlbHBlciB7XG4gIHN0YXRpYyBmcm9tRGVmaW5pdGlvbiAodXJpLCBkZWZpbml0aW9uLCBvcHRpb25zKSB7XG4gICAgaWYoZGVmaW5pdGlvbiAmJiBvcHRpb25zLnJlcXVpcmVkKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVmaW5pdGlvbiwgJ2hlbHBlckV4cG9ydCcsIHtcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIG9wdGlvbnMucmVxdWlyZWRcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBsZXQgaGVscGVyID0gbmV3IHRoaXModXJpLCBPYmplY3QuYXNzaWduKG9wdGlvbnMsIHtkZWZpbml0aW9ufSkpXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhkZWZpbml0aW9uLCB7XG4gICAgICBfaGVscGVyOiB7XG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBoZWxwZXIgfVxuICAgICAgfSxcbiAgICAgIF9yZXF1aXJlUGF0aDoge1xuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdXJpIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIGhlbHBlclxuICB9XG5cbiAgY29uc3RydWN0b3IgKHVyaSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IGhlbHBlciA9IHRoaXNcbiAgICBsZXQgcmF3XG5cbiAgICB1dGlsLmFzc2lnbih0aGlzLCB7XG4gICAgICBnZXQgcmF3ICgpIHsgcmV0dXJuIHJhdyB9LFxuXG4gICAgICBzZXQgcmF3ICh2YWwpIHtcbiAgICAgICAgcmF3ID0gdmFsXG4gICAgICAgIC8vaGVscGVyLmNvbnRlbnREaWRDaGFuZ2UoaGVscGVyKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmhpZGRlbigndXJpJywgdXJpKVxuICAgIHRoaXMuaGlkZGVuKCdvcHRpb25zJywgb3B0aW9ucylcbiAgICB0aGlzLmhpZGRlbigncHJvamVjdCcsICgpID0+IG9wdGlvbnMucHJvamVjdClcbiAgICB0aGlzLmdldHRlcignb3duZXInLCAoKSA9PiBvcHRpb25zLm93bmVyKVxuICAgIHRoaXMuZ2V0dGVyKCdyZXF1aXJlZCcsICgoKSA9PiBvcHRpb25zLnJlcXVpcmVkIHx8IHRoaXMucmVxdWlyZSh1cmkpKSwgdHJ1ZSlcblxuICAgIGxldCBkZWZpbml0aW9uID0gb3B0aW9ucy5kZWZpbml0aW9uXG5cbiAgICAvLyBiZWZvcmUgcmV0dXJuaW5nIHRoZSBkZWZpbml0aW9uIG1ha2Ugc3VyZSB0byBjYWxsIGFueSBjb25maWd1cmUgbWV0aG9kcyB3ZSBoYXZlXG4gICAgdGhpcy5nZXR0ZXIoJ2RlZmluaXRpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgZCA9IG9wdGlvbnMuZGVmaW5pdGlvbiB8fCB0aGlzLnJlcXVpcmVkLmRlZmluaXRpb25cblxuICAgICAgaWYgKGQgJiYgZC5jb25maWd1cmUpIHsgZC5jb25maWd1cmUoKSB9XG5cbiAgICAgIGlmKHRoaXMucmVxdWlyZWQgJiYgdGhpcy5yZXF1aXJlZC5jb25maWcpe1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnJlcXVpcmVkLmNvbmZpZykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGlmKGQgJiYgZC5jb25maWcgJiYgZC5jb25maWdba2V5XSl7XG4gICAgICAgICAgICBkLmNvbmZpZ1trZXldID0gT2JqZWN0LmFzc2lnbih0aGlzLnJlcXVpcmVkLmNvbmZpZ1trZXldLCBkLmNvbmZpZ1trZXldKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkLmNvbmZpZ1trZXldID0gdGhpcy5yZXF1aXJlZC5jb25maWdba2V5XVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRcbiAgICB9KVxuXG4gICAgdGhpcy5pZCA9IHRoaXMucGF0aHMucmVsYXRpdmUucmVwbGFjZSh0aGlzLmV4dGVuc2lvbiwgJycpXG5cbiAgICB0aGlzLmhpZGRlbignYXBpJywgKCkgPT4gdGhpcy5idWlsZEFQSShvcHRpb25zLmFwaSwgdGhpcy5yZXF1aXJlZCkpXG4gIH1cblxuICAvKipcbiAgKiBFdmVyeSBoZWxwZXIgc2hvdWxkIGV4cG9zZSBhbiBhcGkgd2l0aCBhIGZ1bmN0aW9uIHdoaWNoIGlzIHJlc3BvbnNpYmxlXG4gICogZm9yIGhhbmRsaW5nIGNhbGxzIHRvIHRoZSBydW4gZnVuY3Rpb24gdGhhdCBnZXQgZGlzcGF0Y2hlZCB0byB0aGUgaGVscGVyLlxuICAqXG4gICovXG4gIHJ1biAoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLnByb2plY3QgPyB0aGlzLnJ1bm5lci5jYWxsKHRoaXMucHJvamVjdCwgLi4uYXJncykgOiB0aGlzLnJ1bm5lciguLi5hcmdzKVxuICB9XG5cbiAgZ2V0IGlkUGF0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQucmVwbGFjZSgnLScsICdfJykucmVwbGFjZSgnLycsICcuJylcbiAgfVxuXG4gIGhpZGRlbiAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5oaWRkZW4uZ2V0dGVyKHRoaXMsIC4uLmFyZ3MpIH1cblxuICBsYXp5ICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmxhenkodGhpcywgLi4uYXJncykgfVxuXG4gIGJ1aWxkQVBJIChhcGkpIHtcbiAgICBsZXQgbW9kID0gdGhpcy5yZXF1aXJlZFxuXG4gICAgaWYgKGFwaSkgeyByZXR1cm4gYXBpIH1cblxuICAgIGxldCBydW5uZXJcblxuICAgIGlmICggdHlwZW9mIG1vZCA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJ1bm5lciA9IHRoaXMucHJvamVjdCA/IG1vZC5iaW5kKHRoaXMucHJvamVjdCkgOiBtb2RcblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ocnVubmVyLCB7XG4gICAgICAgIHJ1bm5lcixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGRlZmluaXRpb246IHRoaXMuZGVmaW5pdGlvblxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG1vZCA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZC5kZWZhdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihtb2QsIHtcbiAgICAgICAgcnVubmVyOiB0aGlzLnByb2plY3QgPyBtb2QuZGVmYXVsdC5iaW5kKHRoaXMucHJvamVjdCkgOiBtb2QuZGVmYXVsdCxcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGRlZmluaXRpb246IHRoaXMuZGVmaW5pdGlvblxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG1vZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHRoaXMuZGVmaW5pdGlvbi5hcGkgfHwge30sIG1vZClcbiAgICB9XG5cbiAgICB0aHJvdyAoJ1RoZXJlIHdhcyBhIHByb2JsZW0gYnVpbGRpbmcgYW4gQVBJIGZvciB0aGUgaGVscGVyIGlkOiAnICsgdGhpcy5pZCArICcgYXQgJyArIHRoaXMudXJpKVxuICB9XG5cbiAgZ2V0IHJ1bm5lciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBpLnJ1bm5lclxuICB9XG5cbiAgcmVxdWlyZSAodXJpKSB7XG4gICAgbGV0IHJlc3VsdCA9IG1vZHVsZS5yZXF1aXJlKHVyaSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBnZXQgcGF0aHMgKCkge1xuICAgIGxldCBhc3NldCA9IHRoaXNcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0IHN1bW1hcnkgKCkge1xuICAgICAgICBsZXQgcGFydHMgPSBhc3NldC51cmkuc3BsaXQoL1xcL3xcXFxcLylcbiAgICAgICAgcmV0dXJuIHBhcnRzLnJldmVyc2UoKS5zbGljZSgwLDMpLnJldmVyc2UoKS5qb2luKCcvJylcbiAgICAgIH0sXG4gICAgICBnZXQgcmVsYXRpdmUgKCkge1xuICAgICAgICByZXR1cm4gYXNzZXQudXJpLnJlcGxhY2UoYXNzZXQub3duZXIucm9vdCArICcvJywgJycpXG4gICAgICB9LFxuICAgICAgZ2V0IGFic29sdXRlICgpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmUoYXNzZXQudXJpKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnRlbnRXaWxsQ2hhbmdlIChvbGRDb250ZW50LCBuZXdDb250ZW50KSB7XG5cbiAgfVxuXG4gIGNvbnRlbnREaWRDaGFuZ2UgKGFzc2V0KSB7XG5cbiAgfVxuXG4gIGdldCBleHRlbnNpb24gKCkge1xuICAgIHJldHVybiBleHRuYW1lKHRoaXMudXJpKVxuICB9XG5cbiAgZ2V0dGVyIChuYW1lLCBvYmosIGNvbmZpZ3VyYWJsZSkge1xuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgbmFtZSwgb2JqLCBjb25maWd1cmFibGUpXG4gIH1cbn1cblxuSGVscGVyLmFwaU1ldGhvZHMgPSBbIF1cbiJdfQ==