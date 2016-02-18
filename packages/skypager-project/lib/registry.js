'use strict';

var _defineEnumerableProperties2 = require('babel-runtime/helpers/defineEnumerableProperties');

var _defineEnumerableProperties3 = _interopRequireDefault(_defineEnumerableProperties2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

var _lodash = require('lodash');

var _path = require('path');

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug3.default)('skypager:registry');

var Fallbacks = {};

var Registry = (function () {
  (0, _createClass3.default)(Registry, null, [{
    key: 'build',
    value: function build(host, helper, options) {
      var registry = new Registry(host, helper, options);

      if (helper && helper.decorateRegistry) {
        helper.decorateRegistry(registry);
      }

      return registry;
    }
  }]);

  function Registry(host, helper) {
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    (0, _classCallCheck3.default)(this, Registry);

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

  (0, _createClass3.default)(Registry, [{
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

      locals = (0, _assign2.default)(locals, this.helper.DSL ? this.helper.DSL : {});
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
      var empty = (typeof required === 'undefined' ? 'undefined' : (0, _typeof3.default)(required)) === 'object' && (0, _keys2.default)(required).length === 0;
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
        var empty = (typeof required === 'undefined' ? 'undefined' : (0, _typeof3.default)(required)) === 'object' && (0, _keys2.default)(required).length === 0;
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
      var _allHelpers;

      return (_allHelpers = this.allHelpers(true)).filter.apply(_allHelpers, arguments);
    }
  }, {
    key: 'map',
    value: function map() {
      var _allHelpers2;

      return (_allHelpers2 = this.allHelpers(true)).map.apply(_allHelpers2, arguments);
    }
  }, {
    key: 'forEach',
    value: function forEach() {
      var _allHelpers3;

      return (_allHelpers3 = this.allHelpers(true)).forEach.apply(_allHelpers3, arguments);
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
      var keys = (0, _keys2.default)(this.registry);

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
    (0, _classCallCheck3.default)(this, Builder);

    this.cache = cache || {};
  }

  (0, _createClass3.default)(Builder, [{
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

      (0, _keys2.default)(helpers).filter(function (type) {
        return type !== 'default';
      }).forEach(function (type) {
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
        }, (0, _defineEnumerableProperties3.default)(_util$assign, _mutatorMap), _util$assign));
      }

      if (parts.length > 1) {
        (function () {
          var _util$assign2, _mutatorMap2;

          var getter = parts.pop();
          var idPath = parts.join('.').replace(/-/g, '_');
          var target = (0, _lodash.get)(chain, idPath) || {};

          util.assign(target, (_util$assign2 = {}, _mutatorMap2 = {}, _mutatorMap2[getter] = _mutatorMap2[getter] || {}, _mutatorMap2[getter].get = function () {
            return host.lookup(id);
          }, (0, _defineEnumerableProperties3.default)(_util$assign2, _mutatorMap2), _util$assign2));

          (0, _lodash.set)(chain, idPath, target);
        })();
      }
    });
  }
}