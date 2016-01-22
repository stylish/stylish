'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Refactoring notes:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Currently there is a registry for the skypager framework and then per project rregistries
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * I should make one registry for the framework, and then helpers register themselves with the project they belong to
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * and by default only get framework helpers and project helpers available to them.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

var _objectPath = require('object-path');

var _objectPath2 = _interopRequireDefault(_objectPath);

var _path = require('path');

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug3.default)('skypager:registry');

var Fallbacks = {};

var Registry = (function () {
  _createClass(Registry, null, [{
    key: 'build',
    value: function build(host, helper, options) {
      return new Registry(host, helper, options);
    }
  }]);

  function Registry(host, helper) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, Registry);

    if (!host || !helper) {
      throw 'Must supply a registry with a host and a helper class';
    }

    this.name = options.name || util.tabelize(helper.name || '');
    this.root = (0, _path.join)(options.root || host.root, this.name);

    var registry = {};
    var aliases = {};

    util.hide.getter(this, 'host', function () {
      return host;
    });
    util.hide.getter(this, 'aliases', function () {
      return aliases;
    });
    util.hide.getter(this, 'registry', function () {
      return registry;
    });
    util.hide.getter(this, 'helper', function () {
      return helper;
    });

    if (host.type === 'framework') {
      Fallbacks[this.name] = this;
    }

    var indexScript = undefined;

    this.loaded = false;

    try {
      indexScript = require.resolve((0, _path.join)(this.root, 'index.js'));
    } catch (error) {}

    if (indexScript) {
      this.loaded = true;
      this.runLoader(require(indexScript));
    }

    buildAtInterface(this);

    this.loaded = true;
  }

  _createClass(Registry, [{
    key: 'remove',
    value: function remove(helperId) {
      var _this = this;

      var instance = this.lookup(helperId, false);
      if (instance) {
        if (instance.name) {
          delete (this.aliases, instance.name);
        }

        if (instance.aliases) {
          instance.aliases.forEach(function (a) {
            return delete _this.aliases[a];
          });
        }

        delete this.aliases[instance.id];
        delete this.registry[instance.id];
      }
    }
  }, {
    key: 'run',
    value: function run(helperId) {
      var fn = this.lookup(helperId).runner;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return fn.apply(undefined, args);
    }
  }, {
    key: 'lookup',
    value: function lookup(needle) {
      var strict = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
      var fromProject = arguments[2];

      var helperId = this.aliases[needle];

      if (typeof helperId === 'undefined') {
        if (this.fallback) {
          return this.fallback.lookup(needle, strict, this.host);
        }
        if (strict) {
          throw 'Could not find helper with id:' + needle;
        }
      }

      var result = this.registry[helperId];

      if (result && fromProject) {
        result.options.project = fromProject;
      }

      return result;
    }
  }, {
    key: 'register',
    value: function register(helperId, helperInstance) {
      var _this2 = this;

      if (!helperInstance) {
        throw 'Error registering ' + helperId;
      }

      this.aliases[helperId] = helperId;

      if (helperInstance.name) {
        this.aliases[helperInstance.name] = helperId;
      }

      this.registry[helperId] = helperInstance;

      helperInstance.aliases && helperInstance.aliases.forEach(function (alias) {
        _this2.aliases[alias] = helperId;
      });

      return helperInstance;
    }
  }, {
    key: 'buildId',
    value: function buildId(helperURL) {
      var keepExtension = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      var reg = new RegExp('^' + this.root + '/', 'i');

      if (!helperURL.match(reg)) {
        helperURL = (0, _path.basename)(helperURL);
      }

      var base = helperURL.replace(reg, '');

      if (base.match(/\/index$/i)) {
        base = base.replace(/\/index$/i, '');
      }

      return keepExtension ? base : base.replace(/\.\w+$/i, '');
    }
  }, {
    key: 'runLoader',
    value: function runLoader(fn) {
      var locals = Object.assign({}, this.helper.DSL ? this.helper.DSL : {});

      locals.util = util;

      if (this.host && this.host.type && !locals[this.host.type]) {
        locals[this.host.type] = this.host;
      }

      if (this.helper && this.helper.name) {
        locals[this.helper.name] = this.helper;
      }

      locals.registry = this;
      locals.load = this.load.bind(this);

      util.noConflict(fn, locals)();
    }
  }, {
    key: 'load',
    value: function load(uri, id) {
      var HelperClass = this.helper;

      var owner = this;

      id = id || this.buildId(uri);

      var helperInstance = undefined;

      try {
        var required = require(uri);
        var cached = require.cache[uri];
        var empty = Object.keys(cached.exports).length === 0;
        var definition = this.helper.Definition && this.helper.Definition.current();

        if (empty && definition) {
          helperInstance = HelperClass.fromDefinition(uri, definition, { owner: owner, id: id, required: required });
        } else if (definition) {
          helperInstance = HelperClass.fromDefinition(uri, definition, { owner: owner, id: id, required: required });
        } else {
          helperInstance = new HelperClass(uri, { owner: owner, id: id, definition: definition, required: required });
        }

        if (!helperInstance) {
          throw 'Uh oh';
        }

        id = id.replace(/\/index$/i, '');

        this.register(id, helperInstance);

        if (this.helper.Definition && this.helper.Definition.clearDefinition) {
          this.helper.Definition.clearDefinition();
        }

        return helperInstance;
      } catch (error) {
        console.log('Error loading: ' + uri, error.message);
      }
    }
  }, {
    key: 'fallback',
    get: function get() {
      if (this.host.type !== 'framework') {
        return Fallbacks[this.name];
      }
    }
  }, {
    key: 'all',
    get: function get() {
      return util.values(this.registry);
    }
  }, {
    key: 'available',
    get: function get() {
      var keys = Object.keys(this.registry);

      if (this.fallback) {
        return keys.concat(this.fallback.available);
      }

      return keys;
    }
  }]);

  return Registry;
})();

var _CACHE = {};

var Builder = (function () {
  function Builder(cache) {
    _classCallCheck(this, Builder);

    this.cache = cache || {};
  }

  _createClass(Builder, [{
    key: 'build',
    value: function build() {
      return Registry.build.apply(Registry, arguments);
    }
  }, {
    key: 'buildAll',
    value: function buildAll(host, helpers) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var root = options.root || host.root;
      var c = this.cache[host.root] = this.cache[host.root] || {};

      root.should.not.be.empty();
      c.should.be.an.Object;
      helpers.should.not.be.empty();

      Object.keys(helpers).forEach(function (type) {
        var name = util.tabelize(type);
        c[name] = c[name] || Registry.build(host, helpers[type], { name: name, root: host.root });
      });

      return c;
    }
  }]);

  return Builder;
})();

module.exports = new Builder(_CACHE);

function buildAtInterface(host) {
  var chain = function chain(id) {
    return host.lookup(id);
  };

  var expand = host.loaded;

  Object.defineProperty(host, 'at', {
    configurable: true,
    enumerable: false,
    value: chain
  });

  var idPaths = host.available.concat([]);

  if (expand) {
    var expanded = idPaths.map(function (idPath) {
      return idPath.split('/');
    }).sort(function (a, b) {
      return a.length > b.length;
    });

    expanded.forEach(function (parts) {
      var id = parts.join('/');
      var first = parts[0];

      if (parts.length === 1) {
        var _util$assign, _mutatorMap;

        util.assign(chain, (_util$assign = {}, _mutatorMap = {}, _mutatorMap[first] = _mutatorMap[first] || {}, _mutatorMap[first].get = function () {
          return host.lookup(id);
        }, _defineEnumerableProperties(_util$assign, _mutatorMap), _util$assign));
      }

      if (parts.length > 1) {
        (function () {
          var _util$assign2, _mutatorMap2;

          var getter = parts.pop();
          var idPath = parts.join('.').replace(/-/g, '_');
          var target = _objectPath2.default.get(chain, idPath) || {};

          util.assign(target, (_util$assign2 = {}, _mutatorMap2 = {}, _mutatorMap2[getter] = _mutatorMap2[getter] || {}, _mutatorMap2[getter].get = function () {
            return host.lookup(id);
          }, _defineEnumerableProperties(_util$assign2, _mutatorMap2), _util$assign2));
          _objectPath2.default.set(chain, idPath, target);
        })();
      }
    });
  }
}
//# sourceMappingURL=data:application/json;base64,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QUcsQ0FBQyxFQUFFOzs7O0FBQ3BCLGNBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQTtBQUN4QixjQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUE7QUFDL0MsY0FBSSxNQUFNLEdBQUcscUJBQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFHLENBQUE7O0FBRTVDLGNBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSx1REFDWCxNQUFNLGlCQUFOLE1BQU0sc0JBQU4sTUFBTSxvQkFBSztBQUNkLG1CQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7V0FDdkIsMkVBQ0QsQ0FBQTtBQUNGLCtCQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBOztPQUNqQztLQUNGLENBQUMsQ0FBQTtHQUNIO0NBQ0YiLCJmaWxlIjoicmVnaXN0cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiogUmVmYWN0b3Jpbmcgbm90ZXM6XG4qXG4qIEN1cnJlbnRseSB0aGVyZSBpcyBhIHJlZ2lzdHJ5IGZvciB0aGUgc2t5cGFnZXIgZnJhbWV3b3JrIGFuZCB0aGVuIHBlciBwcm9qZWN0IHJyZWdpc3RyaWVzXG4qXG4qIEkgc2hvdWxkIG1ha2Ugb25lIHJlZ2lzdHJ5IGZvciB0aGUgZnJhbWV3b3JrLCBhbmQgdGhlbiBoZWxwZXJzIHJlZ2lzdGVyIHRoZW1zZWx2ZXMgd2l0aCB0aGUgcHJvamVjdCB0aGV5IGJlbG9uZyB0b1xuKiBhbmQgYnkgZGVmYXVsdCBvbmx5IGdldCBmcmFtZXdvcmsgaGVscGVycyBhbmQgcHJvamVjdCBoZWxwZXJzIGF2YWlsYWJsZSB0byB0aGVtLlxuKlxuKi9cbmltcG9ydCBTa3lwYWdlciBmcm9tICcuL2luZGV4J1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnXG5pbXBvcnQgY2FydmUgZnJvbSAnb2JqZWN0LXBhdGgnXG5cbmltcG9ydCB7IGJhc2VuYW1lLCBqb2luLCByZXNvbHZlLCBkaXJuYW1lLCByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnXG5cblxuaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdza3lwYWdlcjpyZWdpc3RyeScpXG5cbmNvbnN0IEZhbGxiYWNrcyA9IHt9XG5cbmNsYXNzIFJlZ2lzdHJ5IHtcbiAgc3RhdGljIGJ1aWxkIChob3N0LCBoZWxwZXIsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IFJlZ2lzdHJ5KGhvc3QsIGhlbHBlciwgb3B0aW9ucylcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChob3N0LCBoZWxwZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICghaG9zdCB8fCAhaGVscGVyKSB7XG4gICAgICB0aHJvdyAoJ011c3Qgc3VwcGx5IGEgcmVnaXN0cnkgd2l0aCBhIGhvc3QgYW5kIGEgaGVscGVyIGNsYXNzJylcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgdXRpbC50YWJlbGl6ZShoZWxwZXIubmFtZSB8fCAnJylcbiAgICB0aGlzLnJvb3QgPSBqb2luKChvcHRpb25zLnJvb3QgfHwgaG9zdC5yb290KSwgdGhpcy5uYW1lKVxuXG4gICAgbGV0IHJlZ2lzdHJ5ID0geyB9XG4gICAgbGV0IGFsaWFzZXMgPSB7IH1cblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2hvc3QnLCAoKSA9PiBob3N0KVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2FsaWFzZXMnLCAoKSA9PiBhbGlhc2VzKVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ3JlZ2lzdHJ5JywgKCkgPT4gcmVnaXN0cnkpXG4gICAgdXRpbC5oaWRlLmdldHRlcih0aGlzLCAnaGVscGVyJywgKCkgPT4gaGVscGVyKVxuXG4gICAgaWYgKGhvc3QudHlwZSA9PT0gJ2ZyYW1ld29yaycpIHtcbiAgICAgIEZhbGxiYWNrc1t0aGlzLm5hbWVdID0gdGhpc1xuICAgIH1cblxuICAgIGxldCBpbmRleFNjcmlwdFxuXG4gICAgdGhpcy5sb2FkZWQgPSBmYWxzZVxuXG4gICAgdHJ5IHtcbiAgICAgIGluZGV4U2NyaXB0ID0gcmVxdWlyZS5yZXNvbHZlKGpvaW4odGhpcy5yb290LCAnaW5kZXguanMnKSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuXG4gICAgfVxuXG4gICAgaWYgKGluZGV4U2NyaXB0KSB7XG4gICAgICB0aGlzLmxvYWRlZCA9IHRydWVcbiAgICAgIHRoaXMucnVuTG9hZGVyKHJlcXVpcmUoaW5kZXhTY3JpcHQpKVxuICAgIH1cblxuICAgIGJ1aWxkQXRJbnRlcmZhY2UodGhpcylcblxuICAgIHRoaXMubG9hZGVkID0gdHJ1ZVxuICB9XG5cbiAgcmVtb3ZlIChoZWxwZXJJZCkge1xuICAgIGxldCBpbnN0YW5jZSA9IHRoaXMubG9va3VwKGhlbHBlcklkLCBmYWxzZSlcbiAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgIGlmIChpbnN0YW5jZS5uYW1lKSB7XG4gICAgICAgIGRlbGV0ZSAodGhpcy5hbGlhc2VzLCBpbnN0YW5jZS5uYW1lKVxuICAgICAgfVxuXG4gICAgICBpZiAoaW5zdGFuY2UuYWxpYXNlcykge1xuICAgICAgICBpbnN0YW5jZS5hbGlhc2VzLmZvckVhY2goYSA9PiBkZWxldGUgKHRoaXMuYWxpYXNlc1thXSkpXG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSAodGhpcy5hbGlhc2VzW2luc3RhbmNlLmlkXSlcbiAgICAgIGRlbGV0ZSAodGhpcy5yZWdpc3RyeVtpbnN0YW5jZS5pZF0pXG4gICAgfVxuICB9XG5cbiAgcnVuIChoZWxwZXJJZCwgLi4uYXJncykge1xuICAgIGxldCBmbiA9IHRoaXMubG9va3VwKGhlbHBlcklkKS5ydW5uZXJcbiAgICByZXR1cm4gZm4oLi4uYXJncylcbiAgfVxuXG4gIGdldCBmYWxsYmFjayAoKSB7XG4gICAgaWYgKHRoaXMuaG9zdC50eXBlICE9PSAnZnJhbWV3b3JrJykge1xuICAgICAgcmV0dXJuIEZhbGxiYWNrc1t0aGlzLm5hbWVdXG4gICAgfVxuICB9XG5cbiAgbG9va3VwIChuZWVkbGUsIHN0cmljdCA9IHRydWUsIGZyb21Qcm9qZWN0KSB7XG4gICAgbGV0IGhlbHBlcklkID0gdGhpcy5hbGlhc2VzW25lZWRsZV1cblxuICAgIGlmICh0eXBlb2YgKGhlbHBlcklkKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0aGlzLmZhbGxiYWNrKSB7IHJldHVybiB0aGlzLmZhbGxiYWNrLmxvb2t1cChuZWVkbGUsIHN0cmljdCwgdGhpcy5ob3N0KSB9XG4gICAgICBpZiAoc3RyaWN0KSB7IHRocm93ICgnQ291bGQgbm90IGZpbmQgaGVscGVyIHdpdGggaWQ6JyArIG5lZWRsZSkgfVxuICAgIH1cblxuICAgIGxldCByZXN1bHQgPSB0aGlzLnJlZ2lzdHJ5W2hlbHBlcklkXVxuXG4gICAgaWYgKHJlc3VsdCAmJiBmcm9tUHJvamVjdCkgeyByZXN1bHQub3B0aW9ucy5wcm9qZWN0ID0gZnJvbVByb2plY3QgfVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgcmVnaXN0ZXIgKGhlbHBlcklkLCBoZWxwZXJJbnN0YW5jZSkge1xuICAgIGlmICghaGVscGVySW5zdGFuY2UpIHtcbiAgICAgIHRocm93ICgnRXJyb3IgcmVnaXN0ZXJpbmcgJyArIGhlbHBlcklkKVxuICAgIH1cblxuICAgIHRoaXMuYWxpYXNlc1toZWxwZXJJZF0gPSBoZWxwZXJJZFxuXG4gICAgaWYgKGhlbHBlckluc3RhbmNlLm5hbWUpIHtcbiAgICAgIHRoaXMuYWxpYXNlc1toZWxwZXJJbnN0YW5jZS5uYW1lXSA9IGhlbHBlcklkXG4gICAgfVxuXG4gICAgdGhpcy5yZWdpc3RyeVtoZWxwZXJJZF0gPSBoZWxwZXJJbnN0YW5jZVxuXG4gICAgaGVscGVySW5zdGFuY2UuYWxpYXNlcyAmJiBoZWxwZXJJbnN0YW5jZS5hbGlhc2VzLmZvckVhY2goYWxpYXMgPT4ge1xuICAgICAgdGhpcy5hbGlhc2VzW2FsaWFzXSA9IGhlbHBlcklkXG4gICAgfSlcblxuICAgIHJldHVybiBoZWxwZXJJbnN0YW5jZVxuICB9XG5cbiAgYnVpbGRJZCAoaGVscGVyVVJMLCBrZWVwRXh0ZW5zaW9uID0gZmFsc2UpIHtcbiAgICBsZXQgcmVnID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLnJvb3QgKyAnLycsICdpJylcblxuICAgIGlmICghaGVscGVyVVJMLm1hdGNoKHJlZykpIHtcbiAgICAgIGhlbHBlclVSTCA9IGJhc2VuYW1lKGhlbHBlclVSTClcbiAgICB9XG5cbiAgICBsZXQgYmFzZSA9IGhlbHBlclVSTC5yZXBsYWNlKHJlZywgJycpXG5cbiAgICBpZiAoYmFzZS5tYXRjaCgvXFwvaW5kZXgkL2kpKSB7XG4gICAgICBiYXNlID0gYmFzZS5yZXBsYWNlKC9cXC9pbmRleCQvaSwgJycpXG4gICAgfVxuXG4gICAgcmV0dXJuIGtlZXBFeHRlbnNpb24gPyBiYXNlIDogYmFzZS5yZXBsYWNlKC9cXC5cXHcrJC9pLCAnJylcbiAgfVxuXG4gIHJ1bkxvYWRlciAoZm4pIHtcbiAgICBsZXQgbG9jYWxzID0gT2JqZWN0LmFzc2lnbih7fSwgKHRoaXMuaGVscGVyLkRTTCA/IHRoaXMuaGVscGVyLkRTTCA6IHsgfSkpXG5cbiAgICBsb2NhbHMudXRpbCA9IHV0aWxcblxuICAgIGlmICh0aGlzLmhvc3QgJiYgdGhpcy5ob3N0LnR5cGUgJiYgIWxvY2Fsc1t0aGlzLmhvc3QudHlwZV0pIHtcbiAgICAgIGxvY2Fsc1t0aGlzLmhvc3QudHlwZV0gPSB0aGlzLmhvc3RcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oZWxwZXIgJiYgdGhpcy5oZWxwZXIubmFtZSkge1xuICAgICAgbG9jYWxzW3RoaXMuaGVscGVyLm5hbWVdID0gdGhpcy5oZWxwZXJcbiAgICB9XG5cbiAgICBsb2NhbHMucmVnaXN0cnkgPSB0aGlzXG4gICAgbG9jYWxzLmxvYWQgPSB0aGlzLmxvYWQuYmluZCh0aGlzKVxuXG4gICAgdXRpbC5ub0NvbmZsaWN0KGZuLCBsb2NhbHMpKClcbiAgfVxuXG4gIGxvYWQgKHVyaSwgaWQpIHtcbiAgICBjb25zdCBIZWxwZXJDbGFzcyA9IHRoaXMuaGVscGVyXG5cbiAgICBsZXQgb3duZXIgPSB0aGlzXG5cbiAgICBpZCA9IGlkIHx8IHRoaXMuYnVpbGRJZCh1cmkpXG5cbiAgICBsZXQgaGVscGVySW5zdGFuY2VcblxuICAgIHRyeSB7XG4gICAgICBsZXQgcmVxdWlyZWQgPSByZXF1aXJlKHVyaSlcbiAgICAgIGxldCBjYWNoZWQgPSByZXF1aXJlLmNhY2hlW3VyaV1cbiAgICAgIGxldCBlbXB0eSA9IE9iamVjdC5rZXlzKGNhY2hlZC5leHBvcnRzKS5sZW5ndGggPT09IDBcbiAgICAgIGxldCBkZWZpbml0aW9uID0gdGhpcy5oZWxwZXIuRGVmaW5pdGlvbiAmJiB0aGlzLmhlbHBlci5EZWZpbml0aW9uLmN1cnJlbnQoKVxuXG4gICAgICBpZiAoZW1wdHkgJiYgZGVmaW5pdGlvbikge1xuICAgICAgICBoZWxwZXJJbnN0YW5jZSA9IEhlbHBlckNsYXNzLmZyb21EZWZpbml0aW9uKHVyaSwgZGVmaW5pdGlvbiwge293bmVyLCBpZCwgcmVxdWlyZWR9KVxuICAgICAgfSBlbHNlIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGhlbHBlckluc3RhbmNlID0gSGVscGVyQ2xhc3MuZnJvbURlZmluaXRpb24odXJpLCBkZWZpbml0aW9uLCB7b3duZXIsIGlkLCByZXF1aXJlZH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWxwZXJJbnN0YW5jZSA9IG5ldyBIZWxwZXJDbGFzcyh1cmksIHtvd25lciwgaWQsIGRlZmluaXRpb24sIHJlcXVpcmVkfSlcbiAgICAgIH1cblxuICAgICAgaWYgKCFoZWxwZXJJbnN0YW5jZSkge1xuICAgICAgICB0aHJvdyAoJ1VoIG9oJylcbiAgICAgIH1cblxuICAgICAgaWQgPSBpZC5yZXBsYWNlKC9cXC9pbmRleCQvaSwgJycpXG5cbiAgICAgIHRoaXMucmVnaXN0ZXIoaWQsIGhlbHBlckluc3RhbmNlKVxuXG4gICAgICBpZiAodGhpcy5oZWxwZXIuRGVmaW5pdGlvbiAmJiB0aGlzLmhlbHBlci5EZWZpbml0aW9uLmNsZWFyRGVmaW5pdGlvbikge1xuICAgICAgICAgdGhpcy5oZWxwZXIuRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24oKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVscGVySW5zdGFuY2VcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGxvYWRpbmc6ICcgKyB1cmksIGVycm9yLm1lc3NhZ2UpXG4gICAgfVxuICB9XG5cbiAgZ2V0IGFsbCAoKSB7XG4gICAgcmV0dXJuIHV0aWwudmFsdWVzKHRoaXMucmVnaXN0cnkpXG4gIH1cblxuICBnZXQgYXZhaWxhYmxlICgpIHtcbiAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMucmVnaXN0cnkpXG5cbiAgICBpZiAodGhpcy5mYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGtleXMuY29uY2F0KHRoaXMuZmFsbGJhY2suYXZhaWxhYmxlKVxuICAgIH1cblxuICAgIHJldHVybiBrZXlzXG4gIH1cbn1cblxuY29uc3QgX0NBQ0hFID0geyB9XG5cbmNsYXNzIEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvciAoY2FjaGUpIHtcbiAgICB0aGlzLmNhY2hlID0gY2FjaGUgfHwge31cbiAgfVxuXG4gIGJ1aWxkICguLi5hcmdzKSB7XG4gICAgcmV0dXJuIFJlZ2lzdHJ5LmJ1aWxkKC4uLmFyZ3MpXG4gIH1cblxuICBidWlsZEFsbCAoaG9zdCwgaGVscGVycywgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHJvb3QgPSBvcHRpb25zLnJvb3QgfHwgaG9zdC5yb290XG4gICAgbGV0IGMgPSB0aGlzLmNhY2hlW2hvc3Qucm9vdF0gPSB0aGlzLmNhY2hlW2hvc3Qucm9vdF0gfHwgeyB9XG5cbiAgICByb290LnNob3VsZC5ub3QuYmUuZW1wdHkoKVxuICAgIGMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgIGhlbHBlcnMuc2hvdWxkLm5vdC5iZS5lbXB0eSgpXG5cbiAgICBPYmplY3Qua2V5cyhoZWxwZXJzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgbGV0IG5hbWUgPSB1dGlsLnRhYmVsaXplKHR5cGUpXG4gICAgICBjW25hbWVdID0gY1tuYW1lXSB8fCBSZWdpc3RyeS5idWlsZChob3N0LCBoZWxwZXJzW3R5cGVdLCB7bmFtZSwgcm9vdDogaG9zdC5yb290fSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBCdWlsZGVyKF9DQUNIRSlcblxuZnVuY3Rpb24gYnVpbGRBdEludGVyZmFjZSAoaG9zdCkge1xuICBsZXQgY2hhaW4gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICByZXR1cm4gaG9zdC5sb29rdXAoaWQpXG4gIH1cblxuICBsZXQgZXhwYW5kID0gaG9zdC5sb2FkZWRcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaG9zdCwgJ2F0Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogY2hhaW5cbiAgfSlcblxuICBsZXQgaWRQYXRocyA9IGhvc3QuYXZhaWxhYmxlLmNvbmNhdChbXSlcblxuICBpZiAoZXhwYW5kKSB7XG4gICAgbGV0IGV4cGFuZGVkID0gaWRQYXRocy5tYXAoaWRQYXRoID0+IGlkUGF0aC5zcGxpdCgnLycpKS5zb3J0KChhLCBiKSA9PiBhLmxlbmd0aCA+IGIubGVuZ3RoKVxuXG4gICAgZXhwYW5kZWQuZm9yRWFjaChwYXJ0cyA9PiB7XG4gICAgICBsZXQgaWQgPSBwYXJ0cy5qb2luKCcvJylcbiAgICAgIGxldCBmaXJzdCA9IHBhcnRzWzBdXG5cbiAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdXRpbC5hc3NpZ24oY2hhaW4sIHtcbiAgICAgICAgICBnZXQgW2ZpcnN0XSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaG9zdC5sb29rdXAoaWQpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgICBsZXQgZ2V0dGVyID0gcGFydHMucG9wKClcbiAgICAgICAgbGV0IGlkUGF0aCA9IHBhcnRzLmpvaW4oJy4nKS5yZXBsYWNlKC8tL2csICdfJylcbiAgICAgICAgbGV0IHRhcmdldCA9IGNhcnZlLmdldChjaGFpbiwgaWRQYXRoKSB8fCB7IH1cblxuICAgICAgICB1dGlsLmFzc2lnbih0YXJnZXQsIHtcbiAgICAgICAgICBnZXQgW2dldHRlcl0gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGhvc3QubG9va3VwKGlkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgY2FydmUuc2V0KGNoYWluLCBpZFBhdGgsIHRhcmdldClcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG4iXX0=