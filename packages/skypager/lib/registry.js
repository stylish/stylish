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
      var HelperClass = this.helper;

      var helperInstance = undefined;
      var empty = (typeof required === 'undefined' ? 'undefined' : _typeof(required)) === 'object' && Object.keys(required).length === 0;
      var definition = this.helper.Definition && this.helper.Definition.current();

      if (definition) {
        helperInstance = HelperClass.fromDefinition(uri, definition, { owner: owner, id: id, required: required });
      } else {
        helperInstance = new HelperClass(uri, { owner: owner, id: id, required: required });
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
//# sourceMappingURL=data:application/json;base64,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QyxLQUFLLG9EQUNWLEtBQUssZ0JBQUwsS0FBSyxxQkFBTCxLQUFLLG9CQUFLO0FBQ2IsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtTQUN2Qix3RUFDRCxDQUFBO09BQ0g7O0FBRUQsVUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7OztBQUNwQixjQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDeEIsY0FBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQy9DLGNBQUksTUFBTSxHQUFHLHFCQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRyxDQUFBOztBQUU1QyxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sdURBQ1gsTUFBTSxpQkFBTixNQUFNLHNCQUFOLE1BQU0sb0JBQUs7QUFDZCxtQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1dBQ3ZCLDJFQUNELENBQUE7QUFDRiwrQkFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTs7T0FDakM7S0FDRixDQUFDLENBQUE7R0FDSDtDQUNGIiwiZmlsZSI6InJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNreXBhZ2VyIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcbmltcG9ydCBjYXJ2ZSBmcm9tICdvYmplY3QtcGF0aCdcblxuaW1wb3J0IHsgYmFzZW5hbWUsIGpvaW4sIHJlc29sdmUsIGRpcm5hbWUsIHJlbGF0aXZlIH0gZnJvbSAncGF0aCdcblxuXG5pbXBvcnQgX2RlYnVnIGZyb20gJ2RlYnVnJ1xuY29uc3QgZGVidWcgPSBfZGVidWcoJ3NreXBhZ2VyOnJlZ2lzdHJ5JylcblxuY29uc3QgRmFsbGJhY2tzID0ge31cblxuY2xhc3MgUmVnaXN0cnkge1xuICBzdGF0aWMgYnVpbGQgKGhvc3QsIGhlbHBlciwgb3B0aW9ucykge1xuICAgIHJldHVybiBuZXcgUmVnaXN0cnkoaG9zdCwgaGVscGVyLCBvcHRpb25zKVxuICB9XG5cbiAgY29uc3RydWN0b3IgKGhvc3QsIGhlbHBlciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKCFob3N0IHx8ICFoZWxwZXIpIHtcbiAgICAgIHRocm93ICgnTXVzdCBzdXBwbHkgYSByZWdpc3RyeSB3aXRoIGEgaG9zdCBhbmQgYSBoZWxwZXIgY2xhc3MnKVxuICAgIH1cblxuICAgIHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCB1dGlsLnRhYmVsaXplKGhlbHBlci5uYW1lIHx8ICcnKVxuICAgIHRoaXMucm9vdCA9IGpvaW4oKG9wdGlvbnMucm9vdCB8fCBob3N0LnJvb3QpLCB0aGlzLm5hbWUpXG5cbiAgICBsZXQgcmVnaXN0cnkgPSB7IH1cbiAgICBsZXQgYWxpYXNlcyA9IHsgfVxuXG4gICAgdXRpbC5oaWRlLmdldHRlcih0aGlzLCAnaG9zdCcsICgpID0+IGhvc3QpXG4gICAgdXRpbC5oaWRlLmdldHRlcih0aGlzLCAnYWxpYXNlcycsICgpID0+IGFsaWFzZXMpXG4gICAgdXRpbC5oaWRlLmdldHRlcih0aGlzLCAncmVnaXN0cnknLCAoKSA9PiByZWdpc3RyeSlcbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdoZWxwZXInLCAoKSA9PiBoZWxwZXIpXG5cbiAgICBpZiAoaG9zdC50eXBlID09PSAnZnJhbWV3b3JrJykge1xuICAgICAgRmFsbGJhY2tzW3RoaXMubmFtZV0gPSB0aGlzXG4gICAgfVxuXG4gICAgbGV0IGluZGV4U2NyaXB0XG5cbiAgICB0aGlzLmxvYWRlZCA9IGZhbHNlXG5cbiAgICB0cnkge1xuICAgICAgaW5kZXhTY3JpcHQgPSByZXF1aXJlLnJlc29sdmUoam9pbih0aGlzLnJvb3QsICdpbmRleC5qcycpKVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG5cbiAgICB9XG5cbiAgICBpZiAoaW5kZXhTY3JpcHQpIHtcbiAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZVxuICAgICAgdGhpcy5ydW5Mb2FkZXIocmVxdWlyZShpbmRleFNjcmlwdCkpXG4gICAgfVxuXG4gICAgYnVpbGRBdEludGVyZmFjZSh0aGlzKVxuXG4gICAgdGhpcy5sb2FkZWQgPSB0cnVlXG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgaGVscGVyIGZyb20gdGhpcyByZWdpc3RyeVxuICAgKlxuICAgKiBAcGFyYW0ge0hlbHBlci5pZH0gaGVscGVySWQgLSB0aGUgaWQgdGhlIGhlbHBlciB3YXMgcmVnaXN0ZXJlZCB3aXRoXG4gICovXG4gIHJlbW92ZSAoaGVscGVySWQpIHtcbiAgICBsZXQgaW5zdGFuY2UgPSB0aGlzLmxvb2t1cChoZWxwZXJJZCwgZmFsc2UpXG4gICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UubmFtZSkge1xuICAgICAgICBkZWxldGUgKHRoaXMuYWxpYXNlcywgaW5zdGFuY2UubmFtZSlcbiAgICAgIH1cblxuICAgICAgaWYgKGluc3RhbmNlLmFsaWFzZXMpIHtcbiAgICAgICAgaW5zdGFuY2UuYWxpYXNlcy5mb3JFYWNoKGEgPT4gZGVsZXRlICh0aGlzLmFsaWFzZXNbYV0pKVxuICAgICAgfVxuXG4gICAgICBkZWxldGUgKHRoaXMuYWxpYXNlc1tpbnN0YW5jZS5pZF0pXG4gICAgICBkZWxldGUgKHRoaXMucmVnaXN0cnlbaW5zdGFuY2UuaWRdKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBydW4gYSBoZWxwZXIncyBtYWluIGZ1bmN0aW9uLlxuICAgKlxuICAgKiB1c2luZyB0aGUgaGVscGVySWQgJ2xvYWRlcicgYW5kIHBhc3NpbmcgaXQgYSBmdW5jdGlvbiBpcyBhIGNvbnZlbmllbnQgd2F5XG4gICAqIG9mIHJ1bm5pbmcgYSBzcGVjaWFsIGxvYWRlciBmdW5jdGlvbi4gQHNlZSBydW5Mb2FkZXJcbiAgICpcbiAgICogQHBhcmFtIHtIZWxwZXIuaWR9IGhlbHBlcklkXG4gICAqIEBwYXJhbSB7V2hhdGV2ZXJ9IC4uLmFyZ3NcbiAgKi9cbiAgcnVuIChoZWxwZXJJZCwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgICBpZiAoIGhlbHBlcklkID09PSAnbG9hZGVyJyApIHtcbiAgICAgIHJldHVybiB0aGlzLnJ1bkxvYWRlcihvcHRpb25zLCBjb250ZXh0KVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhvc3QudHlwZSA9PT0gJ3Byb2plY3QnKSB7XG4gICAgICBjb250ZXh0LnByb2plY3QgPSBjb250ZXh0LnByb2plY3QgfHwgdGhpcy5ob3N0XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubG9va3VwKGhlbHBlcklkKS5ydW4ob3B0aW9ucywgY29udGV4dClcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgRmFsbGJhY2sgcmVnaXN0cnkgZm9yIG5vdyB3aWxsIGFsd2F5cyBiZSBTa3lwYWdlclxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAqL1xuICBnZXQgZmFsbGJhY2sgKCkge1xuICAgIGlmICh0aGlzLmhvc3QudHlwZSAhPT0gJ2ZyYW1ld29yaycpIHtcbiAgICAgIHJldHVybiBGYWxsYmFja3NbdGhpcy5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBRdWVyeSB0aGlzIGhlbHBlciByZWdpc3RyeSBhbmQgcmV0dXJuIG9ubHkgaGVscGVycyB3aGljaCBtYXRjaFxuICAgKlxuICAgKiBAZXhhbXBsZSByZXR1cm4gYWN0aW9ucyB0aGF0IGV4cG9zZSBhIENMSSBpbnRlcmZhY2VcbiAgICpcbiAgICogIHNreXBhZ2VyLmFjdGlvbnMucXVlcnkoKGhlbHBlcikgPT4ge1xuICAgKiAgICByZXR1cm4gKCdjbGknIGluIGhlbHBlci5kZWZpbml0aW9uLmludGVyZmFjZXMpXG4gICAqICB9KVxuICAqL1xuICBxdWVyeSAocGFyYW1zKSB7XG4gICAgcmV0dXJuIHV0aWwuZmlsdGVyUXVlcnkodGhpcy5hbGxIZWxwZXJzKHRydWUpLCBwYXJhbXMpXG4gIH1cblxuICAvKipcbiAgICogTG9va3VwIGEgaGVscGVyIGJ5IGlkXG4gICAqXG4gICAqIEBwYXJhbSB7SGVscGVyLmlkfSBuZWVkbGUgdGhlIGlkIG9mIHRoZSBoZWxwZXIgeW91IHdhbnRcbiAgICogQHBhcmFtIHtCb29sZWFufSBzdHJpY3QgdGhyb3cgYW4gZXJyb3Igd2hlbiBpdCBpcyBub3QgZm91bmRcbiAgICogQHBhcmFtIHtQcm9qZWN0fSBmcm9tUHJvamVjdCBvbmx5IHJldHVybiBoZWxwZXJzIHRoYXQgd2VyZSByZWdpc3RlcmVkIGJ5IGEgcGFydGljdWxhciBwcm9qZWN0XG4gICAqXG4gICAqL1xuICBsb29rdXAgKG5lZWRsZSwgc3RyaWN0ID0gdHJ1ZSwgZnJvbVByb2plY3QpIHtcbiAgICBsZXQgaGVscGVySWQgPSB0aGlzLmFsaWFzZXNbbmVlZGxlXVxuXG4gICAgaWYgKHR5cGVvZiAoaGVscGVySWQpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKHRoaXMuZmFsbGJhY2spIHsgcmV0dXJuIHRoaXMuZmFsbGJhY2subG9va3VwKG5lZWRsZSwgc3RyaWN0LCB0aGlzLmhvc3QpIH1cbiAgICAgIGlmIChzdHJpY3QpIHsgdGhyb3cgKCdDb3VsZCBub3QgZmluZCBoZWxwZXIgd2l0aCBpZDonICsgbmVlZGxlKSB9XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMucmVnaXN0cnlbaGVscGVySWRdXG5cbiAgICBpZiAocmVzdWx0ICYmIGZyb21Qcm9qZWN0KSB7IHJlc3VsdC5vcHRpb25zLnByb2plY3QgPSBmcm9tUHJvamVjdCB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBoZWxwZXIgaW5zdGFuY2VcbiAgICpcbiAgICogQHBhcmFtIHtIZWxwZXIuaWR9IGhlbHBlcklkIHRoZSBpZCB0byByZWZlcmVuY2UgdGhpcyBoZWxwZXIgYnlcbiAgICogQHBhcmFtIHtIZWxwZXJ9IGhlbHBlckluc3RhbmNlIGEgaGVscGVyIG9iamVjdCB0aGF0IHdyYXBzIHRoaXMgaGVscGVyIGZpbGUgd2l0aCBtZXRhZGF0YVxuICAqL1xuICByZWdpc3RlciAoaGVscGVySWQsIGhlbHBlckluc3RhbmNlKSB7XG4gICAgaWYgKCFoZWxwZXJJbnN0YW5jZSkge1xuICAgICAgdGhyb3cgKCdFcnJvciByZWdpc3RlcmluZyAnICsgaGVscGVySWQpXG4gICAgfVxuXG4gICAgdGhpcy5hbGlhc2VzW2hlbHBlcklkXSA9IGhlbHBlcklkXG5cbiAgICBpZiAoaGVscGVySW5zdGFuY2UubmFtZSkge1xuICAgICAgdGhpcy5hbGlhc2VzW2hlbHBlckluc3RhbmNlLm5hbWVdID0gaGVscGVySWRcbiAgICB9XG5cbiAgICB0aGlzLnJlZ2lzdHJ5W2hlbHBlcklkXSA9IGhlbHBlckluc3RhbmNlXG5cbiAgICBoZWxwZXJJbnN0YW5jZS5hbGlhc2VzICYmIGhlbHBlckluc3RhbmNlLmFsaWFzZXMuZm9yRWFjaChhbGlhcyA9PiB7XG4gICAgICB0aGlzLmFsaWFzZXNbYWxpYXNdID0gaGVscGVySWRcbiAgICB9KVxuXG4gICAgcmV0dXJuIGhlbHBlckluc3RhbmNlXG4gIH1cblxuICAvKipcbiAgICogYnVpbGQgYSBIZWxwZXIuaWQgZm9yIGEgZ2l2ZW4gaGVscGVyIHBhdGhcbiAgICpcbiAgICogQHBhcmFtIHtQYXRofSBoZWxwZXJVUkwgdGhlIGFic29sdXRlIHBhdGggdG8gdGhpcyBoZWxwZXJcbiAgICogQHBhcmFtIHtCb29sZWFufSBrZWVwRXh0ZW5zaW9uIC0ga2VlcCB0aGUgZmlsZSBleHRlbnNpb24gYXMgcGFydCBvZiB0aGUgSGVscGVyLmlkXG4gICovXG4gIGJ1aWxkSWQgKGhlbHBlclVSTCwga2VlcEV4dGVuc2lvbiA9IGZhbHNlKSB7XG4gICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5yb290ICsgJy8nLCAnaScpXG5cbiAgICBpZiAoIWhlbHBlclVSTC5tYXRjaChyZWcpKSB7XG4gICAgICBoZWxwZXJVUkwgPSBiYXNlbmFtZShoZWxwZXJVUkwpXG4gICAgfVxuXG4gICAgbGV0IGJhc2UgPSBoZWxwZXJVUkwucmVwbGFjZShyZWcsICcnKVxuXG4gICAgaWYgKGJhc2UubWF0Y2goL1xcL2luZGV4JC9pKSkge1xuICAgICAgYmFzZSA9IGJhc2UucmVwbGFjZSgvXFwvaW5kZXgkL2ksICcnKVxuICAgIH1cblxuICAgIHJldHVybiBrZWVwRXh0ZW5zaW9uID8gYmFzZSA6IGJhc2UucmVwbGFjZSgvXFwuXFx3KyQvaSwgJycpXG4gIH1cblxuICAvKipcbiAgICogUnVuIGEgaGVscGVyIGxvYWRlciBmdW5jdGlvbiBmb3IgdGhpcyByZWdpc3RyeS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gYSBmdW5jdGlvbiB3aGljaCBpcyBhYm91dCB0byBsb2FkIGhlbHBlcnMgZm9yIHVzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBsb2NhbHMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdmFyaWFibGVzIHRvIGluamVjdCBpbnRvIHNjb3BlXG4gICAqXG4gICAqIFRoaXMgd2lsbCBydW4gdGhlIHJlcXVpcmVkIGZ1bmN0aW9uIGluIGEgc3BlY2lhbCBjb250ZXh0XG4gICAqIHdoZXJlIGNlcnRhaW4gc3VnYXIgaXMgaW5qZWN0ZWQgaW50byB0aGUgZ2xvYmFsIHNjb3BlLlxuICAgKlxuICAgKiBUaGVzZSBsb2FkZXIgZnVuY3Rpb25zIGNhbiBleHBlY3QgdG8gaGF2ZSB0aGUgZm9sbG93aW5nIGluIHNjb3BlOlxuICAgKlxuICAgKiAtIHJlZ2lzdHJ5IC0gdGhpc1xuICAgKiAtIFtoZWxwZXJUeXBlXSAtIGEgdmFyaWFibGUgbmFtZWQgYWN0aW9uLCBtb2RlbCwgZXhwb3J0ZXIsIHBsdWdpbiwgb3Igd2hhdGV2ZXJcbiAgICogLSBsb2FkIC0gYSBmdW5jdGlvbiB0byBsb2FkIGluIGEgdXJpLiB0aGlzLmxvYWQuYmluZChyZWdpc3RyeSlcbiAgICpcbiAgKi9cbiAgcnVuTG9hZGVyIChmbiwgbG9jYWxzID0ge30pIHtcbiAgICBsZXQgcmVnaXN0cnkgPSB0aGlzXG4gICAgbGV0IGhvc3QgPSB0aGlzLmhvc3RcblxuICAgIGxvY2FscyA9IE9iamVjdC5hc3NpZ24obG9jYWxzLCAodGhpcy5oZWxwZXIuRFNMID8gdGhpcy5oZWxwZXIuRFNMIDoge30pKVxuICAgIGxvY2Fscy5sb2FkID0gcmVnaXN0cnkubG9hZC5iaW5kKHJlZ2lzdHJ5KVxuXG4gICAgdXRpbC5ub0NvbmZsaWN0KGZ1bmN0aW9uKCkge1xuICAgICAgZm4uY2FsbChob3N0LCByZWdpc3RyeSwgaG9zdC50eXBlKVxuICAgIH0sIGxvY2FscykoKVxuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYSBoZWxwZXIgYnkgaXRzIFVSSSBvciBQYXRoLlxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICogVGhpcyB3aWxsIHJlcXVpcmUgdGhlIGhlbHBlciBpbiBhIHNwZWNpYWwgY29udGV4dCB3aGVyZSBjZXJ0YWluXG4gICAqIG9iamVjdHMgYW5kIGZ1bmN0aW9ucyBhcmUgaW5qZWN0ZWQgaW4gdGhlIGdsb2JhbCBzY29wZS4gVGhpcyBtYWtlcyBpdCBlYXNpZXIgdG9cbiAgICogd3JpdGUgaGVscGVycyBieSBwcm92aWRpbmcgdGhlbSB3aXRoIGEgc3BlY2lmaWMgRFNMIGJhc2VkIG9uIHRoZSBoZWxwZXIgdHlwZS5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVyaSB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgaGVscGVyXG4gICAqIEBwYXJhbSB7SGVscGVyLmlkfSBpZCB3aGF0IGlkIHRvIHJlZ2lzdGVyIHRoaXMgaGVscGVyIHVuZGVyP1xuICAgKlxuICAgKiBAc2VlIGhlbHBlcnMvZGVmaW5pdGlvbnMvbW9kZWwuanMgZm9yIGV4YW1wbGVcbiAgICpcbiAgICogTk9URTogTmVlZCB0byByZWZhY3RvciB0aGlzIGlmIGltIGdvaW5nIHRvIHVzZSB3ZWJwYWNrIGFzIGEgYnVpbGRcbiAgICogc2luY2UgaXQgZG9lc250IGxpa2UgZHluYW1pYyByZXF1aXJlLlxuICAqL1xuICBsb2FkICh1cmksIGlkKSB7XG4gICAgaWYgKHR5cGVvZiB1cmkgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gdGhpcy5sb2FkTW9kdWxlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5sb2FkUGF0aC5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG4gIH1cblxuICBsb2FkTW9kdWxlIChyZXF1aXJlZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYodHlwZW9mIHJlcXVpcmVkID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIHRoaXMubG9hZFBhdGguYXBwbHkodGhpcywgYXJndW1lbnRzKVxuICAgIH1cblxuICAgIGxldCB7IGlkLCB1cmkgfSA9IG9wdGlvbnNcblxuICAgIGlkID0gaWQgfHwgdGhpcy5idWlsZElkKHVyaSlcblxuICAgIGxldCBvd25lciA9IHRoaXNcbiAgICBsZXQgSGVscGVyQ2xhc3MgPSB0aGlzLmhlbHBlclxuXG4gICAgbGV0IGhlbHBlckluc3RhbmNlXG4gICAgbGV0IGVtcHR5ID0gdHlwZW9mKHJlcXVpcmVkKSA9PT0gJ29iamVjdCcgJiYgT2JqZWN0LmtleXMocmVxdWlyZWQpLmxlbmd0aCA9PT0gMFxuICAgIGxldCBkZWZpbml0aW9uID0gdGhpcy5oZWxwZXIuRGVmaW5pdGlvbiAmJiB0aGlzLmhlbHBlci5EZWZpbml0aW9uLmN1cnJlbnQoKVxuXG4gICAgaWYgKGRlZmluaXRpb24pIHtcbiAgICAgIGhlbHBlckluc3RhbmNlID0gSGVscGVyQ2xhc3MuZnJvbURlZmluaXRpb24odXJpLCBkZWZpbml0aW9uLCB7b3duZXIsIGlkLCByZXF1aXJlZH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGhlbHBlckluc3RhbmNlID0gbmV3IEhlbHBlckNsYXNzKHVyaSwge293bmVyLCBpZCwgcmVxdWlyZWR9KVxuICAgIH1cblxuICAgIHRoaXMucmVnaXN0ZXIoaWQsIGhlbHBlckluc3RhbmNlKVxuXG4gICAgLy8gdG9kbzogc2hvdWxkIGp1c3QgYmUgYSBtZXRob2Qgb24gZGVmaW5pdGlvblxuICAgIGlmICh0aGlzLmhlbHBlci5EZWZpbml0aW9uICYmIHRoaXMuaGVscGVyLkRlZmluaXRpb24uY2xlYXJEZWZpbml0aW9uKSB7XG4gICAgICAgdGhpcy5oZWxwZXIuRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24oKVxuICAgIH1cblxuICAgIHJldHVybiBoZWxwZXJJbnN0YW5jZVxuICB9XG5cbiAgbG9hZFBhdGggKHVyaSwgaWQpIHtcbiAgICBjb25zdCBIZWxwZXJDbGFzcyA9IHRoaXMuaGVscGVyXG5cbiAgICBsZXQgb3duZXIgPSB0aGlzXG5cbiAgICBpZCA9IGlkIHx8IHRoaXMuYnVpbGRJZCh1cmkpXG5cbiAgICBsZXQgaGVscGVySW5zdGFuY2VcblxuICAgIHRyeSB7XG4gICAgICBsZXQgcmVxdWlyZWQgPSByZXF1aXJlKHVyaSlcbiAgICAgIGxldCBlbXB0eSA9IHR5cGVvZihyZXF1aXJlZCkgPT09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKHJlcXVpcmVkKS5sZW5ndGggPT09IDBcbiAgICAgIGxldCBkZWZpbml0aW9uID0gdGhpcy5oZWxwZXIuRGVmaW5pdGlvbiAmJiB0aGlzLmhlbHBlci5EZWZpbml0aW9uLmN1cnJlbnQoKVxuXG4gICAgICBpZiAoZW1wdHkgJiYgZGVmaW5pdGlvbikge1xuICAgICAgICBoZWxwZXJJbnN0YW5jZSA9IEhlbHBlckNsYXNzLmZyb21EZWZpbml0aW9uKHVyaSwgZGVmaW5pdGlvbiwge293bmVyLCBpZCwgcmVxdWlyZWR9KVxuICAgICAgfSBlbHNlIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGhlbHBlckluc3RhbmNlID0gSGVscGVyQ2xhc3MuZnJvbURlZmluaXRpb24odXJpLCBkZWZpbml0aW9uLCB7b3duZXIsIGlkLCByZXF1aXJlZH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWxwZXJJbnN0YW5jZSA9IG5ldyBIZWxwZXJDbGFzcyh1cmksIHtvd25lciwgaWQsIGRlZmluaXRpb24sIHJlcXVpcmVkfSlcbiAgICAgIH1cblxuICAgICAgaWYgKCFoZWxwZXJJbnN0YW5jZSkge1xuICAgICAgICB0aHJvdyAoJ1VoIG9oJylcbiAgICAgIH1cblxuICAgICAgaWQgPSBpZC5yZXBsYWNlKC9cXC9pbmRleCQvaSwgJycpXG5cbiAgICAgIHRoaXMucmVnaXN0ZXIoaWQsIGhlbHBlckluc3RhbmNlKVxuXG4gICAgICAvLyB0b2RvOiBzaG91bGQganVzdCBiZSBhIG1ldGhvZCBvbiBkZWZpbml0aW9uXG4gICAgICBpZiAodGhpcy5oZWxwZXIuRGVmaW5pdGlvbiAmJiB0aGlzLmhlbHBlci5EZWZpbml0aW9uLmNsZWFyRGVmaW5pdGlvbikge1xuICAgICAgICAgdGhpcy5oZWxwZXIuRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24oKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVscGVySW5zdGFuY2VcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGxvYWRpbmc6ICcgKyB1cmksIGVycm9yLm1lc3NhZ2UpXG4gICAgICBjb25zb2xlLmxvZyhlcnJvci5zdGFjaylcbiAgICB9XG4gIH1cblxuICBmaWx0ZXIgKC4uLmFyZ3MpIHtcbiAgICAgcmV0dXJuIHRoaXMuYWxsLmZpbHRlciguLi5hcmdzKVxuICB9XG5cbiAgbWFwKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5hbGwubWFwKC4uLmFyZ3MpXG4gIH1cblxuICBmb3JFYWNoKC4uLmFyZ3Mpe1xuICAgIHJldHVybiB0aGlzLmFsbC5mb3JFYWNoKC4uLmFyZ3MpXG4gIH1cblxuICBhbGxIZWxwZXJzIChpbmNsdWRlRmFsbGJhY2sgPSB0cnVlKSB7XG4gICAgbGV0IG1pbmUgPSB1dGlsLnZhbHVlcyh0aGlzLnJlZ2lzdHJ5KVxuXG4gICAgaWYgKHRoaXMuZmFsbGJhY2sgJiYgaW5jbHVkZUZhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gbWluZS5jb25jYXQodGhpcy5mYWxsYmFjay5hbGwpXG4gICAgfVxuXG4gICAgcmV0dXJuIG1pbmVcbiAgfVxuXG4gIGdldCBhbGwgKCkge1xuICAgICByZXR1cm4gdGhpcy5hbGxIZWxwZXJzKGZhbHNlKVxuICB9XG5cbiAgZ2V0IGF2YWlsYWJsZSAoKSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLnJlZ2lzdHJ5KVxuXG4gICAgaWYgKHRoaXMuZmFsbGJhY2spIHtcbiAgICAgIHJldHVybiBrZXlzLmNvbmNhdCh0aGlzLmZhbGxiYWNrLmF2YWlsYWJsZSlcbiAgICB9XG5cbiAgICByZXR1cm4ga2V5c1xuICB9XG59XG5cbmNvbnN0IF9DQUNIRSA9IHsgfVxuXG5jbGFzcyBCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IgKGNhY2hlKSB7XG4gICAgdGhpcy5jYWNoZSA9IGNhY2hlIHx8IHt9XG4gIH1cblxuICBidWlsZCAoLi4uYXJncykge1xuICAgIHJldHVybiBSZWdpc3RyeS5idWlsZCguLi5hcmdzKVxuICB9XG5cbiAgYnVpbGRBbGwgKGhvc3QsIGhlbHBlcnMsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCByb290ID0gb3B0aW9ucy5yb290IHx8IGhvc3Qucm9vdFxuICAgIGxldCBjID0gdGhpcy5jYWNoZVtob3N0LnJvb3RdID0gdGhpcy5jYWNoZVtob3N0LnJvb3RdIHx8IHsgfVxuXG4gICAgcm9vdC5zaG91bGQubm90LmJlLmVtcHR5KClcbiAgICBjLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICBoZWxwZXJzLnNob3VsZC5ub3QuYmUuZW1wdHkoKVxuXG4gICAgT2JqZWN0LmtleXMoaGVscGVycykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgIGxldCBuYW1lID0gdXRpbC50YWJlbGl6ZSh0eXBlKVxuICAgICAgY1tuYW1lXSA9IGNbbmFtZV0gfHwgUmVnaXN0cnkuYnVpbGQoaG9zdCwgaGVscGVyc1t0eXBlXSwge25hbWUsIHJvb3Q6IGhvc3Qucm9vdH0pXG4gICAgfSlcblxuICAgIHJldHVybiBjXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQnVpbGRlcihfQ0FDSEUpXG5cbmZ1bmN0aW9uIGJ1aWxkQXRJbnRlcmZhY2UgKGhvc3QpIHtcbiAgbGV0IGNoYWluID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIGhvc3QubG9va3VwKGlkKVxuICB9XG5cbiAgbGV0IGV4cGFuZCA9IGhvc3QubG9hZGVkXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGhvc3QsICdhdCcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IGNoYWluXG4gIH0pXG5cbiAgbGV0IGlkUGF0aHMgPSBob3N0LmF2YWlsYWJsZS5jb25jYXQoW10pXG5cbiAgaWYgKGV4cGFuZCkge1xuICAgIGxldCBleHBhbmRlZCA9IGlkUGF0aHMubWFwKGlkUGF0aCA9PiBpZFBhdGguc3BsaXQoJy8nKSkuc29ydCgoYSwgYikgPT4gYS5sZW5ndGggPiBiLmxlbmd0aClcblxuICAgIGV4cGFuZGVkLmZvckVhY2gocGFydHMgPT4ge1xuICAgICAgbGV0IGlkID0gcGFydHMuam9pbignLycpXG4gICAgICBsZXQgZmlyc3QgPSBwYXJ0c1swXVxuXG4gICAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHV0aWwuYXNzaWduKGNoYWluLCB7XG4gICAgICAgICAgZ2V0IFtmaXJzdF0gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGhvc3QubG9va3VwKGlkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbGV0IGdldHRlciA9IHBhcnRzLnBvcCgpXG4gICAgICAgIGxldCBpZFBhdGggPSBwYXJ0cy5qb2luKCcuJykucmVwbGFjZSgvLS9nLCAnXycpXG4gICAgICAgIGxldCB0YXJnZXQgPSBjYXJ2ZS5nZXQoY2hhaW4sIGlkUGF0aCkgfHwgeyB9XG5cbiAgICAgICAgdXRpbC5hc3NpZ24odGFyZ2V0LCB7XG4gICAgICAgICAgZ2V0IFtnZXR0ZXJdICgpIHtcbiAgICAgICAgICAgIHJldHVybiBob3N0Lmxvb2t1cChpZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGNhcnZlLnNldChjaGFpbiwgaWRQYXRoLCB0YXJnZXQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19