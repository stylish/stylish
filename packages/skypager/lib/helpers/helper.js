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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL2hlbHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQVksSUFBSTs7Ozs7Ozs7Ozs7Ozs7SUFLSyxNQUFNO2VBQU4sTUFBTTs7bUNBQ0YsR0FBRyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUU7QUFDL0MsVUFBRyxVQUFVLElBQUksT0FBTyxDQUFDLFFBQVEsRUFBRTtBQUNqQyxrQkFBVSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFBO09BQzNDOztBQUVELFVBQUksTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFDLFVBQVUsRUFBVixVQUFVLEVBQUMsQ0FBQyxDQUFDLENBQUE7O0FBRWhFLGFBQU8sTUFBTSxDQUFBO0tBQ2Q7OztBQUVELFdBWG1CLE1BQU0sQ0FXWixHQUFHLEVBQWdCOzs7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVhYLE1BQU07O0FBWXZCLFFBQUksTUFBTSxHQUFHLElBQUksQ0FBQTtBQUNqQixRQUFJLEdBQUcsWUFBQSxDQUFBOztBQUVQLFFBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0FBQ2hCLFVBQUksR0FBRyxHQUFJO0FBQUUsZUFBTyxHQUFHLENBQUE7T0FBRTs7QUFFekIsVUFBSSxHQUFHLENBQUUsR0FBRyxFQUFFO0FBQ1osV0FBRyxHQUFHLEdBQUc7O0FBQUEsT0FFVjtLQUNGLENBQUMsQ0FBQTs7QUFFRixRQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN2QixRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUMvQixRQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRTthQUFNLE9BQU8sQ0FBQyxPQUFPO0tBQUEsQ0FBQyxDQUFBO0FBQzdDLFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFF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QUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQTtLQUNoRDs7O3dCQTNFYTtBQUNaLGFBQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUE7S0FDbkQ7Ozt3QkFzQ2E7QUFDWixhQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFBO0tBQ3ZCOzs7d0JBT1k7QUFDWCxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUE7QUFDaEIsYUFBTztBQUNMLFlBQUksUUFBUSxHQUFJO0FBQ2QsaUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1NBQ3JEO0FBQ0QsWUFBSSxRQUFRLEdBQUk7QUFDZCxpQkFBTyxVQTFIWSxPQUFPLEVBMEhYLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUMxQjtPQUNGLENBQUE7S0FDRjs7O3dCQVVnQjtBQUNmLGFBQU8sVUF4SU8sT0FBTyxFQXdJTixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDekI7OztTQXZJa0IsTUFBTTs7O2tCQUFOLE1BQU07O0FBOEkzQixNQUFNLENBQUMsVUFBVSxHQUFHLEVBQUcsQ0FBQSIsImZpbGUiOiJoZWxwZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uL3V0aWwnXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgeyBkaXJuYW1lLCBleHRuYW1lLCByZXNvbHZlLCBqb2luIH0gZnJvbSAncGF0aCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGVscGVyIHtcbiAgc3RhdGljIGZyb21EZWZpbml0aW9uICh1cmksIGRlZmluaXRpb24sIG9wdGlvbnMpIHtcbiAgICBpZihkZWZpbml0aW9uICYmIG9wdGlvbnMucmVxdWlyZWQpIHtcbiAgICAgIGRlZmluaXRpb24uaGVscGVyRXhwb3J0ID0gb3B0aW9ucy5yZXF1aXJlZFxuICAgIH1cblxuICAgIGxldCBoZWxwZXIgPSBuZXcgdGhpcyh1cmksIE9iamVjdC5hc3NpZ24ob3B0aW9ucywge2RlZmluaXRpb259KSlcblxuICAgIHJldHVybiBoZWxwZXJcbiAgfVxuXG4gIGNvbnN0cnVjdG9yICh1cmksIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBoZWxwZXIgPSB0aGlzXG4gICAgbGV0IHJhd1xuXG4gICAgdXRpbC5hc3NpZ24odGhpcywge1xuICAgICAgZ2V0IHJhdyAoKSB7IHJldHVybiByYXcgfSxcblxuICAgICAgc2V0IHJhdyAodmFsKSB7XG4gICAgICAgIHJhdyA9IHZhbFxuICAgICAgICAvL2hlbHBlci5jb250ZW50RGlkQ2hhbmdlKGhlbHBlcilcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5oaWRkZW4oJ3VyaScsIHVyaSlcbiAgICB0aGlzLmhpZGRlbignb3B0aW9ucycsIG9wdGlvbnMpXG4gICAgdGhpcy5oaWRkZW4oJ3Byb2plY3QnLCAoKSA9PiBvcHRpb25zLnByb2plY3QpXG4gICAgdGhpcy5nZXR0ZXIoJ293bmVyJywgKCkgPT4gb3B0aW9ucy5vd25lcilcbiAgICB0aGlzLmdldHRlcigncmVxdWlyZWQnLCAoKCkgPT4gb3B0aW9ucy5yZXF1aXJlZCB8fCB0aGlzLnJlcXVpcmUodXJpKSksIHRydWUpXG5cbiAgICBsZXQgZGVmaW5pdGlvbiA9IG9wdGlvbnMuZGVmaW5pdGlvblxuXG4gICAgdGhpcy5nZXR0ZXIoJ2RlZmluaXRpb24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICBsZXQgZCA9IG9wdGlvbnMuZGVmaW5pdGlvbiB8fCB0aGlzLnJlcXVpcmVkLmRlZmluaXRpb25cblxuICAgICAgaWYgKGQgJiYgZC5jb25maWd1cmUpIHsgZC5jb25maWd1cmUoKSB9XG5cbiAgICAgIGlmKHRoaXMucmVxdWlyZWQgJiYgdGhpcy5yZXF1aXJlZC5jb25maWcpe1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnJlcXVpcmVkLmNvbmZpZykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgIGlmKGQgJiYgZC5jb25maWcgJiYgZC5jb25maWdba2V5XSl7XG4gICAgICAgICAgICBkLmNvbmZpZ1trZXldID0gT2JqZWN0LmFzc2lnbih0aGlzLnJlcXVpcmVkLmNvbmZpZ1trZXldLCBkLmNvbmZpZ1trZXldKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkLmNvbmZpZ1trZXldID0gdGhpcy5yZXF1aXJlZC5jb25maWdba2V5XVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRcbiAgICB9KVxuXG4gICAgdGhpcy5pZCA9IHRoaXMucGF0aHMucmVsYXRpdmUucmVwbGFjZSh0aGlzLmV4dGVuc2lvbiwgJycpXG5cbiAgICB0aGlzLmhpZGRlbignYXBpJywgKCkgPT4gdGhpcy5idWlsZEFQSShvcHRpb25zLmFwaSwgdGhpcy5yZXF1aXJlZCkpXG4gIH1cblxuICAvKipcbiAgKiBFdmVyeSBoZWxwZXIgc2hvdWxkIGV4cG9zZSBhbiBhcGkgd2l0aCBhIGZ1bmN0aW9uIHdoaWNoIGlzIHJlc3BvbnNpYmxlXG4gICogZm9yIGhhbmRsaW5nIGNhbGxzIHRvIHRoZSBydW4gZnVuY3Rpb24gdGhhdCBnZXQgZGlzcGF0Y2hlZCB0byB0aGUgaGVscGVyLlxuICAqXG4gICovXG4gIHJ1biAoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLnByb2plY3QgPyB0aGlzLnJ1bm5lci5jYWxsKHRoaXMucHJvamVjdCwgLi4uYXJncykgOiB0aGlzLnJ1bm5lciguLi5hcmdzKVxuICB9XG5cbiAgZ2V0IGlkUGF0aCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQucmVwbGFjZSgnLScsICdfJykucmVwbGFjZSgnLycsICcuJylcbiAgfVxuXG4gIGhpZGRlbiAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5oaWRkZW4uZ2V0dGVyKHRoaXMsIC4uLmFyZ3MpIH1cblxuICBsYXp5ICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmxhenkodGhpcywgLi4uYXJncykgfVxuXG4gIGJ1aWxkQVBJIChhcGkpIHtcbiAgICBsZXQgbW9kID0gdGhpcy5yZXF1aXJlZFxuXG4gICAgaWYgKGFwaSkgeyByZXR1cm4gYXBpIH1cblxuICAgIGxldCBydW5uZXJcblxuICAgIGlmICggdHlwZW9mIG1vZCA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICAgIHJ1bm5lciA9IHRoaXMucHJvamVjdCA/IG1vZC5iaW5kKHRoaXMucHJvamVjdCkgOiBtb2RcblxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24ocnVubmVyLCB7XG4gICAgICAgIHJ1bm5lcixcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGRlZmluaXRpb246IHRoaXMuZGVmaW5pdGlvblxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG1vZCA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZC5kZWZhdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihtb2QsIHtcbiAgICAgICAgcnVubmVyOiB0aGlzLnByb2plY3QgPyBtb2QuZGVmYXVsdC5iaW5kKHRoaXMucHJvamVjdCkgOiBtb2QuZGVmYXVsdCxcbiAgICAgICAgaWQ6IHRoaXMuaWQsXG4gICAgICAgIGRlZmluaXRpb246IHRoaXMuZGVmaW5pdGlvblxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG1vZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHRoaXMuZGVmaW5pdGlvbi5hcGkgfHwge30sIG1vZClcbiAgICB9XG5cbiAgICB0aHJvdyAoJ1RoZXJlIHdhcyBhIHByb2JsZW0gYnVpbGRpbmcgYW4gQVBJIGZvciB0aGUgaGVscGVyIGlkOiAnICsgdGhpcy5pZCArICcgYXQgJyArIHRoaXMudXJpKVxuICB9XG5cbiAgZ2V0IHJ1bm5lciAoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBpLnJ1bm5lclxuICB9XG5cbiAgcmVxdWlyZSAodXJpKSB7XG4gICAgbGV0IHJlc3VsdCA9IG1vZHVsZS5yZXF1aXJlKHVyaSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBnZXQgcGF0aHMgKCkge1xuICAgIGxldCBhc3NldCA9IHRoaXNcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0IHJlbGF0aXZlICgpIHtcbiAgICAgICAgcmV0dXJuIGFzc2V0LnVyaS5yZXBsYWNlKGFzc2V0Lm93bmVyLnJvb3QgKyAnLycsICcnKVxuICAgICAgfSxcbiAgICAgIGdldCBhYnNvbHV0ZSAoKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlKGFzc2V0LnVyaSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb250ZW50V2lsbENoYW5nZSAob2xkQ29udGVudCwgbmV3Q29udGVudCkge1xuXG4gIH1cblxuICBjb250ZW50RGlkQ2hhbmdlIChhc3NldCkge1xuXG4gIH1cblxuICBnZXQgZXh0ZW5zaW9uICgpIHtcbiAgICByZXR1cm4gZXh0bmFtZSh0aGlzLnVyaSlcbiAgfVxuXG4gIGdldHRlciAobmFtZSwgb2JqLCBjb25maWd1cmFibGUpIHtcbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsIG5hbWUsIG9iaiwgY29uZmlndXJhYmxlKVxuICB9XG59XG5cbkhlbHBlci5hcGlNZXRob2RzID0gWyBdXG4iXX0=