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
      return util.filterQuery(this.all, params);
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
//# sourceMappingURL=data:application/json;base64,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QUFDLFVBQUEsS0FBSyxFQUFJO0FBQ3hCLFVBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDeEIsVUFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBOztBQUVwQixVQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOzs7QUFDdEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLG9EQUNWLEtBQUssZ0JBQUwsS0FBSyxxQkFBTCxLQUFLLG9CQUFLO0FBQ2IsaUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtTQUN2Qix3RUFDRCxDQUFBO09BQ0g7O0FBRUQsVUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs7OztBQUNwQixjQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUE7QUFDeEIsY0FBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFBO0FBQy9DLGNBQUksTUFBTSxHQUFHLHFCQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRyxDQUFBOztBQUU1QyxjQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sdURBQ1gsTUFBTSxpQkFBTixNQUFNLHNCQUFOLE1BQU0sb0JBQUs7QUFDZCxtQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1dBQ3ZCLDJFQUNELENBQUE7QUFDRiwrQkFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQTs7T0FDakM7S0FDRixDQUFDLENBQUE7R0FDSDtDQUNGIiwiZmlsZSI6InJlZ2lzdHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4qIFJlZmFjdG9yaW5nIG5vdGVzOlxuKlxuKiBDdXJyZW50bHkgdGhlcmUgaXMgYSByZWdpc3RyeSBmb3IgdGhlIHNreXBhZ2VyIGZyYW1ld29yayBhbmQgdGhlbiBwZXIgcHJvamVjdCBycmVnaXN0cmllc1xuKlxuKiBJIHNob3VsZCBtYWtlIG9uZSByZWdpc3RyeSBmb3IgdGhlIGZyYW1ld29yaywgYW5kIHRoZW4gaGVscGVycyByZWdpc3RlciB0aGVtc2VsdmVzIHdpdGggdGhlIHByb2plY3QgdGhleSBiZWxvbmcgdG9cbiogYW5kIGJ5IGRlZmF1bHQgb25seSBnZXQgZnJhbWV3b3JrIGhlbHBlcnMgYW5kIHByb2plY3QgaGVscGVycyBhdmFpbGFibGUgdG8gdGhlbS5cbipcbiovXG5pbXBvcnQgU2t5cGFnZXIgZnJvbSAnLi9pbmRleCdcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsJ1xuaW1wb3J0IGNhcnZlIGZyb20gJ29iamVjdC1wYXRoJ1xuXG5pbXBvcnQgeyBiYXNlbmFtZSwgam9pbiwgcmVzb2x2ZSwgZGlybmFtZSwgcmVsYXRpdmUgfSBmcm9tICdwYXRoJ1xuXG5cbmltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1Zygnc2t5cGFnZXI6cmVnaXN0cnknKVxuXG5jb25zdCBGYWxsYmFja3MgPSB7fVxuXG5jbGFzcyBSZWdpc3RyeSB7XG4gIHN0YXRpYyBidWlsZCAoaG9zdCwgaGVscGVyLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdpc3RyeShob3N0LCBoZWxwZXIsIG9wdGlvbnMpXG4gIH1cblxuICBjb25zdHJ1Y3RvciAoaG9zdCwgaGVscGVyLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAoIWhvc3QgfHwgIWhlbHBlcikge1xuICAgICAgdGhyb3cgKCdNdXN0IHN1cHBseSBhIHJlZ2lzdHJ5IHdpdGggYSBob3N0IGFuZCBhIGhlbHBlciBjbGFzcycpXG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IHV0aWwudGFiZWxpemUoaGVscGVyLm5hbWUgfHwgJycpXG4gICAgdGhpcy5yb290ID0gam9pbigob3B0aW9ucy5yb290IHx8IGhvc3Qucm9vdCksIHRoaXMubmFtZSlcblxuICAgIGxldCByZWdpc3RyeSA9IHsgfVxuICAgIGxldCBhbGlhc2VzID0geyB9XG5cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdob3N0JywgKCkgPT4gaG9zdClcbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdhbGlhc2VzJywgKCkgPT4gYWxpYXNlcylcbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdyZWdpc3RyeScsICgpID0+IHJlZ2lzdHJ5KVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2hlbHBlcicsICgpID0+IGhlbHBlcilcblxuICAgIGlmIChob3N0LnR5cGUgPT09ICdmcmFtZXdvcmsnKSB7XG4gICAgICBGYWxsYmFja3NbdGhpcy5uYW1lXSA9IHRoaXNcbiAgICB9XG5cbiAgICBsZXQgaW5kZXhTY3JpcHRcblxuICAgIHRoaXMubG9hZGVkID0gZmFsc2VcblxuICAgIHRyeSB7XG4gICAgICBpbmRleFNjcmlwdCA9IHJlcXVpcmUucmVzb2x2ZShqb2luKHRoaXMucm9vdCwgJ2luZGV4LmpzJykpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgIH1cblxuICAgIGlmIChpbmRleFNjcmlwdCkge1xuICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlXG4gICAgICB0aGlzLnJ1bkxvYWRlcihyZXF1aXJlKGluZGV4U2NyaXB0KSlcbiAgICB9XG5cbiAgICBidWlsZEF0SW50ZXJmYWNlKHRoaXMpXG5cbiAgICB0aGlzLmxvYWRlZCA9IHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBoZWxwZXIgZnJvbSB0aGlzIHJlZ2lzdHJ5XG4gICAqXG4gICAqIEBwYXJhbSB7SGVscGVyLmlkfSBoZWxwZXJJZCAtIHRoZSBpZCB0aGUgaGVscGVyIHdhcyByZWdpc3RlcmVkIHdpdGhcbiAgKi9cbiAgcmVtb3ZlIChoZWxwZXJJZCkge1xuICAgIGxldCBpbnN0YW5jZSA9IHRoaXMubG9va3VwKGhlbHBlcklkLCBmYWxzZSlcbiAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgIGlmIChpbnN0YW5jZS5uYW1lKSB7XG4gICAgICAgIGRlbGV0ZSAodGhpcy5hbGlhc2VzLCBpbnN0YW5jZS5uYW1lKVxuICAgICAgfVxuXG4gICAgICBpZiAoaW5zdGFuY2UuYWxpYXNlcykge1xuICAgICAgICBpbnN0YW5jZS5hbGlhc2VzLmZvckVhY2goYSA9PiBkZWxldGUgKHRoaXMuYWxpYXNlc1thXSkpXG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSAodGhpcy5hbGlhc2VzW2luc3RhbmNlLmlkXSlcbiAgICAgIGRlbGV0ZSAodGhpcy5yZWdpc3RyeVtpbnN0YW5jZS5pZF0pXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHJ1biBhIGhlbHBlcidzIG1haW4gZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtIZWxwZXIuaWR9IGhlbHBlcklkXG4gICAqIEBwYXJhbSB7V2hhdGV2ZXJ9IC4uLmFyZ3NcbiAgKi9cbiAgcnVuIChoZWxwZXJJZCwgLi4uYXJncykge1xuICAgIGxldCBmbiA9IHRoaXMubG9va3VwKGhlbHBlcklkKS5ydW5uZXJcbiAgICByZXR1cm4gZm4oLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgRmFsbGJhY2sgcmVnaXN0cnkgZm9yIG5vdyB3aWxsIGFsd2F5cyBiZSBTa3lwYWdlclxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAqL1xuICBnZXQgZmFsbGJhY2sgKCkge1xuICAgIGlmICh0aGlzLmhvc3QudHlwZSAhPT0gJ2ZyYW1ld29yaycpIHtcbiAgICAgIHJldHVybiBGYWxsYmFja3NbdGhpcy5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBRdWVyeSB0aGlzIGhlbHBlciByZWdpc3RyeSBhbmQgcmV0dXJuIG9ubHkgaGVscGVycyB3aGljaCBtYXRjaFxuICAgKlxuICAgKiBAZXhhbXBsZSByZXR1cm4gYWN0aW9ucyB0aGF0IGV4cG9zZSBhIENMSSBpbnRlcmZhY2VcbiAgICpcbiAgICogIHNreXBhZ2VyLmFjdGlvbnMucXVlcnkoKGhlbHBlcikgPT4ge1xuICAgKiAgICByZXR1cm4gKCdjbGknIGluIGhlbHBlci5kZWZpbml0aW9uLmludGVyZmFjZXMpXG4gICAqICB9KVxuICAqL1xuICBxdWVyeSAocGFyYW1zKSB7XG4gICAgcmV0dXJuIHV0aWwuZmlsdGVyUXVlcnkodGhpcy5hbGwsIHBhcmFtcylcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rdXAgYSBoZWxwZXIgYnkgaWRcbiAgICpcbiAgICogQHBhcmFtIHtIZWxwZXIuaWR9IG5lZWRsZSB0aGUgaWQgb2YgdGhlIGhlbHBlciB5b3Ugd2FudFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IHN0cmljdCB0aHJvdyBhbiBlcnJvciB3aGVuIGl0IGlzIG5vdCBmb3VuZFxuICAgKiBAcGFyYW0ge1Byb2plY3R9IGZyb21Qcm9qZWN0IG9ubHkgcmV0dXJuIGhlbHBlcnMgdGhhdCB3ZXJlIHJlZ2lzdGVyZWQgYnkgYSBwYXJ0aWN1bGFyIHByb2plY3RcbiAgICpcbiAgICovXG4gIGxvb2t1cCAobmVlZGxlLCBzdHJpY3QgPSB0cnVlLCBmcm9tUHJvamVjdCkge1xuICAgIGxldCBoZWxwZXJJZCA9IHRoaXMuYWxpYXNlc1tuZWVkbGVdXG5cbiAgICBpZiAodHlwZW9mIChoZWxwZXJJZCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAodGhpcy5mYWxsYmFjaykgeyByZXR1cm4gdGhpcy5mYWxsYmFjay5sb29rdXAobmVlZGxlLCBzdHJpY3QsIHRoaXMuaG9zdCkgfVxuICAgICAgaWYgKHN0cmljdCkgeyB0aHJvdyAoJ0NvdWxkIG5vdCBmaW5kIGhlbHBlciB3aXRoIGlkOicgKyBuZWVkbGUpIH1cbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5yZWdpc3RyeVtoZWxwZXJJZF1cblxuICAgIGlmIChyZXN1bHQgJiYgZnJvbVByb2plY3QpIHsgcmVzdWx0Lm9wdGlvbnMucHJvamVjdCA9IGZyb21Qcm9qZWN0IH1cblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGhlbHBlciBpbnN0YW5jZVxuICAgKlxuICAgKiBAcGFyYW0ge0hlbHBlci5pZH0gaGVscGVySWQgdGhlIGlkIHRvIHJlZmVyZW5jZSB0aGlzIGhlbHBlciBieVxuICAgKiBAcGFyYW0ge0hlbHBlcn0gaGVscGVySW5zdGFuY2UgYSBoZWxwZXIgb2JqZWN0IHRoYXQgd3JhcHMgdGhpcyBoZWxwZXIgZmlsZSB3aXRoIG1ldGFkYXRhXG4gICovXG4gIHJlZ2lzdGVyIChoZWxwZXJJZCwgaGVscGVySW5zdGFuY2UpIHtcbiAgICBpZiAoIWhlbHBlckluc3RhbmNlKSB7XG4gICAgICB0aHJvdyAoJ0Vycm9yIHJlZ2lzdGVyaW5nICcgKyBoZWxwZXJJZClcbiAgICB9XG5cbiAgICB0aGlzLmFsaWFzZXNbaGVscGVySWRdID0gaGVscGVySWRcblxuICAgIGlmIChoZWxwZXJJbnN0YW5jZS5uYW1lKSB7XG4gICAgICB0aGlzLmFsaWFzZXNbaGVscGVySW5zdGFuY2UubmFtZV0gPSBoZWxwZXJJZFxuICAgIH1cblxuICAgIHRoaXMucmVnaXN0cnlbaGVscGVySWRdID0gaGVscGVySW5zdGFuY2VcblxuICAgIGhlbHBlckluc3RhbmNlLmFsaWFzZXMgJiYgaGVscGVySW5zdGFuY2UuYWxpYXNlcy5mb3JFYWNoKGFsaWFzID0+IHtcbiAgICAgIHRoaXMuYWxpYXNlc1thbGlhc10gPSBoZWxwZXJJZFxuICAgIH0pXG5cbiAgICByZXR1cm4gaGVscGVySW5zdGFuY2VcbiAgfVxuXG4gIC8qKlxuICAgKiBidWlsZCBhIEhlbHBlci5pZCBmb3IgYSBnaXZlbiBoZWxwZXIgcGF0aFxuICAgKlxuICAgKiBAcGFyYW0ge1BhdGh9IGhlbHBlclVSTCB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGlzIGhlbHBlclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGtlZXBFeHRlbnNpb24gLSBrZWVwIHRoZSBmaWxlIGV4dGVuc2lvbiBhcyBwYXJ0IG9mIHRoZSBIZWxwZXIuaWRcbiAgKi9cbiAgYnVpbGRJZCAoaGVscGVyVVJMLCBrZWVwRXh0ZW5zaW9uID0gZmFsc2UpIHtcbiAgICBsZXQgcmVnID0gbmV3IFJlZ0V4cCgnXicgKyB0aGlzLnJvb3QgKyAnLycsICdpJylcblxuICAgIGlmICghaGVscGVyVVJMLm1hdGNoKHJlZykpIHtcbiAgICAgIGhlbHBlclVSTCA9IGJhc2VuYW1lKGhlbHBlclVSTClcbiAgICB9XG5cbiAgICBsZXQgYmFzZSA9IGhlbHBlclVSTC5yZXBsYWNlKHJlZywgJycpXG5cbiAgICBpZiAoYmFzZS5tYXRjaCgvXFwvaW5kZXgkL2kpKSB7XG4gICAgICBiYXNlID0gYmFzZS5yZXBsYWNlKC9cXC9pbmRleCQvaSwgJycpXG4gICAgfVxuXG4gICAgcmV0dXJuIGtlZXBFeHRlbnNpb24gPyBiYXNlIDogYmFzZS5yZXBsYWNlKC9cXC5cXHcrJC9pLCAnJylcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW4gYSBoZWxwZXIgbG9hZGVyIGZ1bmN0aW9uIGZvciB0aGlzIHJlZ2lzdHJ5LlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBhIGZ1bmN0aW9uIHdoaWNoIGlzIGFib3V0IHRvIGxvYWQgaGVscGVycyBmb3IgdXNcbiAgICogQHBhcmFtIHtPYmplY3R9IGxvY2FscyBhbiBvYmplY3QgY29udGFpbmluZyB2YXJpYWJsZXMgdG8gaW5qZWN0IGludG8gc2NvcGVcbiAgICpcbiAgICogVGhpcyB3aWxsIHJ1biB0aGUgcmVxdWlyZWQgZnVuY3Rpb24gaW4gYSBzcGVjaWFsIGNvbnRleHRcbiAgICogd2hlcmUgY2VydGFpbiBzdWdhciBpcyBpbmplY3RlZCBpbnRvIHRoZSBnbG9iYWwgc2NvcGUuXG4gICAqXG4gICAqIFRoZXNlIGxvYWRlciBmdW5jdGlvbnMgY2FuIGV4cGVjdCB0byBoYXZlIHRoZSBmb2xsb3dpbmcgaW4gc2NvcGU6XG4gICAqXG4gICAqIC0gcmVnaXN0cnkgLSB0aGlzXG4gICAqIC0gW2hlbHBlclR5cGVdIC0gYSB2YXJpYWJsZSBuYW1lZCBhY3Rpb24sIG1vZGVsLCBleHBvcnRlciwgcGx1Z2luLCBvciB3aGF0ZXZlclxuICAgKiAtIGxvYWQgLSBhIGZ1bmN0aW9uIHRvIGxvYWQgaW4gYSB1cmkuIHRoaXMubG9hZC5iaW5kKHJlZ2lzdHJ5KVxuICAgKlxuICAqL1xuICBydW5Mb2FkZXIgKGZuLCBsb2NhbHMgPSB7fSkge1xuICAgIGxvY2FscyA9IE9iamVjdC5hc3NpZ24obG9jYWxzLCAodGhpcy5oZWxwZXIuRFNMID8gdGhpcy5oZWxwZXIuRFNMIDoge30pKVxuXG4gICAgbG9jYWxzLnV0aWwgPSB1dGlsXG5cbiAgICBpZiAodGhpcy5ob3N0ICYmIHRoaXMuaG9zdC50eXBlICYmICFsb2NhbHNbdGhpcy5ob3N0LnR5cGVdKSB7XG4gICAgICBsb2NhbHNbdGhpcy5ob3N0LnR5cGVdID0gdGhpcy5ob3N0XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGVscGVyICYmIHRoaXMuaGVscGVyLm5hbWUpIHtcbiAgICAgIGxvY2Fsc1t0aGlzLmhlbHBlci5uYW1lXSA9IHRoaXMuaGVscGVyXG4gICAgfVxuXG4gICAgbG9jYWxzLnJlZ2lzdHJ5ID0gdGhpc1xuICAgIGxvY2Fscy5sb2FkID0gdGhpcy5sb2FkLmJpbmQodGhpcylcblxuICAgIHV0aWwubm9Db25mbGljdChmbiwgbG9jYWxzKSgpXG4gIH1cblxuICAvKipcbiAgICogTG9hZCBhIGhlbHBlciBieSBpdHMgVVJJIG9yIFBhdGguXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBUaGlzIHdpbGwgcmVxdWlyZSB0aGUgaGVscGVyIGluIGEgc3BlY2lhbCBjb250ZXh0IHdoZXJlIGNlcnRhaW5cbiAgICogb2JqZWN0cyBhcmUgaW5qZWN0ZWQgaW4gdGhlIGdsb2JhbCBzY29wZS4gVGhpcyBtYWtlcyBpdCBlYXNpZXIgdG9cbiAgICogd3JpdGUgaGVscGVycyBieSBwcm92aWRpbmcgdGhlbSB3aXRoIGEgc3BlY2lmaWMgRFNMIGJhc2VkIG9uIHRoZVxuICAgKiBoZWxwZXIgdHlwZS5cbiAgICpcbiAgICogQHBhcmFtIHtVUkl9IHVyaSBhbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBoZWxwZXIganMgZmlsZVxuICAgKiBAcGFyYW0ge0hlbHBlci5pZH0gaWQgd2hhdCBpZCB0byByZWdpc3RlciB0aGlzIGhlbHBlciB1bmRlcj9cbiAgICpcbiAgICogQHNlZSBoZWxwZXJzL2RlZmluaXRpb25zL21vZGVsLmpzIGZvciBleGFtcGxlXG4gICAqL1xuICBsb2FkICh1cmksIGlkKSB7XG4gICAgY29uc3QgSGVscGVyQ2xhc3MgPSB0aGlzLmhlbHBlclxuXG4gICAgbGV0IG93bmVyID0gdGhpc1xuXG4gICAgaWQgPSBpZCB8fCB0aGlzLmJ1aWxkSWQodXJpKVxuXG4gICAgbGV0IGhlbHBlckluc3RhbmNlXG5cbiAgICB0cnkge1xuICAgICAgbGV0IHJlcXVpcmVkID0gcmVxdWlyZSh1cmkpXG4gICAgICBsZXQgY2FjaGVkID0gcmVxdWlyZS5jYWNoZVt1cmldXG4gICAgICBsZXQgZW1wdHkgPSBPYmplY3Qua2V5cyhjYWNoZWQuZXhwb3J0cykubGVuZ3RoID09PSAwXG4gICAgICBsZXQgZGVmaW5pdGlvbiA9IHRoaXMuaGVscGVyLkRlZmluaXRpb24gJiYgdGhpcy5oZWxwZXIuRGVmaW5pdGlvbi5jdXJyZW50KClcblxuICAgICAgaWYgKGVtcHR5ICYmIGRlZmluaXRpb24pIHtcbiAgICAgICAgaGVscGVySW5zdGFuY2UgPSBIZWxwZXJDbGFzcy5mcm9tRGVmaW5pdGlvbih1cmksIGRlZmluaXRpb24sIHtvd25lciwgaWQsIHJlcXVpcmVkfSlcbiAgICAgIH0gZWxzZSBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgICBoZWxwZXJJbnN0YW5jZSA9IEhlbHBlckNsYXNzLmZyb21EZWZpbml0aW9uKHVyaSwgZGVmaW5pdGlvbiwge293bmVyLCBpZCwgcmVxdWlyZWR9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGVscGVySW5zdGFuY2UgPSBuZXcgSGVscGVyQ2xhc3ModXJpLCB7b3duZXIsIGlkLCBkZWZpbml0aW9uLCByZXF1aXJlZH0pXG4gICAgICB9XG5cbiAgICAgIGlmICghaGVscGVySW5zdGFuY2UpIHtcbiAgICAgICAgdGhyb3cgKCdVaCBvaCcpXG4gICAgICB9XG5cbiAgICAgIGlkID0gaWQucmVwbGFjZSgvXFwvaW5kZXgkL2ksICcnKVxuXG4gICAgICB0aGlzLnJlZ2lzdGVyKGlkLCBoZWxwZXJJbnN0YW5jZSlcblxuICAgICAgLy8gdG9kbzogc2hvdWxkIGp1c3QgYmUgYSBtZXRob2Qgb24gZGVmaW5pdGlvblxuICAgICAgaWYgKHRoaXMuaGVscGVyLkRlZmluaXRpb24gJiYgdGhpcy5oZWxwZXIuRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24pIHtcbiAgICAgICAgIHRoaXMuaGVscGVyLkRlZmluaXRpb24uY2xlYXJEZWZpbml0aW9uKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhlbHBlckluc3RhbmNlXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBsb2FkaW5nOiAnICsgdXJpLCBlcnJvci5tZXNzYWdlKVxuICAgICAgY29uc29sZS5sb2coZXJyb3Iuc3RhY2spXG4gICAgfVxuICB9XG5cbiAgZ2V0IGFsbCAoKSB7XG4gICAgcmV0dXJuIHV0aWwudmFsdWVzKHRoaXMucmVnaXN0cnkpXG4gIH1cblxuICBmaWx0ZXIgKC4uLmFyZ3MpIHtcbiAgICAgcmV0dXJuIHRoaXMuYWxsLmZpbHRlciguLi5hcmdzKVxuICB9XG5cbiAgZ2V0IGF2YWlsYWJsZSAoKSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLnJlZ2lzdHJ5KVxuXG4gICAgaWYgKHRoaXMuZmFsbGJhY2spIHtcbiAgICAgIHJldHVybiBrZXlzLmNvbmNhdCh0aGlzLmZhbGxiYWNrLmF2YWlsYWJsZSlcbiAgICB9XG5cbiAgICByZXR1cm4ga2V5c1xuICB9XG59XG5cbmNvbnN0IF9DQUNIRSA9IHsgfVxuXG5jbGFzcyBCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IgKGNhY2hlKSB7XG4gICAgdGhpcy5jYWNoZSA9IGNhY2hlIHx8IHt9XG4gIH1cblxuICBidWlsZCAoLi4uYXJncykge1xuICAgIHJldHVybiBSZWdpc3RyeS5idWlsZCguLi5hcmdzKVxuICB9XG5cbiAgYnVpbGRBbGwgKGhvc3QsIGhlbHBlcnMsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCByb290ID0gb3B0aW9ucy5yb290IHx8IGhvc3Qucm9vdFxuICAgIGxldCBjID0gdGhpcy5jYWNoZVtob3N0LnJvb3RdID0gdGhpcy5jYWNoZVtob3N0LnJvb3RdIHx8IHsgfVxuXG4gICAgcm9vdC5zaG91bGQubm90LmJlLmVtcHR5KClcbiAgICBjLnNob3VsZC5iZS5hbi5PYmplY3RcbiAgICBoZWxwZXJzLnNob3VsZC5ub3QuYmUuZW1wdHkoKVxuXG4gICAgT2JqZWN0LmtleXMoaGVscGVycykuZm9yRWFjaCh0eXBlID0+IHtcbiAgICAgIGxldCBuYW1lID0gdXRpbC50YWJlbGl6ZSh0eXBlKVxuICAgICAgY1tuYW1lXSA9IGNbbmFtZV0gfHwgUmVnaXN0cnkuYnVpbGQoaG9zdCwgaGVscGVyc1t0eXBlXSwge25hbWUsIHJvb3Q6IGhvc3Qucm9vdH0pXG4gICAgfSlcblxuICAgIHJldHVybiBjXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgQnVpbGRlcihfQ0FDSEUpXG5cbmZ1bmN0aW9uIGJ1aWxkQXRJbnRlcmZhY2UgKGhvc3QpIHtcbiAgbGV0IGNoYWluID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuIGhvc3QubG9va3VwKGlkKVxuICB9XG5cbiAgbGV0IGV4cGFuZCA9IGhvc3QubG9hZGVkXG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGhvc3QsICdhdCcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgdmFsdWU6IGNoYWluXG4gIH0pXG5cbiAgbGV0IGlkUGF0aHMgPSBob3N0LmF2YWlsYWJsZS5jb25jYXQoW10pXG5cbiAgaWYgKGV4cGFuZCkge1xuICAgIGxldCBleHBhbmRlZCA9IGlkUGF0aHMubWFwKGlkUGF0aCA9PiBpZFBhdGguc3BsaXQoJy8nKSkuc29ydCgoYSwgYikgPT4gYS5sZW5ndGggPiBiLmxlbmd0aClcblxuICAgIGV4cGFuZGVkLmZvckVhY2gocGFydHMgPT4ge1xuICAgICAgbGV0IGlkID0gcGFydHMuam9pbignLycpXG4gICAgICBsZXQgZmlyc3QgPSBwYXJ0c1swXVxuXG4gICAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHV0aWwuYXNzaWduKGNoYWluLCB7XG4gICAgICAgICAgZ2V0IFtmaXJzdF0gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGhvc3QubG9va3VwKGlkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbGV0IGdldHRlciA9IHBhcnRzLnBvcCgpXG4gICAgICAgIGxldCBpZFBhdGggPSBwYXJ0cy5qb2luKCcuJykucmVwbGFjZSgvLS9nLCAnXycpXG4gICAgICAgIGxldCB0YXJnZXQgPSBjYXJ2ZS5nZXQoY2hhaW4sIGlkUGF0aCkgfHwgeyB9XG5cbiAgICAgICAgdXRpbC5hc3NpZ24odGFyZ2V0LCB7XG4gICAgICAgICAgZ2V0IFtnZXR0ZXJdICgpIHtcbiAgICAgICAgICAgIHJldHVybiBob3N0Lmxvb2t1cChpZClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgIGNhcnZlLnNldChjaGFpbiwgaWRQYXRoLCB0YXJnZXQpXG4gICAgICB9XG4gICAgfSlcbiAgfVxufVxuIl19