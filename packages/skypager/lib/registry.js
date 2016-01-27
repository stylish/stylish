'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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

  /**
   * Remove a helper from this registry
   *
   * @param {Helper.id} helperId - the id the helper was registered with
  */

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

    /**
     * run a helper's main function.
     *
     * using the helperId 'loader' and passing it a function is a convenient way
     * of running a special loader function. @see runLoader
     *
     * @param {Helper.id} helperId
     * @param {Whatever} ...args
    */

  }, {
    key: 'run',
    value: function run(helperId) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      if (helperId === 'loader') {
        return this.runLoader(options, context);
      }

      if (this.host.type === 'project') {
        context.project = context.project || this.host;
      }

      return this.lookup(helperId).run(options, context);
    }

    /**
     * The Fallback registry for now will always be Skypager
     *
     * @private
    */

  }, {
    key: 'query',

    /**
     * Query this helper registry and return only helpers which match
     *
     * @example return actions that expose a CLI interface
     *
     *  skypager.actions.query((helper) => {
     *    return ('cli' in helper.definition.interfaces)
     *  })
    */
    value: function query(params) {
      return util.filterQuery(this.allHelpers(true), params);
    }

    /**
     * Lookup a helper by id
     *
     * @param {Helper.id} needle the id of the helper you want
     * @param {Boolean} strict throw an error when it is not found
     * @param {Project} fromProject only return helpers that were registered by a particular project
     *
     */

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

    /**
     * Register a helper instance
     *
     * @param {Helper.id} helperId the id to reference this helper by
     * @param {Helper} helperInstance a helper object that wraps this helper file with metadata
    */

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

    /**
     * build a Helper.id for a given helper path
     *
     * @param {Path} helperURL the absolute path to this helper
     * @param {Boolean} keepExtension - keep the file extension as part of the Helper.id
    */

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

    /**
     * Run a helper loader function for this registry.
     *
     * @param {Function} fn a function which is about to load helpers for us
     * @param {Object} locals an object containing variables to inject into scope
     *
     * This will run the required function in a special context
     * where certain sugar is injected into the global scope.
     *
     * These loader functions can expect to have the following in scope:
     *
     * - registry - this
     * - [helperType] - a variable named action, model, exporter, plugin, or whatever
     * - load - a function to load in a uri. this.load.bind(registry)
     *
    */

  }, {
    key: 'runLoader',
    value: function runLoader(fn) {
      var locals = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var registry = this;
      var host = this.host;

      locals = Object.assign(locals, this.helper.DSL ? this.helper.DSL : {});
      locals.load = registry.load.bind(registry);

      util.noConflict(function () {
        fn.call(host, registry, host.type);
      }, locals)();
    }

    /**
     * Load a helper by its URI or Path.
     *
     * @description
     *
     * This will require the helper in a special context where certain
     * objects and functions are injected in the global scope. This makes it easier to
     * write helpers by providing them with a specific DSL based on the helper type.
     *
     * @param {String} uri the absolute path to the helper
     * @param {Helper.id} id what id to register this helper under?
     *
     * @see helpers/definitions/model.js for example
     *
     * NOTE: Need to refactor this if im going to use webpack as a build
     * since it doesnt like dynamic require.
    */

  }, {
    key: 'load',
    value: function load(uri, id) {
      if (typeof uri !== 'string') {
        return this.loadModule.apply(this, arguments);
      }

      return this.loadPath.apply(this, arguments);
    }
  }, {
    key: 'loadModule',
    value: function loadModule(required) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (typeof required === 'string') {
        return this.loadPath.apply(this, arguments);
      }

      var id = options.id;
      var uri = options.uri;

      id = id || this.buildId(uri);

      var owner = this;

      var helperInstance = undefined;
      var empty = (typeof required === 'undefined' ? 'undefined' : _typeof(required)) === 'object' && Object.keys(required).length === 0;
      var definition = this.helper.Definition && this.helper.Definition.current();

      if (empty && definition) {
        helperInstance = HelperClass.fromDefinition(uri, definition, { owner: owner, id: id, required: required });
      } else if (definition) {
        helperInstance = HelperClass.fromDefinition(uri, definition, { owner: owner, id: id, required: required });
      } else {
        helperInstance = new HelperClass(uri, { owner: owner, id: id, definition: definition, required: required });
      }

      this.register(id, helperInstance);

      // todo: should just be a method on definition
      if (this.helper.Definition && this.helper.Definition.clearDefinition) {
        this.helper.Definition.clearDefinition();
      }

      return helperInstance;
    }
  }, {
    key: 'loadPath',
    value: function loadPath(uri, id) {
      var HelperClass = this.helper;

      var owner = this;

      id = id || this.buildId(uri);

      var helperInstance = undefined;

      try {
        var required = require(uri);
        var empty = (typeof required === 'undefined' ? 'undefined' : _typeof(required)) === 'object' && Object.keys(required).length === 0;
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

        // todo: should just be a method on definition
        if (this.helper.Definition && this.helper.Definition.clearDefinition) {
          this.helper.Definition.clearDefinition();
        }

        return helperInstance;
      } catch (error) {
        console.log('Error loading: ' + uri, error.message);
        console.log(error.stack);
      }
    }
  }, {
    key: 'filter',
    value: function filter() {
      var _all;

      return (_all = this.all).filter.apply(_all, arguments);
    }
  }, {
    key: 'map',
    value: function map() {
      var _all2;

      return (_all2 = this.all).map.apply(_all2, arguments);
    }
  }, {
    key: 'forEach',
    value: function forEach() {
      var _all3;

      return (_all3 = this.all).forEach.apply(_all3, arguments);
    }
  }, {
    key: 'allHelpers',
    value: function allHelpers() {
      var includeFallback = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var mine = util.values(this.registry);

      if (this.fallback && includeFallback) {
        return mine.concat(this.fallback.all);
      }

      return mine;
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
      return this.allHelpers(false);
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
//# sourceMappingURL=data:application/json;base64,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QUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ3hCLFVBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTs7QUFFcEIsVUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs7O0FBQ3RCLFlBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxvREFDVixLQUFLLGdCQUFMLEtBQUsscUJBQUwsS0FBSyxvQkFBSztBQUNiLGlCQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDdkIsd0VBQ0QsQ0FBQTtPQUNIOztBQUVELFVBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Ozs7QUFDcEIsY0FBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLGNBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUMvQyxjQUFJLE1BQU0sR0FBRyxxQkFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUcsQ0FBQTs7QUFFNUMsY0FBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLHVEQUNYLE1BQU0saUJBQU4sTUFBTSxzQkFBTixNQUFNLG9CQUFLO0FBQ2QsbUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtXQUN2QiwyRUFDRCxDQUFBO0FBQ0YsK0JBQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7O09BQ2pDO0tBQ0YsQ0FBQyxDQUFBO0dBQ0g7Q0FDRiIsImZpbGUiOiJyZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTa3lwYWdlciBmcm9tICcuL2luZGV4J1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnXG5pbXBvcnQgY2FydmUgZnJvbSAnb2JqZWN0LXBhdGgnXG5cbmltcG9ydCB7IGJhc2VuYW1lLCBqb2luLCByZXNvbHZlLCBkaXJuYW1lLCByZWxhdGl2ZSB9IGZyb20gJ3BhdGgnXG5cblxuaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdza3lwYWdlcjpyZWdpc3RyeScpXG5cbmNvbnN0IEZhbGxiYWNrcyA9IHt9XG5cbmNsYXNzIFJlZ2lzdHJ5IHtcbiAgc3RhdGljIGJ1aWxkIChob3N0LCBoZWxwZXIsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gbmV3IFJlZ2lzdHJ5KGhvc3QsIGhlbHBlciwgb3B0aW9ucylcbiAgfVxuXG4gIGNvbnN0cnVjdG9yIChob3N0LCBoZWxwZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICghaG9zdCB8fCAhaGVscGVyKSB7XG4gICAgICB0aHJvdyAoJ011c3Qgc3VwcGx5IGEgcmVnaXN0cnkgd2l0aCBhIGhvc3QgYW5kIGEgaGVscGVyIGNsYXNzJylcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgdXRpbC50YWJlbGl6ZShoZWxwZXIubmFtZSB8fCAnJylcbiAgICB0aGlzLnJvb3QgPSBqb2luKChvcHRpb25zLnJvb3QgfHwgaG9zdC5yb290KSwgdGhpcy5uYW1lKVxuXG4gICAgbGV0IHJlZ2lzdHJ5ID0geyB9XG4gICAgbGV0IGFsaWFzZXMgPSB7IH1cblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2hvc3QnLCAoKSA9PiBob3N0KVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2FsaWFzZXMnLCAoKSA9PiBhbGlhc2VzKVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ3JlZ2lzdHJ5JywgKCkgPT4gcmVnaXN0cnkpXG4gICAgdXRpbC5oaWRlLmdldHRlcih0aGlzLCAnaGVscGVyJywgKCkgPT4gaGVscGVyKVxuXG4gICAgaWYgKGhvc3QudHlwZSA9PT0gJ2ZyYW1ld29yaycpIHtcbiAgICAgIEZhbGxiYWNrc1t0aGlzLm5hbWVdID0gdGhpc1xuICAgIH1cblxuICAgIGxldCBpbmRleFNjcmlwdFxuXG4gICAgdGhpcy5sb2FkZWQgPSBmYWxzZVxuXG4gICAgdHJ5IHtcbiAgICAgIGluZGV4U2NyaXB0ID0gcmVxdWlyZS5yZXNvbHZlKGpvaW4odGhpcy5yb290LCAnaW5kZXguanMnKSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuXG4gICAgfVxuXG4gICAgaWYgKGluZGV4U2NyaXB0KSB7XG4gICAgICB0aGlzLmxvYWRlZCA9IHRydWVcbiAgICAgIHRoaXMucnVuTG9hZGVyKHJlcXVpcmUoaW5kZXhTY3JpcHQpKVxuICAgIH1cblxuICAgIGJ1aWxkQXRJbnRlcmZhY2UodGhpcylcblxuICAgIHRoaXMubG9hZGVkID0gdHJ1ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGhlbHBlciBmcm9tIHRoaXMgcmVnaXN0cnlcbiAgICpcbiAgICogQHBhcmFtIHtIZWxwZXIuaWR9IGhlbHBlcklkIC0gdGhlIGlkIHRoZSBoZWxwZXIgd2FzIHJlZ2lzdGVyZWQgd2l0aFxuICAqL1xuICByZW1vdmUgKGhlbHBlcklkKSB7XG4gICAgbGV0IGluc3RhbmNlID0gdGhpcy5sb29rdXAoaGVscGVySWQsIGZhbHNlKVxuICAgIGlmIChpbnN0YW5jZSkge1xuICAgICAgaWYgKGluc3RhbmNlLm5hbWUpIHtcbiAgICAgICAgZGVsZXRlICh0aGlzLmFsaWFzZXMsIGluc3RhbmNlLm5hbWUpXG4gICAgICB9XG5cbiAgICAgIGlmIChpbnN0YW5jZS5hbGlhc2VzKSB7XG4gICAgICAgIGluc3RhbmNlLmFsaWFzZXMuZm9yRWFjaChhID0+IGRlbGV0ZSAodGhpcy5hbGlhc2VzW2FdKSlcbiAgICAgIH1cblxuICAgICAgZGVsZXRlICh0aGlzLmFsaWFzZXNbaW5zdGFuY2UuaWRdKVxuICAgICAgZGVsZXRlICh0aGlzLnJlZ2lzdHJ5W2luc3RhbmNlLmlkXSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogcnVuIGEgaGVscGVyJ3MgbWFpbiBmdW5jdGlvbi5cbiAgICpcbiAgICogdXNpbmcgdGhlIGhlbHBlcklkICdsb2FkZXInIGFuZCBwYXNzaW5nIGl0IGEgZnVuY3Rpb24gaXMgYSBjb252ZW5pZW50IHdheVxuICAgKiBvZiBydW5uaW5nIGEgc3BlY2lhbCBsb2FkZXIgZnVuY3Rpb24uIEBzZWUgcnVuTG9hZGVyXG4gICAqXG4gICAqIEBwYXJhbSB7SGVscGVyLmlkfSBoZWxwZXJJZFxuICAgKiBAcGFyYW0ge1doYXRldmVyfSAuLi5hcmdzXG4gICovXG4gIHJ1biAoaGVscGVySWQsIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gICAgaWYgKCBoZWxwZXJJZCA9PT0gJ2xvYWRlcicgKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5Mb2FkZXIob3B0aW9ucywgY29udGV4dClcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ob3N0LnR5cGUgPT09ICdwcm9qZWN0Jykge1xuICAgICAgY29udGV4dC5wcm9qZWN0ID0gY29udGV4dC5wcm9qZWN0IHx8IHRoaXMuaG9zdFxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmxvb2t1cChoZWxwZXJJZCkucnVuKG9wdGlvbnMsIGNvbnRleHQpXG4gIH1cblxuICAvKipcbiAgICogVGhlIEZhbGxiYWNrIHJlZ2lzdHJ5IGZvciBub3cgd2lsbCBhbHdheXMgYmUgU2t5cGFnZXJcbiAgICpcbiAgICogQHByaXZhdGVcbiAgKi9cbiAgZ2V0IGZhbGxiYWNrICgpIHtcbiAgICBpZiAodGhpcy5ob3N0LnR5cGUgIT09ICdmcmFtZXdvcmsnKSB7XG4gICAgICByZXR1cm4gRmFsbGJhY2tzW3RoaXMubmFtZV1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUXVlcnkgdGhpcyBoZWxwZXIgcmVnaXN0cnkgYW5kIHJldHVybiBvbmx5IGhlbHBlcnMgd2hpY2ggbWF0Y2hcbiAgICpcbiAgICogQGV4YW1wbGUgcmV0dXJuIGFjdGlvbnMgdGhhdCBleHBvc2UgYSBDTEkgaW50ZXJmYWNlXG4gICAqXG4gICAqICBza3lwYWdlci5hY3Rpb25zLnF1ZXJ5KChoZWxwZXIpID0+IHtcbiAgICogICAgcmV0dXJuICgnY2xpJyBpbiBoZWxwZXIuZGVmaW5pdGlvbi5pbnRlcmZhY2VzKVxuICAgKiAgfSlcbiAgKi9cbiAgcXVlcnkgKHBhcmFtcykge1xuICAgIHJldHVybiB1dGlsLmZpbHRlclF1ZXJ5KHRoaXMuYWxsSGVscGVycyh0cnVlKSwgcGFyYW1zKVxuICB9XG5cbiAgLyoqXG4gICAqIExvb2t1cCBhIGhlbHBlciBieSBpZFxuICAgKlxuICAgKiBAcGFyYW0ge0hlbHBlci5pZH0gbmVlZGxlIHRoZSBpZCBvZiB0aGUgaGVscGVyIHlvdSB3YW50XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gc3RyaWN0IHRocm93IGFuIGVycm9yIHdoZW4gaXQgaXMgbm90IGZvdW5kXG4gICAqIEBwYXJhbSB7UHJvamVjdH0gZnJvbVByb2plY3Qgb25seSByZXR1cm4gaGVscGVycyB0aGF0IHdlcmUgcmVnaXN0ZXJlZCBieSBhIHBhcnRpY3VsYXIgcHJvamVjdFxuICAgKlxuICAgKi9cbiAgbG9va3VwIChuZWVkbGUsIHN0cmljdCA9IHRydWUsIGZyb21Qcm9qZWN0KSB7XG4gICAgbGV0IGhlbHBlcklkID0gdGhpcy5hbGlhc2VzW25lZWRsZV1cblxuICAgIGlmICh0eXBlb2YgKGhlbHBlcklkKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0aGlzLmZhbGxiYWNrKSB7IHJldHVybiB0aGlzLmZhbGxiYWNrLmxvb2t1cChuZWVkbGUsIHN0cmljdCwgdGhpcy5ob3N0KSB9XG4gICAgICBpZiAoc3RyaWN0KSB7IHRocm93ICgnQ291bGQgbm90IGZpbmQgaGVscGVyIHdpdGggaWQ6JyArIG5lZWRsZSkgfVxuICAgIH1cblxuICAgIGxldCByZXN1bHQgPSB0aGlzLnJlZ2lzdHJ5W2hlbHBlcklkXVxuXG4gICAgaWYgKHJlc3VsdCAmJiBmcm9tUHJvamVjdCkgeyByZXN1bHQub3B0aW9ucy5wcm9qZWN0ID0gZnJvbVByb2plY3QgfVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgaGVscGVyIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSB7SGVscGVyLmlkfSBoZWxwZXJJZCB0aGUgaWQgdG8gcmVmZXJlbmNlIHRoaXMgaGVscGVyIGJ5XG4gICAqIEBwYXJhbSB7SGVscGVyfSBoZWxwZXJJbnN0YW5jZSBhIGhlbHBlciBvYmplY3QgdGhhdCB3cmFwcyB0aGlzIGhlbHBlciBmaWxlIHdpdGggbWV0YWRhdGFcbiAgKi9cbiAgcmVnaXN0ZXIgKGhlbHBlcklkLCBoZWxwZXJJbnN0YW5jZSkge1xuICAgIGlmICghaGVscGVySW5zdGFuY2UpIHtcbiAgICAgIHRocm93ICgnRXJyb3IgcmVnaXN0ZXJpbmcgJyArIGhlbHBlcklkKVxuICAgIH1cblxuICAgIHRoaXMuYWxpYXNlc1toZWxwZXJJZF0gPSBoZWxwZXJJZFxuXG4gICAgaWYgKGhlbHBlckluc3RhbmNlLm5hbWUpIHtcbiAgICAgIHRoaXMuYWxpYXNlc1toZWxwZXJJbnN0YW5jZS5uYW1lXSA9IGhlbHBlcklkXG4gICAgfVxuXG4gICAgdGhpcy5yZWdpc3RyeVtoZWxwZXJJZF0gPSBoZWxwZXJJbnN0YW5jZVxuXG4gICAgaGVscGVySW5zdGFuY2UuYWxpYXNlcyAmJiBoZWxwZXJJbnN0YW5jZS5hbGlhc2VzLmZvckVhY2goYWxpYXMgPT4ge1xuICAgICAgdGhpcy5hbGlhc2VzW2FsaWFzXSA9IGhlbHBlcklkXG4gICAgfSlcblxuICAgIHJldHVybiBoZWxwZXJJbnN0YW5jZVxuICB9XG5cbiAgLyoqXG4gICAqIGJ1aWxkIGEgSGVscGVyLmlkIGZvciBhIGdpdmVuIGhlbHBlciBwYXRoXG4gICAqXG4gICAqIEBwYXJhbSB7UGF0aH0gaGVscGVyVVJMIHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoaXMgaGVscGVyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0ga2VlcEV4dGVuc2lvbiAtIGtlZXAgdGhlIGZpbGUgZXh0ZW5zaW9uIGFzIHBhcnQgb2YgdGhlIEhlbHBlci5pZFxuICAqL1xuICBidWlsZElkIChoZWxwZXJVUkwsIGtlZXBFeHRlbnNpb24gPSBmYWxzZSkge1xuICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMucm9vdCArICcvJywgJ2knKVxuXG4gICAgaWYgKCFoZWxwZXJVUkwubWF0Y2gocmVnKSkge1xuICAgICAgaGVscGVyVVJMID0gYmFzZW5hbWUoaGVscGVyVVJMKVxuICAgIH1cblxuICAgIGxldCBiYXNlID0gaGVscGVyVVJMLnJlcGxhY2UocmVnLCAnJylcblxuICAgIGlmIChiYXNlLm1hdGNoKC9cXC9pbmRleCQvaSkpIHtcbiAgICAgIGJhc2UgPSBiYXNlLnJlcGxhY2UoL1xcL2luZGV4JC9pLCAnJylcbiAgICB9XG5cbiAgICByZXR1cm4ga2VlcEV4dGVuc2lvbiA/IGJhc2UgOiBiYXNlLnJlcGxhY2UoL1xcLlxcdyskL2ksICcnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1biBhIGhlbHBlciBsb2FkZXIgZnVuY3Rpb24gZm9yIHRoaXMgcmVnaXN0cnkuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIGEgZnVuY3Rpb24gd2hpY2ggaXMgYWJvdXQgdG8gbG9hZCBoZWxwZXJzIGZvciB1c1xuICAgKiBAcGFyYW0ge09iamVjdH0gbG9jYWxzIGFuIG9iamVjdCBjb250YWluaW5nIHZhcmlhYmxlcyB0byBpbmplY3QgaW50byBzY29wZVxuICAgKlxuICAgKiBUaGlzIHdpbGwgcnVuIHRoZSByZXF1aXJlZCBmdW5jdGlvbiBpbiBhIHNwZWNpYWwgY29udGV4dFxuICAgKiB3aGVyZSBjZXJ0YWluIHN1Z2FyIGlzIGluamVjdGVkIGludG8gdGhlIGdsb2JhbCBzY29wZS5cbiAgICpcbiAgICogVGhlc2UgbG9hZGVyIGZ1bmN0aW9ucyBjYW4gZXhwZWN0IHRvIGhhdmUgdGhlIGZvbGxvd2luZyBpbiBzY29wZTpcbiAgICpcbiAgICogLSByZWdpc3RyeSAtIHRoaXNcbiAgICogLSBbaGVscGVyVHlwZV0gLSBhIHZhcmlhYmxlIG5hbWVkIGFjdGlvbiwgbW9kZWwsIGV4cG9ydGVyLCBwbHVnaW4sIG9yIHdoYXRldmVyXG4gICAqIC0gbG9hZCAtIGEgZnVuY3Rpb24gdG8gbG9hZCBpbiBhIHVyaS4gdGhpcy5sb2FkLmJpbmQocmVnaXN0cnkpXG4gICAqXG4gICovXG4gIHJ1bkxvYWRlciAoZm4sIGxvY2FscyA9IHt9KSB7XG4gICAgbGV0IHJlZ2lzdHJ5ID0gdGhpc1xuICAgIGxldCBob3N0ID0gdGhpcy5ob3N0XG5cbiAgICBsb2NhbHMgPSBPYmplY3QuYXNzaWduKGxvY2FscywgKHRoaXMuaGVscGVyLkRTTCA/IHRoaXMuaGVscGVyLkRTTCA6IHt9KSlcbiAgICBsb2NhbHMubG9hZCA9IHJlZ2lzdHJ5LmxvYWQuYmluZChyZWdpc3RyeSlcblxuICAgIHV0aWwubm9Db25mbGljdChmdW5jdGlvbigpIHtcbiAgICAgIGZuLmNhbGwoaG9zdCwgcmVnaXN0cnksIGhvc3QudHlwZSlcbiAgICB9LCBsb2NhbHMpKClcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGEgaGVscGVyIGJ5IGl0cyBVUkkgb3IgUGF0aC5cbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIFRoaXMgd2lsbCByZXF1aXJlIHRoZSBoZWxwZXIgaW4gYSBzcGVjaWFsIGNvbnRleHQgd2hlcmUgY2VydGFpblxuICAgKiBvYmplY3RzIGFuZCBmdW5jdGlvbnMgYXJlIGluamVjdGVkIGluIHRoZSBnbG9iYWwgc2NvcGUuIFRoaXMgbWFrZXMgaXQgZWFzaWVyIHRvXG4gICAqIHdyaXRlIGhlbHBlcnMgYnkgcHJvdmlkaW5nIHRoZW0gd2l0aCBhIHNwZWNpZmljIERTTCBiYXNlZCBvbiB0aGUgaGVscGVyIHR5cGUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmkgdGhlIGFic29sdXRlIHBhdGggdG8gdGhlIGhlbHBlclxuICAgKiBAcGFyYW0ge0hlbHBlci5pZH0gaWQgd2hhdCBpZCB0byByZWdpc3RlciB0aGlzIGhlbHBlciB1bmRlcj9cbiAgICpcbiAgICogQHNlZSBoZWxwZXJzL2RlZmluaXRpb25zL21vZGVsLmpzIGZvciBleGFtcGxlXG4gICAqXG4gICAqIE5PVEU6IE5lZWQgdG8gcmVmYWN0b3IgdGhpcyBpZiBpbSBnb2luZyB0byB1c2Ugd2VicGFjayBhcyBhIGJ1aWxkXG4gICAqIHNpbmNlIGl0IGRvZXNudCBsaWtlIGR5bmFtaWMgcmVxdWlyZS5cbiAgKi9cbiAgbG9hZCAodXJpLCBpZCkge1xuICAgIGlmICh0eXBlb2YgdXJpICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHRoaXMubG9hZE1vZHVsZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubG9hZFBhdGguYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICB9XG5cbiAgbG9hZE1vZHVsZSAocmVxdWlyZWQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmKHR5cGVvZiByZXF1aXJlZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB0aGlzLmxvYWRQYXRoLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICBsZXQgeyBpZCwgdXJpIH0gPSBvcHRpb25zXG5cbiAgICBpZCA9IGlkIHx8IHRoaXMuYnVpbGRJZCh1cmkpXG5cbiAgICBsZXQgb3duZXIgPSB0aGlzXG5cbiAgICBsZXQgaGVscGVySW5zdGFuY2VcbiAgICBsZXQgZW1wdHkgPSB0eXBlb2YocmVxdWlyZWQpID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhyZXF1aXJlZCkubGVuZ3RoID09PSAwXG4gICAgbGV0IGRlZmluaXRpb24gPSB0aGlzLmhlbHBlci5EZWZpbml0aW9uICYmIHRoaXMuaGVscGVyLkRlZmluaXRpb24uY3VycmVudCgpXG5cbiAgICBpZiAoZW1wdHkgJiYgZGVmaW5pdGlvbikge1xuICAgICAgaGVscGVySW5zdGFuY2UgPSBIZWxwZXJDbGFzcy5mcm9tRGVmaW5pdGlvbih1cmksIGRlZmluaXRpb24sIHtvd25lciwgaWQsIHJlcXVpcmVkfSlcbiAgICB9IGVsc2UgaWYgKGRlZmluaXRpb24pIHtcbiAgICAgIGhlbHBlckluc3RhbmNlID0gSGVscGVyQ2xhc3MuZnJvbURlZmluaXRpb24odXJpLCBkZWZpbml0aW9uLCB7b3duZXIsIGlkLCByZXF1aXJlZH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGhlbHBlckluc3RhbmNlID0gbmV3IEhlbHBlckNsYXNzKHVyaSwge293bmVyLCBpZCwgZGVmaW5pdGlvbiwgcmVxdWlyZWR9KVxuICAgIH1cblxuICAgIHRoaXMucmVnaXN0ZXIoaWQsIGhlbHBlckluc3RhbmNlKVxuXG4gICAgLy8gdG9kbzogc2hvdWxkIGp1c3QgYmUgYSBtZXRob2Qgb24gZGVmaW5pdGlvblxuICAgIGlmICh0aGlzLmhlbHBlci5EZWZpbml0aW9uICYmIHRoaXMuaGVscGVyLkRlZmluaXRpb24uY2xlYXJEZWZpbml0aW9uKSB7XG4gICAgICAgdGhpcy5oZWxwZXIuRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24oKVxuICAgIH1cblxuICAgIHJldHVybiBoZWxwZXJJbnN0YW5jZVxuICB9XG5cbiAgbG9hZFBhdGggKHVyaSwgaWQpIHtcbiAgICBjb25zdCBIZWxwZXJDbGFzcyA9IHRoaXMuaGVscGVyXG5cbiAgICBsZXQgb3duZXIgPSB0aGlzXG5cbiAgICBpZCA9IGlkIHx8IHRoaXMuYnVpbGRJZCh1cmkpXG5cbiAgICBsZXQgaGVscGVySW5zdGFuY2VcblxuICAgIHRyeSB7XG4gICAgICBsZXQgcmVxdWlyZWQgPSByZXF1aXJlKHVyaSlcbiAgICAgIGxldCBlbXB0eSA9IHR5cGVvZihyZXF1aXJlZCkgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKHJlcXVpcmVkKS5sZW5ndGggPT09IDBcbiAgICAgIGxldCBkZWZpbml0aW9uID0gdGhpcy5oZWxwZXIuRGVmaW5pdGlvbiAmJiB0aGlzLmhlbHBlci5EZWZpbml0aW9uLmN1cnJlbnQoKVxuXG4gICAgICBpZiAoZW1wdHkgJiYgZGVmaW5pdGlvbikge1xuICAgICAgICBoZWxwZXJJbnN0YW5jZSA9IEhlbHBlckNsYXNzLmZyb21EZWZpbml0aW9uKHVyaSwgZGVmaW5pdGlvbiwge293bmVyLCBpZCwgcmVxdWlyZWR9KVxuICAgICAgfSBlbHNlIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGhlbHBlckluc3RhbmNlID0gSGVscGVyQ2xhc3MuZnJvbURlZmluaXRpb24odXJpLCBkZWZpbml0aW9uLCB7b3duZXIsIGlkLCByZXF1aXJlZH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWxwZXJJbnN0YW5jZSA9IG5ldyBIZWxwZXJDbGFzcyh1cmksIHtvd25lciwgaWQsIGRlZmluaXRpb24sIHJlcXVpcmVkfSlcbiAgICAgIH1cblxuICAgICAgaWYgKCFoZWxwZXJJbnN0YW5jZSkge1xuICAgICAgICB0aHJvdyAoJ1VoIG9oJylcbiAgICAgIH1cblxuICAgICAgaWQgPSBpZC5yZXBsYWNlKC9cXC9pbmRleCQvaSwgJycpXG5cbiAgICAgIHRoaXMucmVnaXN0ZXIoaWQsIGhlbHBlckluc3RhbmNlKVxuXG4gICAgICAvLyB0b2RvOiBzaG91bGQganVzdCBiZSBhIG1ldGhvZCBvbiBkZWZpbml0aW9uXG4gICAgICBpZiAodGhpcy5oZWxwZXIuRGVmaW5pdGlvbiAmJiB0aGlzLmhlbHBlci5EZWZpbml0aW9uLmNsZWFyRGVmaW5pdGlvbikge1xuICAgICAgICAgdGhpcy5oZWxwZXIuRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24oKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVscGVySW5zdGFuY2VcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGxvYWRpbmc6ICcgKyB1cmksIGVycm9yLm1lc3NhZ2UpXG4gICAgICBjb25zb2xlLmxvZyhlcnJvci5zdGFjaylcbiAgICB9XG4gIH1cblxuXG4gIGZpbHRlciAoLi4uYXJncykge1xuICAgICByZXR1cm4gdGhpcy5hbGwuZmlsdGVyKC4uLmFyZ3MpXG4gIH1cblxuICBtYXAoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmFsbC5tYXAoLi4uYXJncylcbiAgfVxuXG4gIGZvckVhY2goLi4uYXJncyl7XG4gICAgcmV0dXJuIHRoaXMuYWxsLmZvckVhY2goLi4uYXJncylcbiAgfVxuXG4gIGFsbEhlbHBlcnMgKGluY2x1ZGVGYWxsYmFjayA9IHRydWUpIHtcbiAgICBsZXQgbWluZSA9IHV0aWwudmFsdWVzKHRoaXMucmVnaXN0cnkpXG5cbiAgICBpZiAodGhpcy5mYWxsYmFjayAmJiBpbmNsdWRlRmFsbGJhY2spIHtcbiAgICAgIHJldHVybiBtaW5lLmNvbmNhdCh0aGlzLmZhbGxiYWNrLmFsbClcbiAgICB9XG5cbiAgICByZXR1cm4gbWluZVxuICB9XG5cbiAgZ2V0IGFsbCAoKSB7XG4gICAgIHJldHVybiB0aGlzLmFsbEhlbHBlcnMoZmFsc2UpXG4gIH1cblxuICBnZXQgYXZhaWxhYmxlICgpIHtcbiAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMucmVnaXN0cnkpXG5cbiAgICBpZiAodGhpcy5mYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGtleXMuY29uY2F0KHRoaXMuZmFsbGJhY2suYXZhaWxhYmxlKVxuICAgIH1cblxuICAgIHJldHVybiBrZXlzXG4gIH1cbn1cblxuY29uc3QgX0NBQ0hFID0geyB9XG5cbmNsYXNzIEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvciAoY2FjaGUpIHtcbiAgICB0aGlzLmNhY2hlID0gY2FjaGUgfHwge31cbiAgfVxuXG4gIGJ1aWxkICguLi5hcmdzKSB7XG4gICAgcmV0dXJuIFJlZ2lzdHJ5LmJ1aWxkKC4uLmFyZ3MpXG4gIH1cblxuICBidWlsZEFsbCAoaG9zdCwgaGVscGVycywgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHJvb3QgPSBvcHRpb25zLnJvb3QgfHwgaG9zdC5yb290XG4gICAgbGV0IGMgPSB0aGlzLmNhY2hlW2hvc3Qucm9vdF0gPSB0aGlzLmNhY2hlW2hvc3Qucm9vdF0gfHwgeyB9XG5cbiAgICByb290LnNob3VsZC5ub3QuYmUuZW1wdHkoKVxuICAgIGMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgIGhlbHBlcnMuc2hvdWxkLm5vdC5iZS5lbXB0eSgpXG5cbiAgICBPYmplY3Qua2V5cyhoZWxwZXJzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgbGV0IG5hbWUgPSB1dGlsLnRhYmVsaXplKHR5cGUpXG4gICAgICBjW25hbWVdID0gY1tuYW1lXSB8fCBSZWdpc3RyeS5idWlsZChob3N0LCBoZWxwZXJzW3R5cGVdLCB7bmFtZSwgcm9vdDogaG9zdC5yb290fSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBCdWlsZGVyKF9DQUNIRSlcblxuZnVuY3Rpb24gYnVpbGRBdEludGVyZmFjZSAoaG9zdCkge1xuICBsZXQgY2hhaW4gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICByZXR1cm4gaG9zdC5sb29rdXAoaWQpXG4gIH1cblxuICBsZXQgZXhwYW5kID0gaG9zdC5sb2FkZWRcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaG9zdCwgJ2F0Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogY2hhaW5cbiAgfSlcblxuICBsZXQgaWRQYXRocyA9IGhvc3QuYXZhaWxhYmxlLmNvbmNhdChbXSlcblxuICBpZiAoZXhwYW5kKSB7XG4gICAgbGV0IGV4cGFuZGVkID0gaWRQYXRocy5tYXAoaWRQYXRoID0+IGlkUGF0aC5zcGxpdCgnLycpKS5zb3J0KChhLCBiKSA9PiBhLmxlbmd0aCA+IGIubGVuZ3RoKVxuXG4gICAgZXhwYW5kZWQuZm9yRWFjaChwYXJ0cyA9PiB7XG4gICAgICBsZXQgaWQgPSBwYXJ0cy5qb2luKCcvJylcbiAgICAgIGxldCBmaXJzdCA9IHBhcnRzWzBdXG5cbiAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdXRpbC5hc3NpZ24oY2hhaW4sIHtcbiAgICAgICAgICBnZXQgW2ZpcnN0XSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaG9zdC5sb29rdXAoaWQpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgICBsZXQgZ2V0dGVyID0gcGFydHMucG9wKClcbiAgICAgICAgbGV0IGlkUGF0aCA9IHBhcnRzLmpvaW4oJy4nKS5yZXBsYWNlKC8tL2csICdfJylcbiAgICAgICAgbGV0IHRhcmdldCA9IGNhcnZlLmdldChjaGFpbiwgaWRQYXRoKSB8fCB7IH1cblxuICAgICAgICB1dGlsLmFzc2lnbih0YXJnZXQsIHtcbiAgICAgICAgICBnZXQgW2dldHRlcl0gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGhvc3QubG9va3VwKGlkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgY2FydmUuc2V0KGNoYWluLCBpZFBhdGgsIHRhcmdldClcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG4iXX0=