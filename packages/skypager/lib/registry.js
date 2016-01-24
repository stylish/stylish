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
     * run a helper's main function
     *
     * @param {Helper.id} helperId
     * @param {Whatever} ...args
    */

  }, {
    key: 'run',
    value: function run(helperId) {
      var fn = this.lookup(helperId).runner;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return fn.apply(undefined, args);
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

      locals = Object.assign(locals, this.helper.DSL ? this.helper.DSL : {});

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

    /**
     * Load a helper by its URI or Path.
     *
     * @description
     *
     * This will require the helper in a special context where certain
     * objects are injected in the global scope. This makes it easier to
     * write helpers by providing them with a specific DSL based on the
     * helper type.
     *
     * @param {URI} uri an absolute path to the helper js file
     * @param {Helper.id} id what id to register this helper under?
     *
     * @see helpers/definitions/model.js for example
     */

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
//# sourceMappingURL=data:application/json;base64,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QUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRyxDQUFBOztBQUU1QyxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sdURBQ1gsTUFBTSxpQkFBTixNQUFNLHNCQUFOLE1BQU0sb0JBQUs7QUFDZCxtQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1dBQ3ZCLDJFQUNELENBQUE7QUFDRiwrQkFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTs7T0FDakM7S0FDRixDQUFDLENBQUE7R0FDSDtDQUNGIiwiZmlsZSI6InJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIFJlZmFjdG9yaW5nIG5vdGVzOlxuKlxuKiBDdXJyZW50bHkgdGhlcmUgaXMgYSByZWdpc3RyeSBmb3IgdGhlIHNreXBhZ2VyIGZyYW1ld29yayBhbmQgdGhlbiBwZXIgcHJvamVjdCBycmVnaXN0cmllc1xuKlxuKiBJIHNob3VsZCBtYWtlIG9uZSByZWdpc3RyeSBmb3IgdGhlIGZyYW1ld29yaywgYW5kIHRoZW4gaGVscGVycyByZWdpc3RlciB0aGVtc2VsdmVzIHdpdGggdGhlIHByb2plY3QgdGhleSBiZWxvbmcgdG9cbiogYW5kIGJ5IGRlZmF1bHQgb25seSBnZXQgZnJhbWV3b3JrIGhlbHBlcnMgYW5kIHByb2plY3QgaGVscGVycyBhdmFpbGFibGUgdG8gdGhlbS5cbipcbiovXG5pbXBvcnQgU2t5cGFnZXIgZnJvbSAnLi9pbmRleCdcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsJ1xuaW1wb3J0IGNhcnZlIGZyb20gJ29iamVjdC1wYXRoJ1xuXG5pbXBvcnQgeyBiYXNlbmFtZSwgam9pbiwgcmVzb2x2ZSwgZGlybmFtZSwgcmVsYXRpdmUgfSBmcm9tICdwYXRoJ1xuXG5cbmltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1Zygnc2t5cGFnZXI6cmVnaXN0cnknKVxuXG5jb25zdCBGYWxsYmFja3MgPSB7fVxuXG5jbGFzcyBSZWdpc3RyeSB7XG4gIHN0YXRpYyBidWlsZCAoaG9zdCwgaGVscGVyLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdpc3RyeShob3N0LCBoZWxwZXIsIG9wdGlvbnMpXG4gIH1cblxuICBjb25zdHJ1Y3RvciAoaG9zdCwgaGVscGVyLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAoIWhvc3QgfHwgIWhlbHBlcikge1xuICAgICAgdGhyb3cgKCdNdXN0IHN1cHBseSBhIHJlZ2lzdHJ5IHdpdGggYSBob3N0IGFuZCBhIGhlbHBlciBjbGFzcycpXG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IHV0aWwudGFiZWxpemUoaGVscGVyLm5hbWUgfHwgJycpXG4gICAgdGhpcy5yb290ID0gam9pbigob3B0aW9ucy5yb290IHx8IGhvc3Qucm9vdCksIHRoaXMubmFtZSlcblxuICAgIGxldCByZWdpc3RyeSA9IHsgfVxuICAgIGxldCBhbGlhc2VzID0geyB9XG5cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdob3N0JywgKCkgPT4gaG9zdClcbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdhbGlhc2VzJywgKCkgPT4gYWxpYXNlcylcbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdyZWdpc3RyeScsICgpID0+IHJlZ2lzdHJ5KVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2hlbHBlcicsICgpID0+IGhlbHBlcilcblxuICAgIGlmIChob3N0LnR5cGUgPT09ICdmcmFtZXdvcmsnKSB7XG4gICAgICBGYWxsYmFja3NbdGhpcy5uYW1lXSA9IHRoaXNcbiAgICB9XG5cbiAgICBsZXQgaW5kZXhTY3JpcHRcblxuICAgIHRoaXMubG9hZGVkID0gZmFsc2VcblxuICAgIHRyeSB7XG4gICAgICBpbmRleFNjcmlwdCA9IHJlcXVpcmUucmVzb2x2ZShqb2luKHRoaXMucm9vdCwgJ2luZGV4LmpzJykpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgIH1cblxuICAgIGlmIChpbmRleFNjcmlwdCkge1xuICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlXG4gICAgICB0aGlzLnJ1bkxvYWRlcihyZXF1aXJlKGluZGV4U2NyaXB0KSlcbiAgICB9XG5cbiAgICBidWlsZEF0SW50ZXJmYWNlKHRoaXMpXG5cbiAgICB0aGlzLmxvYWRlZCA9IHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBoZWxwZXIgZnJvbSB0aGlzIHJlZ2lzdHJ5XG4gICAqXG4gICAqIEBwYXJhbSB7SGVscGVyLmlkfSBoZWxwZXJJZCAtIHRoZSBpZCB0aGUgaGVscGVyIHdhcyByZWdpc3RlcmVkIHdpdGhcbiAgKi9cbiAgcmVtb3ZlIChoZWxwZXJJZCkge1xuICAgIGxldCBpbnN0YW5jZSA9IHRoaXMubG9va3VwKGhlbHBlcklkLCBmYWxzZSlcbiAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgIGlmIChpbnN0YW5jZS5uYW1lKSB7XG4gICAgICAgIGRlbGV0ZSAodGhpcy5hbGlhc2VzLCBpbnN0YW5jZS5uYW1lKVxuICAgICAgfVxuXG4gICAgICBpZiAoaW5zdGFuY2UuYWxpYXNlcykge1xuICAgICAgICBpbnN0YW5jZS5hbGlhc2VzLmZvckVhY2goYSA9PiBkZWxldGUgKHRoaXMuYWxpYXNlc1thXSkpXG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSAodGhpcy5hbGlhc2VzW2luc3RhbmNlLmlkXSlcbiAgICAgIGRlbGV0ZSAodGhpcy5yZWdpc3RyeVtpbnN0YW5jZS5pZF0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHJ1biBhIGhlbHBlcidzIG1haW4gZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtIZWxwZXIuaWR9IGhlbHBlcklkXG4gICAqIEBwYXJhbSB7V2hhdGV2ZXJ9IC4uLmFyZ3NcbiAgKi9cbiAgcnVuIChoZWxwZXJJZCwgLi4uYXJncykge1xuICAgIGxldCBmbiA9IHRoaXMubG9va3VwKGhlbHBlcklkKS5ydW5uZXJcbiAgICByZXR1cm4gZm4oLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgRmFsbGJhY2sgcmVnaXN0cnkgZm9yIG5vdyB3aWxsIGFsd2F5cyBiZSBTa3lwYWdlclxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAqL1xuICBnZXQgZmFsbGJhY2sgKCkge1xuICAgIGlmICh0aGlzLmhvc3QudHlwZSAhPT0gJ2ZyYW1ld29yaycpIHtcbiAgICAgIHJldHVybiBGYWxsYmFja3NbdGhpcy5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBRdWVyeSB0aGlzIGhlbHBlciByZWdpc3RyeSBhbmQgcmV0dXJuIG9ubHkgaGVscGVycyB3aGljaCBtYXRjaFxuICAgKlxuICAgKiBAZXhhbXBsZSByZXR1cm4gYWN0aW9ucyB0aGF0IGV4cG9zZSBhIENMSSBpbnRlcmZhY2VcbiAgICpcbiAgICogIHNreXBhZ2VyLmFjdGlvbnMucXVlcnkoKGhlbHBlcikgPT4ge1xuICAgKiAgICByZXR1cm4gKCdjbGknIGluIGhlbHBlci5kZWZpbml0aW9uLmludGVyZmFjZXMpXG4gICAqICB9KVxuICAqL1xuICBxdWVyeSAocGFyYW1zKSB7XG4gICAgcmV0dXJuIHV0aWwuZmlsdGVyUXVlcnkodGhpcy5hbGxIZWxwZXJzKHRydWUpLCBwYXJhbXMpXG4gIH1cblxuICAvKipcbiAgICogTG9va3VwIGEgaGVscGVyIGJ5IGlkXG4gICAqXG4gICAqIEBwYXJhbSB7SGVscGVyLmlkfSBuZWVkbGUgdGhlIGlkIG9mIHRoZSBoZWxwZXIgeW91IHdhbnRcbiAgICogQHBhcmFtIHtCb29sZWFufSBzdHJpY3QgdGhyb3cgYW4gZXJyb3Igd2hlbiBpdCBpcyBub3QgZm91bmRcbiAgICogQHBhcmFtIHtQcm9qZWN0fSBmcm9tUHJvamVjdCBvbmx5IHJldHVybiBoZWxwZXJzIHRoYXQgd2VyZSByZWdpc3RlcmVkIGJ5IGEgcGFydGljdWxhciBwcm9qZWN0XG4gICAqXG4gICAqL1xuICBsb29rdXAgKG5lZWRsZSwgc3RyaWN0ID0gdHJ1ZSwgZnJvbVByb2plY3QpIHtcbiAgICBsZXQgaGVscGVySWQgPSB0aGlzLmFsaWFzZXNbbmVlZGxlXVxuXG4gICAgaWYgKHR5cGVvZiAoaGVscGVySWQpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgaWYgKHRoaXMuZmFsbGJhY2spIHsgcmV0dXJuIHRoaXMuZmFsbGJhY2subG9va3VwKG5lZWRsZSwgc3RyaWN0LCB0aGlzLmhvc3QpIH1cbiAgICAgIGlmIChzdHJpY3QpIHsgdGhyb3cgKCdDb3VsZCBub3QgZmluZCBoZWxwZXIgd2l0aCBpZDonICsgbmVlZGxlKSB9XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMucmVnaXN0cnlbaGVscGVySWRdXG5cbiAgICBpZiAocmVzdWx0ICYmIGZyb21Qcm9qZWN0KSB7IHJlc3VsdC5vcHRpb25zLnByb2plY3QgPSBmcm9tUHJvamVjdCB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBoZWxwZXIgaW5zdGFuY2VcbiAgICpcbiAgICogQHBhcmFtIHtIZWxwZXIuaWR9IGhlbHBlcklkIHRoZSBpZCB0byByZWZlcmVuY2UgdGhpcyBoZWxwZXIgYnlcbiAgICogQHBhcmFtIHtIZWxwZXJ9IGhlbHBlckluc3RhbmNlIGEgaGVscGVyIG9iamVjdCB0aGF0IHdyYXBzIHRoaXMgaGVscGVyIGZpbGUgd2l0aCBtZXRhZGF0YVxuICAqL1xuICByZWdpc3RlciAoaGVscGVySWQsIGhlbHBlckluc3RhbmNlKSB7XG4gICAgaWYgKCFoZWxwZXJJbnN0YW5jZSkge1xuICAgICAgdGhyb3cgKCdFcnJvciByZWdpc3RlcmluZyAnICsgaGVscGVySWQpXG4gICAgfVxuXG4gICAgdGhpcy5hbGlhc2VzW2hlbHBlcklkXSA9IGhlbHBlcklkXG5cbiAgICBpZiAoaGVscGVySW5zdGFuY2UubmFtZSkge1xuICAgICAgdGhpcy5hbGlhc2VzW2hlbHBlckluc3RhbmNlLm5hbWVdID0gaGVscGVySWRcbiAgICB9XG5cbiAgICB0aGlzLnJlZ2lzdHJ5W2hlbHBlcklkXSA9IGhlbHBlckluc3RhbmNlXG5cbiAgICBoZWxwZXJJbnN0YW5jZS5hbGlhc2VzICYmIGhlbHBlckluc3RhbmNlLmFsaWFzZXMuZm9yRWFjaChhbGlhcyA9PiB7XG4gICAgICB0aGlzLmFsaWFzZXNbYWxpYXNdID0gaGVscGVySWRcbiAgICB9KVxuXG4gICAgcmV0dXJuIGhlbHBlckluc3RhbmNlXG4gIH1cblxuICAvKipcbiAgICogYnVpbGQgYSBIZWxwZXIuaWQgZm9yIGEgZ2l2ZW4gaGVscGVyIHBhdGhcbiAgICpcbiAgICogQHBhcmFtIHtQYXRofSBoZWxwZXJVUkwgdGhlIGFic29sdXRlIHBhdGggdG8gdGhpcyBoZWxwZXJcbiAgICogQHBhcmFtIHtCb29sZWFufSBrZWVwRXh0ZW5zaW9uIC0ga2VlcCB0aGUgZmlsZSBleHRlbnNpb24gYXMgcGFydCBvZiB0aGUgSGVscGVyLmlkXG4gICovXG4gIGJ1aWxkSWQgKGhlbHBlclVSTCwga2VlcEV4dGVuc2lvbiA9IGZhbHNlKSB7XG4gICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5yb290ICsgJy8nLCAnaScpXG5cbiAgICBpZiAoIWhlbHBlclVSTC5tYXRjaChyZWcpKSB7XG4gICAgICBoZWxwZXJVUkwgPSBiYXNlbmFtZShoZWxwZXJVUkwpXG4gICAgfVxuXG4gICAgbGV0IGJhc2UgPSBoZWxwZXJVUkwucmVwbGFjZShyZWcsICcnKVxuXG4gICAgaWYgKGJhc2UubWF0Y2goL1xcL2luZGV4JC9pKSkge1xuICAgICAgYmFzZSA9IGJhc2UucmVwbGFjZSgvXFwvaW5kZXgkL2ksICcnKVxuICAgIH1cblxuICAgIHJldHVybiBrZWVwRXh0ZW5zaW9uID8gYmFzZSA6IGJhc2UucmVwbGFjZSgvXFwuXFx3KyQvaSwgJycpXG4gIH1cblxuICAvKipcbiAgICogUnVuIGEgaGVscGVyIGxvYWRlciBmdW5jdGlvbiBmb3IgdGhpcyByZWdpc3RyeS5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gYSBmdW5jdGlvbiB3aGljaCBpcyBhYm91dCB0byBsb2FkIGhlbHBlcnMgZm9yIHVzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBsb2NhbHMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdmFyaWFibGVzIHRvIGluamVjdCBpbnRvIHNjb3BlXG4gICAqXG4gICAqIFRoaXMgd2lsbCBydW4gdGhlIHJlcXVpcmVkIGZ1bmN0aW9uIGluIGEgc3BlY2lhbCBjb250ZXh0XG4gICAqIHdoZXJlIGNlcnRhaW4gc3VnYXIgaXMgaW5qZWN0ZWQgaW50byB0aGUgZ2xvYmFsIHNjb3BlLlxuICAgKlxuICAgKiBUaGVzZSBsb2FkZXIgZnVuY3Rpb25zIGNhbiBleHBlY3QgdG8gaGF2ZSB0aGUgZm9sbG93aW5nIGluIHNjb3BlOlxuICAgKlxuICAgKiAtIHJlZ2lzdHJ5IC0gdGhpc1xuICAgKiAtIFtoZWxwZXJUeXBlXSAtIGEgdmFyaWFibGUgbmFtZWQgYWN0aW9uLCBtb2RlbCwgZXhwb3J0ZXIsIHBsdWdpbiwgb3Igd2hhdGV2ZXJcbiAgICogLSBsb2FkIC0gYSBmdW5jdGlvbiB0byBsb2FkIGluIGEgdXJpLiB0aGlzLmxvYWQuYmluZChyZWdpc3RyeSlcbiAgICpcbiAgKi9cbiAgcnVuTG9hZGVyIChmbiwgbG9jYWxzID0ge30pIHtcbiAgICBsb2NhbHMgPSBPYmplY3QuYXNzaWduKGxvY2FscywgKHRoaXMuaGVscGVyLkRTTCA/IHRoaXMuaGVscGVyLkRTTCA6IHt9KSlcblxuICAgIGxvY2Fscy51dGlsID0gdXRpbFxuXG4gICAgaWYgKHRoaXMuaG9zdCAmJiB0aGlzLmhvc3QudHlwZSAmJiAhbG9jYWxzW3RoaXMuaG9zdC50eXBlXSkge1xuICAgICAgbG9jYWxzW3RoaXMuaG9zdC50eXBlXSA9IHRoaXMuaG9zdFxuICAgIH1cblxuICAgIGlmICh0aGlzLmhlbHBlciAmJiB0aGlzLmhlbHBlci5uYW1lKSB7XG4gICAgICBsb2NhbHNbdGhpcy5oZWxwZXIubmFtZV0gPSB0aGlzLmhlbHBlclxuICAgIH1cblxuICAgIGxvY2Fscy5yZWdpc3RyeSA9IHRoaXNcbiAgICBsb2NhbHMubG9hZCA9IHRoaXMubG9hZC5iaW5kKHRoaXMpXG5cbiAgICB1dGlsLm5vQ29uZmxpY3QoZm4sIGxvY2FscykoKVxuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgYSBoZWxwZXIgYnkgaXRzIFVSSSBvciBQYXRoLlxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICogVGhpcyB3aWxsIHJlcXVpcmUgdGhlIGhlbHBlciBpbiBhIHNwZWNpYWwgY29udGV4dCB3aGVyZSBjZXJ0YWluXG4gICAqIG9iamVjdHMgYXJlIGluamVjdGVkIGluIHRoZSBnbG9iYWwgc2NvcGUuIFRoaXMgbWFrZXMgaXQgZWFzaWVyIHRvXG4gICAqIHdyaXRlIGhlbHBlcnMgYnkgcHJvdmlkaW5nIHRoZW0gd2l0aCBhIHNwZWNpZmljIERTTCBiYXNlZCBvbiB0aGVcbiAgICogaGVscGVyIHR5cGUuXG4gICAqXG4gICAqIEBwYXJhbSB7VVJJfSB1cmkgYW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgaGVscGVyIGpzIGZpbGVcbiAgICogQHBhcmFtIHtIZWxwZXIuaWR9IGlkIHdoYXQgaWQgdG8gcmVnaXN0ZXIgdGhpcyBoZWxwZXIgdW5kZXI/XG4gICAqXG4gICAqIEBzZWUgaGVscGVycy9kZWZpbml0aW9ucy9tb2RlbC5qcyBmb3IgZXhhbXBsZVxuICAgKi9cbiAgbG9hZCAodXJpLCBpZCkge1xuICAgIGNvbnN0IEhlbHBlckNsYXNzID0gdGhpcy5oZWxwZXJcblxuICAgIGxldCBvd25lciA9IHRoaXNcblxuICAgIGlkID0gaWQgfHwgdGhpcy5idWlsZElkKHVyaSlcblxuICAgIGxldCBoZWxwZXJJbnN0YW5jZVxuXG4gICAgdHJ5IHtcbiAgICAgIGxldCByZXF1aXJlZCA9IHJlcXVpcmUodXJpKVxuICAgICAgbGV0IGNhY2hlZCA9IHJlcXVpcmUuY2FjaGVbdXJpXVxuICAgICAgbGV0IGVtcHR5ID0gT2JqZWN0LmtleXMoY2FjaGVkLmV4cG9ydHMpLmxlbmd0aCA9PT0gMFxuICAgICAgbGV0IGRlZmluaXRpb24gPSB0aGlzLmhlbHBlci5EZWZpbml0aW9uICYmIHRoaXMuaGVscGVyLkRlZmluaXRpb24uY3VycmVudCgpXG5cbiAgICAgIGlmIChlbXB0eSAmJiBkZWZpbml0aW9uKSB7XG4gICAgICAgIGhlbHBlckluc3RhbmNlID0gSGVscGVyQ2xhc3MuZnJvbURlZmluaXRpb24odXJpLCBkZWZpbml0aW9uLCB7b3duZXIsIGlkLCByZXF1aXJlZH0pXG4gICAgICB9IGVsc2UgaWYgKGRlZmluaXRpb24pIHtcbiAgICAgICAgaGVscGVySW5zdGFuY2UgPSBIZWxwZXJDbGFzcy5mcm9tRGVmaW5pdGlvbih1cmksIGRlZmluaXRpb24sIHtvd25lciwgaWQsIHJlcXVpcmVkfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGhlbHBlckluc3RhbmNlID0gbmV3IEhlbHBlckNsYXNzKHVyaSwge293bmVyLCBpZCwgZGVmaW5pdGlvbiwgcmVxdWlyZWR9KVxuICAgICAgfVxuXG4gICAgICBpZiAoIWhlbHBlckluc3RhbmNlKSB7XG4gICAgICAgIHRocm93ICgnVWggb2gnKVxuICAgICAgfVxuXG4gICAgICBpZCA9IGlkLnJlcGxhY2UoL1xcL2luZGV4JC9pLCAnJylcblxuICAgICAgdGhpcy5yZWdpc3RlcihpZCwgaGVscGVySW5zdGFuY2UpXG5cbiAgICAgIC8vIHRvZG86IHNob3VsZCBqdXN0IGJlIGEgbWV0aG9kIG9uIGRlZmluaXRpb25cbiAgICAgIGlmICh0aGlzLmhlbHBlci5EZWZpbml0aW9uICYmIHRoaXMuaGVscGVyLkRlZmluaXRpb24uY2xlYXJEZWZpbml0aW9uKSB7XG4gICAgICAgICB0aGlzLmhlbHBlci5EZWZpbml0aW9uLmNsZWFyRGVmaW5pdGlvbigpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoZWxwZXJJbnN0YW5jZVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZygnRXJyb3IgbG9hZGluZzogJyArIHVyaSwgZXJyb3IubWVzc2FnZSlcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yLnN0YWNrKVxuICAgIH1cbiAgfVxuXG5cbiAgZmlsdGVyICguLi5hcmdzKSB7XG4gICAgIHJldHVybiB0aGlzLmFsbC5maWx0ZXIoLi4uYXJncylcbiAgfVxuXG4gIG1hcCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuYWxsLm1hcCguLi5hcmdzKVxuICB9XG5cbiAgZm9yRWFjaCguLi5hcmdzKXtcbiAgICByZXR1cm4gdGhpcy5hbGwuZm9yRWFjaCguLi5hcmdzKVxuICB9XG5cbiAgYWxsSGVscGVycyAoaW5jbHVkZUZhbGxiYWNrID0gdHJ1ZSkge1xuICAgIGxldCBtaW5lID0gdXRpbC52YWx1ZXModGhpcy5yZWdpc3RyeSlcblxuICAgIGlmICh0aGlzLmZhbGxiYWNrICYmIGluY2x1ZGVGYWxsYmFjaykge1xuICAgICAgcmV0dXJuIG1pbmUuY29uY2F0KHRoaXMuZmFsbGJhY2suYWxsKVxuICAgIH1cblxuICAgIHJldHVybiBtaW5lXG4gIH1cblxuICBnZXQgYWxsICgpIHtcbiAgICAgcmV0dXJuIHRoaXMuYWxsSGVscGVycyhmYWxzZSlcbiAgfVxuXG4gIGdldCBhdmFpbGFibGUgKCkge1xuICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXModGhpcy5yZWdpc3RyeSlcblxuICAgIGlmICh0aGlzLmZhbGxiYWNrKSB7XG4gICAgICByZXR1cm4ga2V5cy5jb25jYXQodGhpcy5mYWxsYmFjay5hdmFpbGFibGUpXG4gICAgfVxuXG4gICAgcmV0dXJuIGtleXNcbiAgfVxufVxuXG5jb25zdCBfQ0FDSEUgPSB7IH1cblxuY2xhc3MgQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yIChjYWNoZSkge1xuICAgIHRoaXMuY2FjaGUgPSBjYWNoZSB8fCB7fVxuICB9XG5cbiAgYnVpbGQgKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gUmVnaXN0cnkuYnVpbGQoLi4uYXJncylcbiAgfVxuXG4gIGJ1aWxkQWxsIChob3N0LCBoZWxwZXJzLCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgcm9vdCA9IG9wdGlvbnMucm9vdCB8fCBob3N0LnJvb3RcbiAgICBsZXQgYyA9IHRoaXMuY2FjaGVbaG9zdC5yb290XSA9IHRoaXMuY2FjaGVbaG9zdC5yb290XSB8fCB7IH1cblxuICAgIHJvb3Quc2hvdWxkLm5vdC5iZS5lbXB0eSgpXG4gICAgYy5zaG91bGQuYmUuYW4uT2JqZWN0XG4gICAgaGVscGVycy5zaG91bGQubm90LmJlLmVtcHR5KClcblxuICAgIE9iamVjdC5rZXlzKGhlbHBlcnMpLmZvckVhY2godHlwZSA9PiB7XG4gICAgICBsZXQgbmFtZSA9IHV0aWwudGFiZWxpemUodHlwZSlcbiAgICAgIGNbbmFtZV0gPSBjW25hbWVdIHx8IFJlZ2lzdHJ5LmJ1aWxkKGhvc3QsIGhlbHBlcnNbdHlwZV0sIHtuYW1lLCByb290OiBob3N0LnJvb3R9KVxuICAgIH0pXG5cbiAgICByZXR1cm4gY1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IEJ1aWxkZXIoX0NBQ0hFKVxuXG5mdW5jdGlvbiBidWlsZEF0SW50ZXJmYWNlIChob3N0KSB7XG4gIGxldCBjaGFpbiA9IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiBob3N0Lmxvb2t1cChpZClcbiAgfVxuXG4gIGxldCBleHBhbmQgPSBob3N0LmxvYWRlZFxuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShob3N0LCAnYXQnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHZhbHVlOiBjaGFpblxuICB9KVxuXG4gIGxldCBpZFBhdGhzID0gaG9zdC5hdmFpbGFibGUuY29uY2F0KFtdKVxuXG4gIGlmIChleHBhbmQpIHtcbiAgICBsZXQgZXhwYW5kZWQgPSBpZFBhdGhzLm1hcChpZFBhdGggPT4gaWRQYXRoLnNwbGl0KCcvJykpLnNvcnQoKGEsIGIpID0+IGEubGVuZ3RoID4gYi5sZW5ndGgpXG5cbiAgICBleHBhbmRlZC5mb3JFYWNoKHBhcnRzID0+IHtcbiAgICAgIGxldCBpZCA9IHBhcnRzLmpvaW4oJy8nKVxuICAgICAgbGV0IGZpcnN0ID0gcGFydHNbMF1cblxuICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB1dGlsLmFzc2lnbihjaGFpbiwge1xuICAgICAgICAgIGdldCBbZmlyc3RdICgpIHtcbiAgICAgICAgICAgIHJldHVybiBob3N0Lmxvb2t1cChpZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGxldCBnZXR0ZXIgPSBwYXJ0cy5wb3AoKVxuICAgICAgICBsZXQgaWRQYXRoID0gcGFydHMuam9pbignLicpLnJlcGxhY2UoLy0vZywgJ18nKVxuICAgICAgICBsZXQgdGFyZ2V0ID0gY2FydmUuZ2V0KGNoYWluLCBpZFBhdGgpIHx8IHsgfVxuXG4gICAgICAgIHV0aWwuYXNzaWduKHRhcmdldCwge1xuICAgICAgICAgIGdldCBbZ2V0dGVyXSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaG9zdC5sb29rdXAoaWQpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICBjYXJ2ZS5zZXQoY2hhaW4sIGlkUGF0aCwgdGFyZ2V0KVxuICAgICAgfVxuICAgIH0pXG4gIH1cbn1cbiJdfQ==