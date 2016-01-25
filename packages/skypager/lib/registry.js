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
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (helperId === 'loader') {
        return this.runLoader.apply(this, args);
      }

      var fn = this.lookup(helperId).runner;
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
//# sourceMappingURL=data:application/json;base64,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S0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQy9DLGNBQUksTUFBTSxHQUFHLHFCQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRyxDQUFBOztBQUU1QyxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sdURBQ1gsTUFBTSxpQkFBTixNQUFNLHNCQUFOLE1BQU0sb0JBQUs7QUFDZCxtQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1dBQ3ZCLDJFQUNELENBQUE7QUFDRiwrQkFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTs7T0FDakM7S0FDRixDQUFDLENBQUE7R0FDSDtDQUNGIiwiZmlsZSI6InJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIFJlZmFjdG9yaW5nIG5vdGVzOlxuKlxuKiBDdXJyZW50bHkgdGhlcmUgaXMgYSByZWdpc3RyeSBmb3IgdGhlIHNreXBhZ2VyIGZyYW1ld29yayBhbmQgdGhlbiBwZXIgcHJvamVjdCBycmVnaXN0cmllc1xuKlxuKiBJIHNob3VsZCBtYWtlIG9uZSByZWdpc3RyeSBmb3IgdGhlIGZyYW1ld29yaywgYW5kIHRoZW4gaGVscGVycyByZWdpc3RlciB0aGVtc2VsdmVzIHdpdGggdGhlIHByb2plY3QgdGhleSBiZWxvbmcgdG9cbiogYW5kIGJ5IGRlZmF1bHQgb25seSBnZXQgZnJhbWV3b3JrIGhlbHBlcnMgYW5kIHByb2plY3QgaGVscGVycyBhdmFpbGFibGUgdG8gdGhlbS5cbipcbiovXG5pbXBvcnQgU2t5cGFnZXIgZnJvbSAnLi9pbmRleCdcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsJ1xuaW1wb3J0IGNhcnZlIGZyb20gJ29iamVjdC1wYXRoJ1xuXG5pbXBvcnQgeyBiYXNlbmFtZSwgam9pbiwgcmVzb2x2ZSwgZGlybmFtZSwgcmVsYXRpdmUgfSBmcm9tICdwYXRoJ1xuXG5cbmltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1Zygnc2t5cGFnZXI6cmVnaXN0cnknKVxuXG5jb25zdCBGYWxsYmFja3MgPSB7fVxuXG5jbGFzcyBSZWdpc3RyeSB7XG4gIHN0YXRpYyBidWlsZCAoaG9zdCwgaGVscGVyLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdpc3RyeShob3N0LCBoZWxwZXIsIG9wdGlvbnMpXG4gIH1cblxuICBjb25zdHJ1Y3RvciAoaG9zdCwgaGVscGVyLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAoIWhvc3QgfHwgIWhlbHBlcikge1xuICAgICAgdGhyb3cgKCdNdXN0IHN1cHBseSBhIHJlZ2lzdHJ5IHdpdGggYSBob3N0IGFuZCBhIGhlbHBlciBjbGFzcycpXG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IHV0aWwudGFiZWxpemUoaGVscGVyLm5hbWUgfHwgJycpXG4gICAgdGhpcy5yb290ID0gam9pbigob3B0aW9ucy5yb290IHx8IGhvc3Qucm9vdCksIHRoaXMubmFtZSlcblxuICAgIGxldCByZWdpc3RyeSA9IHsgfVxuICAgIGxldCBhbGlhc2VzID0geyB9XG5cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdob3N0JywgKCkgPT4gaG9zdClcbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdhbGlhc2VzJywgKCkgPT4gYWxpYXNlcylcbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdyZWdpc3RyeScsICgpID0+IHJlZ2lzdHJ5KVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2hlbHBlcicsICgpID0+IGhlbHBlcilcblxuICAgIGlmIChob3N0LnR5cGUgPT09ICdmcmFtZXdvcmsnKSB7XG4gICAgICBGYWxsYmFja3NbdGhpcy5uYW1lXSA9IHRoaXNcbiAgICB9XG5cbiAgICBsZXQgaW5kZXhTY3JpcHRcblxuICAgIHRoaXMubG9hZGVkID0gZmFsc2VcblxuICAgIHRyeSB7XG4gICAgICBpbmRleFNjcmlwdCA9IHJlcXVpcmUucmVzb2x2ZShqb2luKHRoaXMucm9vdCwgJ2luZGV4LmpzJykpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgIH1cblxuICAgIGlmIChpbmRleFNjcmlwdCkge1xuICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlXG4gICAgICB0aGlzLnJ1bkxvYWRlcihyZXF1aXJlKGluZGV4U2NyaXB0KSlcbiAgICB9XG5cbiAgICBidWlsZEF0SW50ZXJmYWNlKHRoaXMpXG5cbiAgICB0aGlzLmxvYWRlZCA9IHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBoZWxwZXIgZnJvbSB0aGlzIHJlZ2lzdHJ5XG4gICAqXG4gICAqIEBwYXJhbSB7SGVscGVyLmlkfSBoZWxwZXJJZCAtIHRoZSBpZCB0aGUgaGVscGVyIHdhcyByZWdpc3RlcmVkIHdpdGhcbiAgKi9cbiAgcmVtb3ZlIChoZWxwZXJJZCkge1xuICAgIGxldCBpbnN0YW5jZSA9IHRoaXMubG9va3VwKGhlbHBlcklkLCBmYWxzZSlcbiAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgIGlmIChpbnN0YW5jZS5uYW1lKSB7XG4gICAgICAgIGRlbGV0ZSAodGhpcy5hbGlhc2VzLCBpbnN0YW5jZS5uYW1lKVxuICAgICAgfVxuXG4gICAgICBpZiAoaW5zdGFuY2UuYWxpYXNlcykge1xuICAgICAgICBpbnN0YW5jZS5hbGlhc2VzLmZvckVhY2goYSA9PiBkZWxldGUgKHRoaXMuYWxpYXNlc1thXSkpXG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSAodGhpcy5hbGlhc2VzW2luc3RhbmNlLmlkXSlcbiAgICAgIGRlbGV0ZSAodGhpcy5yZWdpc3RyeVtpbnN0YW5jZS5pZF0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHJ1biBhIGhlbHBlcidzIG1haW4gZnVuY3Rpb24uXG4gICAqXG4gICAqIHVzaW5nIHRoZSBoZWxwZXJJZCAnbG9hZGVyJyBhbmQgcGFzc2luZyBpdCBhIGZ1bmN0aW9uIGlzIGEgY29udmVuaWVudCB3YXlcbiAgICogb2YgcnVubmluZyBhIHNwZWNpYWwgbG9hZGVyIGZ1bmN0aW9uLiBAc2VlIHJ1bkxvYWRlclxuICAgKlxuICAgKiBAcGFyYW0ge0hlbHBlci5pZH0gaGVscGVySWRcbiAgICogQHBhcmFtIHtXaGF0ZXZlcn0gLi4uYXJnc1xuICAqL1xuICBydW4gKGhlbHBlcklkLCAuLi5hcmdzKSB7XG4gICAgaWYgKCBoZWxwZXJJZCA9PT0gJ2xvYWRlcicgKSB7XG4gICAgICByZXR1cm4gdGhpcy5ydW5Mb2FkZXIoLi4uYXJncylcbiAgICB9XG5cbiAgICBsZXQgZm4gPSB0aGlzLmxvb2t1cChoZWxwZXJJZCkucnVubmVyXG4gICAgcmV0dXJuIGZuKC4uLmFyZ3MpXG4gIH1cblxuICAvKipcbiAgICogVGhlIEZhbGxiYWNrIHJlZ2lzdHJ5IGZvciBub3cgd2lsbCBhbHdheXMgYmUgU2t5cGFnZXJcbiAgICpcbiAgICogQHByaXZhdGVcbiAgKi9cbiAgZ2V0IGZhbGxiYWNrICgpIHtcbiAgICBpZiAodGhpcy5ob3N0LnR5cGUgIT09ICdmcmFtZXdvcmsnKSB7XG4gICAgICByZXR1cm4gRmFsbGJhY2tzW3RoaXMubmFtZV1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUXVlcnkgdGhpcyBoZWxwZXIgcmVnaXN0cnkgYW5kIHJldHVybiBvbmx5IGhlbHBlcnMgd2hpY2ggbWF0Y2hcbiAgICpcbiAgICogQGV4YW1wbGUgcmV0dXJuIGFjdGlvbnMgdGhhdCBleHBvc2UgYSBDTEkgaW50ZXJmYWNlXG4gICAqXG4gICAqICBza3lwYWdlci5hY3Rpb25zLnF1ZXJ5KChoZWxwZXIpID0+IHtcbiAgICogICAgcmV0dXJuICgnY2xpJyBpbiBoZWxwZXIuZGVmaW5pdGlvbi5pbnRlcmZhY2VzKVxuICAgKiAgfSlcbiAgKi9cbiAgcXVlcnkgKHBhcmFtcykge1xuICAgIHJldHVybiB1dGlsLmZpbHRlclF1ZXJ5KHRoaXMuYWxsSGVscGVycyh0cnVlKSwgcGFyYW1zKVxuICB9XG5cbiAgLyoqXG4gICAqIExvb2t1cCBhIGhlbHBlciBieSBpZFxuICAgKlxuICAgKiBAcGFyYW0ge0hlbHBlci5pZH0gbmVlZGxlIHRoZSBpZCBvZiB0aGUgaGVscGVyIHlvdSB3YW50XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gc3RyaWN0IHRocm93IGFuIGVycm9yIHdoZW4gaXQgaXMgbm90IGZvdW5kXG4gICAqIEBwYXJhbSB7UHJvamVjdH0gZnJvbVByb2plY3Qgb25seSByZXR1cm4gaGVscGVycyB0aGF0IHdlcmUgcmVnaXN0ZXJlZCBieSBhIHBhcnRpY3VsYXIgcHJvamVjdFxuICAgKlxuICAgKi9cbiAgbG9va3VwIChuZWVkbGUsIHN0cmljdCA9IHRydWUsIGZyb21Qcm9qZWN0KSB7XG4gICAgbGV0IGhlbHBlcklkID0gdGhpcy5hbGlhc2VzW25lZWRsZV1cblxuICAgIGlmICh0eXBlb2YgKGhlbHBlcklkKSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGlmICh0aGlzLmZhbGxiYWNrKSB7IHJldHVybiB0aGlzLmZhbGxiYWNrLmxvb2t1cChuZWVkbGUsIHN0cmljdCwgdGhpcy5ob3N0KSB9XG4gICAgICBpZiAoc3RyaWN0KSB7IHRocm93ICgnQ291bGQgbm90IGZpbmQgaGVscGVyIHdpdGggaWQ6JyArIG5lZWRsZSkgfVxuICAgIH1cblxuICAgIGxldCByZXN1bHQgPSB0aGlzLnJlZ2lzdHJ5W2hlbHBlcklkXVxuXG4gICAgaWYgKHJlc3VsdCAmJiBmcm9tUHJvamVjdCkgeyByZXN1bHQub3B0aW9ucy5wcm9qZWN0ID0gZnJvbVByb2plY3QgfVxuXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgaGVscGVyIGluc3RhbmNlXG4gICAqXG4gICAqIEBwYXJhbSB7SGVscGVyLmlkfSBoZWxwZXJJZCB0aGUgaWQgdG8gcmVmZXJlbmNlIHRoaXMgaGVscGVyIGJ5XG4gICAqIEBwYXJhbSB7SGVscGVyfSBoZWxwZXJJbnN0YW5jZSBhIGhlbHBlciBvYmplY3QgdGhhdCB3cmFwcyB0aGlzIGhlbHBlciBmaWxlIHdpdGggbWV0YWRhdGFcbiAgKi9cbiAgcmVnaXN0ZXIgKGhlbHBlcklkLCBoZWxwZXJJbnN0YW5jZSkge1xuICAgIGlmICghaGVscGVySW5zdGFuY2UpIHtcbiAgICAgIHRocm93ICgnRXJyb3IgcmVnaXN0ZXJpbmcgJyArIGhlbHBlcklkKVxuICAgIH1cblxuICAgIHRoaXMuYWxpYXNlc1toZWxwZXJJZF0gPSBoZWxwZXJJZFxuXG4gICAgaWYgKGhlbHBlckluc3RhbmNlLm5hbWUpIHtcbiAgICAgIHRoaXMuYWxpYXNlc1toZWxwZXJJbnN0YW5jZS5uYW1lXSA9IGhlbHBlcklkXG4gICAgfVxuXG4gICAgdGhpcy5yZWdpc3RyeVtoZWxwZXJJZF0gPSBoZWxwZXJJbnN0YW5jZVxuXG4gICAgaGVscGVySW5zdGFuY2UuYWxpYXNlcyAmJiBoZWxwZXJJbnN0YW5jZS5hbGlhc2VzLmZvckVhY2goYWxpYXMgPT4ge1xuICAgICAgdGhpcy5hbGlhc2VzW2FsaWFzXSA9IGhlbHBlcklkXG4gICAgfSlcblxuICAgIHJldHVybiBoZWxwZXJJbnN0YW5jZVxuICB9XG5cbiAgLyoqXG4gICAqIGJ1aWxkIGEgSGVscGVyLmlkIGZvciBhIGdpdmVuIGhlbHBlciBwYXRoXG4gICAqXG4gICAqIEBwYXJhbSB7UGF0aH0gaGVscGVyVVJMIHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoaXMgaGVscGVyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0ga2VlcEV4dGVuc2lvbiAtIGtlZXAgdGhlIGZpbGUgZXh0ZW5zaW9uIGFzIHBhcnQgb2YgdGhlIEhlbHBlci5pZFxuICAqL1xuICBidWlsZElkIChoZWxwZXJVUkwsIGtlZXBFeHRlbnNpb24gPSBmYWxzZSkge1xuICAgIGxldCByZWcgPSBuZXcgUmVnRXhwKCdeJyArIHRoaXMucm9vdCArICcvJywgJ2knKVxuXG4gICAgaWYgKCFoZWxwZXJVUkwubWF0Y2gocmVnKSkge1xuICAgICAgaGVscGVyVVJMID0gYmFzZW5hbWUoaGVscGVyVVJMKVxuICAgIH1cblxuICAgIGxldCBiYXNlID0gaGVscGVyVVJMLnJlcGxhY2UocmVnLCAnJylcblxuICAgIGlmIChiYXNlLm1hdGNoKC9cXC9pbmRleCQvaSkpIHtcbiAgICAgIGJhc2UgPSBiYXNlLnJlcGxhY2UoL1xcL2luZGV4JC9pLCAnJylcbiAgICB9XG5cbiAgICByZXR1cm4ga2VlcEV4dGVuc2lvbiA/IGJhc2UgOiBiYXNlLnJlcGxhY2UoL1xcLlxcdyskL2ksICcnKVxuICB9XG5cbiAgLyoqXG4gICAqIFJ1biBhIGhlbHBlciBsb2FkZXIgZnVuY3Rpb24gZm9yIHRoaXMgcmVnaXN0cnkuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIGEgZnVuY3Rpb24gd2hpY2ggaXMgYWJvdXQgdG8gbG9hZCBoZWxwZXJzIGZvciB1c1xuICAgKiBAcGFyYW0ge09iamVjdH0gbG9jYWxzIGFuIG9iamVjdCBjb250YWluaW5nIHZhcmlhYmxlcyB0byBpbmplY3QgaW50byBzY29wZVxuICAgKlxuICAgKiBUaGlzIHdpbGwgcnVuIHRoZSByZXF1aXJlZCBmdW5jdGlvbiBpbiBhIHNwZWNpYWwgY29udGV4dFxuICAgKiB3aGVyZSBjZXJ0YWluIHN1Z2FyIGlzIGluamVjdGVkIGludG8gdGhlIGdsb2JhbCBzY29wZS5cbiAgICpcbiAgICogVGhlc2UgbG9hZGVyIGZ1bmN0aW9ucyBjYW4gZXhwZWN0IHRvIGhhdmUgdGhlIGZvbGxvd2luZyBpbiBzY29wZTpcbiAgICpcbiAgICogLSByZWdpc3RyeSAtIHRoaXNcbiAgICogLSBbaGVscGVyVHlwZV0gLSBhIHZhcmlhYmxlIG5hbWVkIGFjdGlvbiwgbW9kZWwsIGV4cG9ydGVyLCBwbHVnaW4sIG9yIHdoYXRldmVyXG4gICAqIC0gbG9hZCAtIGEgZnVuY3Rpb24gdG8gbG9hZCBpbiBhIHVyaS4gdGhpcy5sb2FkLmJpbmQocmVnaXN0cnkpXG4gICAqXG4gICovXG4gIHJ1bkxvYWRlciAoZm4sIGxvY2FscyA9IHt9KSB7XG4gICAgbG9jYWxzID0gT2JqZWN0LmFzc2lnbihsb2NhbHMsICh0aGlzLmhlbHBlci5EU0wgPyB0aGlzLmhlbHBlci5EU0wgOiB7fSkpXG5cbiAgICBsb2NhbHMudXRpbCA9IHV0aWxcblxuICAgIGlmICh0aGlzLmhvc3QgJiYgdGhpcy5ob3N0LnR5cGUgJiYgIWxvY2Fsc1t0aGlzLmhvc3QudHlwZV0pIHtcbiAgICAgIGxvY2Fsc1t0aGlzLmhvc3QudHlwZV0gPSB0aGlzLmhvc3RcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oZWxwZXIgJiYgdGhpcy5oZWxwZXIubmFtZSkge1xuICAgICAgbG9jYWxzW3RoaXMuaGVscGVyLm5hbWVdID0gdGhpcy5oZWxwZXJcbiAgICB9XG5cbiAgICBsb2NhbHMucmVnaXN0cnkgPSB0aGlzXG4gICAgbG9jYWxzLmxvYWQgPSB0aGlzLmxvYWQuYmluZCh0aGlzKVxuXG4gICAgdXRpbC5ub0NvbmZsaWN0KGZuLCBsb2NhbHMpKClcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGEgaGVscGVyIGJ5IGl0cyBVUkkgb3IgUGF0aC5cbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIFRoaXMgd2lsbCByZXF1aXJlIHRoZSBoZWxwZXIgaW4gYSBzcGVjaWFsIGNvbnRleHQgd2hlcmUgY2VydGFpblxuICAgKiBvYmplY3RzIGFyZSBpbmplY3RlZCBpbiB0aGUgZ2xvYmFsIHNjb3BlLiBUaGlzIG1ha2VzIGl0IGVhc2llciB0b1xuICAgKiB3cml0ZSBoZWxwZXJzIGJ5IHByb3ZpZGluZyB0aGVtIHdpdGggYSBzcGVjaWZpYyBEU0wgYmFzZWQgb24gdGhlXG4gICAqIGhlbHBlciB0eXBlLlxuICAgKlxuICAgKiBAcGFyYW0ge1VSSX0gdXJpIGFuIGFic29sdXRlIHBhdGggdG8gdGhlIGhlbHBlciBqcyBmaWxlXG4gICAqIEBwYXJhbSB7SGVscGVyLmlkfSBpZCB3aGF0IGlkIHRvIHJlZ2lzdGVyIHRoaXMgaGVscGVyIHVuZGVyP1xuICAgKlxuICAgKiBAc2VlIGhlbHBlcnMvZGVmaW5pdGlvbnMvbW9kZWwuanMgZm9yIGV4YW1wbGVcbiAgICovXG4gIGxvYWQgKHVyaSwgaWQpIHtcbiAgICBjb25zdCBIZWxwZXJDbGFzcyA9IHRoaXMuaGVscGVyXG5cbiAgICBsZXQgb3duZXIgPSB0aGlzXG5cbiAgICBpZCA9IGlkIHx8IHRoaXMuYnVpbGRJZCh1cmkpXG5cbiAgICBsZXQgaGVscGVySW5zdGFuY2VcblxuICAgIHRyeSB7XG4gICAgICBsZXQgcmVxdWlyZWQgPSByZXF1aXJlKHVyaSlcbiAgICAgIGxldCBjYWNoZWQgPSByZXF1aXJlLmNhY2hlW3VyaV1cbiAgICAgIGxldCBlbXB0eSA9IE9iamVjdC5rZXlzKGNhY2hlZC5leHBvcnRzKS5sZW5ndGggPT09IDBcbiAgICAgIGxldCBkZWZpbml0aW9uID0gdGhpcy5oZWxwZXIuRGVmaW5pdGlvbiAmJiB0aGlzLmhlbHBlci5EZWZpbml0aW9uLmN1cnJlbnQoKVxuXG4gICAgICBpZiAoZW1wdHkgJiYgZGVmaW5pdGlvbikge1xuICAgICAgICBoZWxwZXJJbnN0YW5jZSA9IEhlbHBlckNsYXNzLmZyb21EZWZpbml0aW9uKHVyaSwgZGVmaW5pdGlvbiwge293bmVyLCBpZCwgcmVxdWlyZWR9KVxuICAgICAgfSBlbHNlIGlmIChkZWZpbml0aW9uKSB7XG4gICAgICAgIGhlbHBlckluc3RhbmNlID0gSGVscGVyQ2xhc3MuZnJvbURlZmluaXRpb24odXJpLCBkZWZpbml0aW9uLCB7b3duZXIsIGlkLCByZXF1aXJlZH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBoZWxwZXJJbnN0YW5jZSA9IG5ldyBIZWxwZXJDbGFzcyh1cmksIHtvd25lciwgaWQsIGRlZmluaXRpb24sIHJlcXVpcmVkfSlcbiAgICAgIH1cblxuICAgICAgaWYgKCFoZWxwZXJJbnN0YW5jZSkge1xuICAgICAgICB0aHJvdyAoJ1VoIG9oJylcbiAgICAgIH1cblxuICAgICAgaWQgPSBpZC5yZXBsYWNlKC9cXC9pbmRleCQvaSwgJycpXG5cbiAgICAgIHRoaXMucmVnaXN0ZXIoaWQsIGhlbHBlckluc3RhbmNlKVxuXG4gICAgICAvLyB0b2RvOiBzaG91bGQganVzdCBiZSBhIG1ldGhvZCBvbiBkZWZpbml0aW9uXG4gICAgICBpZiAodGhpcy5oZWxwZXIuRGVmaW5pdGlvbiAmJiB0aGlzLmhlbHBlci5EZWZpbml0aW9uLmNsZWFyRGVmaW5pdGlvbikge1xuICAgICAgICAgdGhpcy5oZWxwZXIuRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24oKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gaGVscGVySW5zdGFuY2VcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGxvYWRpbmc6ICcgKyB1cmksIGVycm9yLm1lc3NhZ2UpXG4gICAgICBjb25zb2xlLmxvZyhlcnJvci5zdGFjaylcbiAgICB9XG4gIH1cblxuXG4gIGZpbHRlciAoLi4uYXJncykge1xuICAgICByZXR1cm4gdGhpcy5hbGwuZmlsdGVyKC4uLmFyZ3MpXG4gIH1cblxuICBtYXAoLi4uYXJncykge1xuICAgIHJldHVybiB0aGlzLmFsbC5tYXAoLi4uYXJncylcbiAgfVxuXG4gIGZvckVhY2goLi4uYXJncyl7XG4gICAgcmV0dXJuIHRoaXMuYWxsLmZvckVhY2goLi4uYXJncylcbiAgfVxuXG4gIGFsbEhlbHBlcnMgKGluY2x1ZGVGYWxsYmFjayA9IHRydWUpIHtcbiAgICBsZXQgbWluZSA9IHV0aWwudmFsdWVzKHRoaXMucmVnaXN0cnkpXG5cbiAgICBpZiAodGhpcy5mYWxsYmFjayAmJiBpbmNsdWRlRmFsbGJhY2spIHtcbiAgICAgIHJldHVybiBtaW5lLmNvbmNhdCh0aGlzLmZhbGxiYWNrLmFsbClcbiAgICB9XG5cbiAgICByZXR1cm4gbWluZVxuICB9XG5cbiAgZ2V0IGFsbCAoKSB7XG4gICAgIHJldHVybiB0aGlzLmFsbEhlbHBlcnMoZmFsc2UpXG4gIH1cblxuICBnZXQgYXZhaWxhYmxlICgpIHtcbiAgICBsZXQga2V5cyA9IE9iamVjdC5rZXlzKHRoaXMucmVnaXN0cnkpXG5cbiAgICBpZiAodGhpcy5mYWxsYmFjaykge1xuICAgICAgcmV0dXJuIGtleXMuY29uY2F0KHRoaXMuZmFsbGJhY2suYXZhaWxhYmxlKVxuICAgIH1cblxuICAgIHJldHVybiBrZXlzXG4gIH1cbn1cblxuY29uc3QgX0NBQ0hFID0geyB9XG5cbmNsYXNzIEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvciAoY2FjaGUpIHtcbiAgICB0aGlzLmNhY2hlID0gY2FjaGUgfHwge31cbiAgfVxuXG4gIGJ1aWxkICguLi5hcmdzKSB7XG4gICAgcmV0dXJuIFJlZ2lzdHJ5LmJ1aWxkKC4uLmFyZ3MpXG4gIH1cblxuICBidWlsZEFsbCAoaG9zdCwgaGVscGVycywgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHJvb3QgPSBvcHRpb25zLnJvb3QgfHwgaG9zdC5yb290XG4gICAgbGV0IGMgPSB0aGlzLmNhY2hlW2hvc3Qucm9vdF0gPSB0aGlzLmNhY2hlW2hvc3Qucm9vdF0gfHwgeyB9XG5cbiAgICByb290LnNob3VsZC5ub3QuYmUuZW1wdHkoKVxuICAgIGMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgIGhlbHBlcnMuc2hvdWxkLm5vdC5iZS5lbXB0eSgpXG5cbiAgICBPYmplY3Qua2V5cyhoZWxwZXJzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgbGV0IG5hbWUgPSB1dGlsLnRhYmVsaXplKHR5cGUpXG4gICAgICBjW25hbWVdID0gY1tuYW1lXSB8fCBSZWdpc3RyeS5idWlsZChob3N0LCBoZWxwZXJzW3R5cGVdLCB7bmFtZSwgcm9vdDogaG9zdC5yb290fSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBCdWlsZGVyKF9DQUNIRSlcblxuZnVuY3Rpb24gYnVpbGRBdEludGVyZmFjZSAoaG9zdCkge1xuICBsZXQgY2hhaW4gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICByZXR1cm4gaG9zdC5sb29rdXAoaWQpXG4gIH1cblxuICBsZXQgZXhwYW5kID0gaG9zdC5sb2FkZWRcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaG9zdCwgJ2F0Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogY2hhaW5cbiAgfSlcblxuICBsZXQgaWRQYXRocyA9IGhvc3QuYXZhaWxhYmxlLmNvbmNhdChbXSlcblxuICBpZiAoZXhwYW5kKSB7XG4gICAgbGV0IGV4cGFuZGVkID0gaWRQYXRocy5tYXAoaWRQYXRoID0+IGlkUGF0aC5zcGxpdCgnLycpKS5zb3J0KChhLCBiKSA9PiBhLmxlbmd0aCA+IGIubGVuZ3RoKVxuXG4gICAgZXhwYW5kZWQuZm9yRWFjaChwYXJ0cyA9PiB7XG4gICAgICBsZXQgaWQgPSBwYXJ0cy5qb2luKCcvJylcbiAgICAgIGxldCBmaXJzdCA9IHBhcnRzWzBdXG5cbiAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdXRpbC5hc3NpZ24oY2hhaW4sIHtcbiAgICAgICAgICBnZXQgW2ZpcnN0XSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaG9zdC5sb29rdXAoaWQpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgICBsZXQgZ2V0dGVyID0gcGFydHMucG9wKClcbiAgICAgICAgbGV0IGlkUGF0aCA9IHBhcnRzLmpvaW4oJy4nKS5yZXBsYWNlKC8tL2csICdfJylcbiAgICAgICAgbGV0IHRhcmdldCA9IGNhcnZlLmdldChjaGFpbiwgaWRQYXRoKSB8fCB7IH1cblxuICAgICAgICB1dGlsLmFzc2lnbih0YXJnZXQsIHtcbiAgICAgICAgICBnZXQgW2dldHRlcl0gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGhvc3QubG9va3VwKGlkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgY2FydmUuc2V0KGNoYWluLCBpZFBhdGgsIHRhcmdldClcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG4iXX0=