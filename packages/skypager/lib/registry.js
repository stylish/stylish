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
      return Object.keys(this.registry);
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
//# sourceMappingURL=data:application/json;base64,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LE1BQU0sQ0FBQyxNQUFNLHVEQUNYLE1BQU0saUJBQU4sTUFBTSxzQkFBTixNQUFNLG9CQUFLO0FBQ2QsbUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtXQUN2QiwyRUFDRCxDQUFBO0FBQ0YsK0JBQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUE7O09BQ2pDO0tBQ0YsQ0FBQyxDQUFBO0dBQ0g7Q0FDRiIsImZpbGUiOiJyZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuKiBSZWZhY3RvcmluZyBub3RlczpcbipcbiogQ3VycmVudGx5IHRoZXJlIGlzIGEgcmVnaXN0cnkgZm9yIHRoZSBza3lwYWdlciBmcmFtZXdvcmsgYW5kIHRoZW4gcGVyIHByb2plY3QgcnJlZ2lzdHJpZXNcbipcbiogSSBzaG91bGQgbWFrZSBvbmUgcmVnaXN0cnkgZm9yIHRoZSBmcmFtZXdvcmssIGFuZCB0aGVuIGhlbHBlcnMgcmVnaXN0ZXIgdGhlbXNlbHZlcyB3aXRoIHRoZSBwcm9qZWN0IHRoZXkgYmVsb25nIHRvXG4qIGFuZCBieSBkZWZhdWx0IG9ubHkgZ2V0IGZyYW1ld29yayBoZWxwZXJzIGFuZCBwcm9qZWN0IGhlbHBlcnMgYXZhaWxhYmxlIHRvIHRoZW0uXG4qXG4qL1xuaW1wb3J0IFNreXBhZ2VyIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcbmltcG9ydCBjYXJ2ZSBmcm9tICdvYmplY3QtcGF0aCdcblxuaW1wb3J0IHsgam9pbiwgcmVzb2x2ZSwgZGlybmFtZSwgcmVsYXRpdmUgfSBmcm9tICdwYXRoJ1xuXG5cbmltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1Zygnc2t5cGFnZXI6cmVnaXN0cnknKVxuXG5jb25zdCBGYWxsYmFja3MgPSB7fVxuXG5jbGFzcyBSZWdpc3RyeSB7XG4gIHN0YXRpYyBidWlsZCAoaG9zdCwgaGVscGVyLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdpc3RyeShob3N0LCBoZWxwZXIsIG9wdGlvbnMpXG4gIH1cblxuICBjb25zdHJ1Y3RvciAoaG9zdCwgaGVscGVyLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAoIWhvc3QgfHwgIWhlbHBlcikge1xuICAgICAgdGhyb3cgKCdNdXN0IHN1cHBseSBhIHJlZ2lzdHJ5IHdpdGggYSBob3N0IGFuZCBhIGhlbHBlciBjbGFzcycpXG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IHV0aWwudGFiZWxpemUoaGVscGVyLm5hbWUgfHwgJycpXG4gICAgdGhpcy5yb290ID0gam9pbigob3B0aW9ucy5yb290IHx8IGhvc3Qucm9vdCksIHRoaXMubmFtZSlcblxuICAgIGxldCByZWdpc3RyeSA9IHsgfVxuICAgIGxldCBhbGlhc2VzID0geyB9XG5cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdob3N0JywgKCkgPT4gaG9zdClcbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdhbGlhc2VzJywgKCkgPT4gYWxpYXNlcylcbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdyZWdpc3RyeScsICgpID0+IHJlZ2lzdHJ5KVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2hlbHBlcicsICgpID0+IGhlbHBlcilcblxuICAgIGlmIChob3N0LnR5cGUgPT09ICdmcmFtZXdvcmsnKSB7XG4gICAgICBGYWxsYmFja3NbdGhpcy5uYW1lXSA9IHRoaXNcbiAgICB9XG5cbiAgICBsZXQgaW5kZXhTY3JpcHRcblxuICAgIHRoaXMubG9hZGVkID0gZmFsc2VcblxuICAgIHRyeSB7XG4gICAgICBpbmRleFNjcmlwdCA9IHJlcXVpcmUucmVzb2x2ZShqb2luKHRoaXMucm9vdCwgJ2luZGV4LmpzJykpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcblxuICAgIH1cblxuICAgIGlmIChpbmRleFNjcmlwdCkge1xuICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlXG4gICAgICB0aGlzLnJ1bkxvYWRlcihyZXF1aXJlKGluZGV4U2NyaXB0KSlcbiAgICB9XG5cbiAgICBidWlsZEF0SW50ZXJmYWNlKHRoaXMpXG5cbiAgICB0aGlzLmxvYWRlZCA9IHRydWVcbiAgfVxuXG4gIHJlbW92ZSAoaGVscGVySWQpIHtcbiAgICBsZXQgaW5zdGFuY2UgPSB0aGlzLmxvb2t1cChoZWxwZXJJZCwgZmFsc2UpXG4gICAgaWYgKGluc3RhbmNlKSB7XG4gICAgICBpZiAoaW5zdGFuY2UubmFtZSkge1xuICAgICAgICBkZWxldGUgKHRoaXMuYWxpYXNlcywgaW5zdGFuY2UubmFtZSlcbiAgICAgIH1cblxuICAgICAgaWYgKGluc3RhbmNlLmFsaWFzZXMpIHtcbiAgICAgICAgaW5zdGFuY2UuYWxpYXNlcy5mb3JFYWNoKGEgPT4gZGVsZXRlICh0aGlzLmFsaWFzZXNbYV0pKVxuICAgICAgfVxuXG4gICAgICBkZWxldGUgKHRoaXMuYWxpYXNlc1tpbnN0YW5jZS5pZF0pXG4gICAgICBkZWxldGUgKHRoaXMucmVnaXN0cnlbaW5zdGFuY2UuaWRdKVxuICAgIH1cbiAgfVxuXG4gIHJ1biAoaGVscGVySWQsIC4uLmFyZ3MpIHtcbiAgICBsZXQgZm4gPSB0aGlzLmxvb2t1cChoZWxwZXJJZCkucnVubmVyXG4gICAgcmV0dXJuIGZuKC4uLmFyZ3MpXG4gIH1cblxuICBnZXQgZmFsbGJhY2sgKCkge1xuICAgIGlmICh0aGlzLmhvc3QudHlwZSAhPT0gJ2ZyYW1ld29yaycpIHtcbiAgICAgIHJldHVybiBGYWxsYmFja3NbdGhpcy5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIGxvb2t1cCAobmVlZGxlLCBzdHJpY3QgPSB0cnVlLCBmcm9tUHJvamVjdCkge1xuICAgIGxldCBoZWxwZXJJZCA9IHRoaXMuYWxpYXNlc1tuZWVkbGVdXG5cbiAgICBpZiAodHlwZW9mIChoZWxwZXJJZCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAodGhpcy5mYWxsYmFjaykgeyByZXR1cm4gdGhpcy5mYWxsYmFjay5sb29rdXAobmVlZGxlLCBzdHJpY3QsIHRoaXMuaG9zdCkgfVxuICAgICAgaWYgKHN0cmljdCkgeyB0aHJvdyAoJ0NvdWxkIG5vdCBmaW5kIGhlbHBlciB3aXRoIGlkOicgKyBuZWVkbGUpIH1cbiAgICB9XG5cbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5yZWdpc3RyeVtoZWxwZXJJZF1cblxuICAgIGlmIChyZXN1bHQgJiYgZnJvbVByb2plY3QpIHsgcmVzdWx0Lm9wdGlvbnMucHJvamVjdCA9IGZyb21Qcm9qZWN0IH1cblxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIHJlZ2lzdGVyIChoZWxwZXJJZCwgaGVscGVySW5zdGFuY2UpIHtcbiAgICBpZiAoIWhlbHBlckluc3RhbmNlKSB7XG4gICAgICB0aHJvdyAoJ0Vycm9yIHJlZ2lzdGVyaW5nICcgKyBoZWxwZXJJZClcbiAgICB9XG5cbiAgICB0aGlzLmFsaWFzZXNbaGVscGVySWRdID0gaGVscGVySWRcblxuICAgIGlmIChoZWxwZXJJbnN0YW5jZS5uYW1lKSB7XG4gICAgICB0aGlzLmFsaWFzZXNbaGVscGVySW5zdGFuY2UubmFtZV0gPSBoZWxwZXJJZFxuICAgIH1cblxuICAgIHRoaXMucmVnaXN0cnlbaGVscGVySWRdID0gaGVscGVySW5zdGFuY2VcblxuICAgIGhlbHBlckluc3RhbmNlLmFsaWFzZXMgJiYgaGVscGVySW5zdGFuY2UuYWxpYXNlcy5mb3JFYWNoKGFsaWFzID0+IHtcbiAgICAgIHRoaXMuYWxpYXNlc1thbGlhc10gPSBoZWxwZXJJZFxuICAgIH0pXG5cbiAgICByZXR1cm4gaGVscGVySW5zdGFuY2VcbiAgfVxuXG4gIGJ1aWxkSWQgKGhlbHBlclVSTCwga2VlcEV4dGVuc2lvbiA9IGZhbHNlKSB7XG4gICAgbGV0IHJlZyA9IG5ldyBSZWdFeHAoJ14nICsgdGhpcy5yb290ICsgJy8nLCAnaScpXG4gICAgbGV0IGJhc2UgPSBoZWxwZXJVUkwucmVwbGFjZShyZWcsICcnKVxuXG4gICAgaWYgKGJhc2UubWF0Y2goL1xcL2luZGV4JC9pKSkge1xuICAgICAgYmFzZSA9IGJhc2UucmVwbGFjZSgvXFwvaW5kZXgkL2ksICcnKVxuICAgIH1cblxuICAgIHJldHVybiBrZWVwRXh0ZW5zaW9uID8gYmFzZSA6IGJhc2UucmVwbGFjZSgvXFwuXFx3KyQvaSwgJycpXG4gIH1cblxuICBydW5Mb2FkZXIgKGZuKSB7XG4gICAgbGV0IGxvY2FscyA9IE9iamVjdC5hc3NpZ24oe30sICh0aGlzLmhlbHBlci5EU0wgPyB0aGlzLmhlbHBlci5EU0wgOiB7IH0pKVxuXG4gICAgbG9jYWxzLnV0aWwgPSB1dGlsXG5cbiAgICBpZiAodGhpcy5ob3N0ICYmIHRoaXMuaG9zdC50eXBlICYmICFsb2NhbHNbdGhpcy5ob3N0LnR5cGVdKSB7XG4gICAgICBsb2NhbHNbdGhpcy5ob3N0LnR5cGVdID0gdGhpcy5ob3N0XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGVscGVyICYmIHRoaXMuaGVscGVyLm5hbWUpIHtcbiAgICAgIGxvY2Fsc1t0aGlzLmhlbHBlci5uYW1lXSA9IHRoaXMuaGVscGVyXG4gICAgfVxuXG4gICAgbG9jYWxzLnJlZ2lzdHJ5ID0gdGhpc1xuICAgIGxvY2Fscy5sb2FkID0gdGhpcy5sb2FkLmJpbmQodGhpcylcblxuICAgIHV0aWwubm9Db25mbGljdChmbiwgbG9jYWxzKSgpXG4gIH1cblxuICBsb2FkICh1cmksIGlkKSB7XG4gICAgY29uc3QgSGVscGVyQ2xhc3MgPSB0aGlzLmhlbHBlclxuXG4gICAgbGV0IG93bmVyID0gdGhpc1xuXG4gICAgaWQgPSBpZCB8fCB0aGlzLmJ1aWxkSWQodXJpKVxuXG4gICAgbGV0IGhlbHBlckluc3RhbmNlXG5cbiAgICB0cnkge1xuICAgICAgbGV0IHJlcXVpcmVkID0gcmVxdWlyZSh1cmkpXG4gICAgICBsZXQgY2FjaGVkID0gcmVxdWlyZS5jYWNoZVt1cmldXG4gICAgICBsZXQgZW1wdHkgPSBPYmplY3Qua2V5cyhjYWNoZWQuZXhwb3J0cykubGVuZ3RoID09PSAwXG4gICAgICBsZXQgZGVmaW5pdGlvbiA9IHRoaXMuaGVscGVyLkRlZmluaXRpb24gJiYgdGhpcy5oZWxwZXIuRGVmaW5pdGlvbi5jdXJyZW50KClcblxuICAgICAgaWYgKGVtcHR5ICYmIGRlZmluaXRpb24pIHtcbiAgICAgICAgaGVscGVySW5zdGFuY2UgPSBIZWxwZXJDbGFzcy5mcm9tRGVmaW5pdGlvbih1cmksIGRlZmluaXRpb24sIHtvd25lciwgaWQsIHJlcXVpcmVkfSlcbiAgICAgIH0gZWxzZSBpZiAoZGVmaW5pdGlvbikge1xuICAgICAgICBoZWxwZXJJbnN0YW5jZSA9IEhlbHBlckNsYXNzLmZyb21EZWZpbml0aW9uKHVyaSwgZGVmaW5pdGlvbiwge293bmVyLCBpZCwgcmVxdWlyZWR9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGVscGVySW5zdGFuY2UgPSBuZXcgSGVscGVyQ2xhc3ModXJpLCB7b3duZXIsIGlkLCBkZWZpbml0aW9uLCByZXF1aXJlZH0pXG4gICAgICB9XG5cbiAgICAgIGlmICghaGVscGVySW5zdGFuY2UpIHtcbiAgICAgICAgdGhyb3cgKCdVaCBvaCcpXG4gICAgICB9XG5cbiAgICAgIGlkID0gaWQucmVwbGFjZSgvXFwvaW5kZXgkL2ksICcnKVxuXG4gICAgICB0aGlzLnJlZ2lzdGVyKGlkLCBoZWxwZXJJbnN0YW5jZSlcblxuICAgICAgaWYgKHRoaXMuaGVscGVyLkRlZmluaXRpb24gJiYgdGhpcy5oZWxwZXIuRGVmaW5pdGlvbi5jbGVhckRlZmluaXRpb24pIHtcbiAgICAgICAgIHRoaXMuaGVscGVyLkRlZmluaXRpb24uY2xlYXJEZWZpbml0aW9uKClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhlbHBlckluc3RhbmNlXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBsb2FkaW5nOiAnICsgdXJpLCBlcnJvci5tZXNzYWdlKVxuICAgIH1cbiAgfVxuXG4gIGdldCBhbGwgKCkge1xuICAgIHJldHVybiB1dGlsLnZhbHVlcyh0aGlzLnJlZ2lzdHJ5KVxuICB9XG5cbiAgZ2V0IGF2YWlsYWJsZSAoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMucmVnaXN0cnkpXG4gIH1cbn1cblxuY29uc3QgX0NBQ0hFID0geyB9XG5cbmNsYXNzIEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvciAoY2FjaGUpIHtcbiAgICB0aGlzLmNhY2hlID0gY2FjaGUgfHwge31cbiAgfVxuXG4gIGJ1aWxkICguLi5hcmdzKSB7XG4gICAgcmV0dXJuIFJlZ2lzdHJ5LmJ1aWxkKC4uLmFyZ3MpXG4gIH1cblxuICBidWlsZEFsbCAoaG9zdCwgaGVscGVycywgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHJvb3QgPSBvcHRpb25zLnJvb3QgfHwgaG9zdC5yb290XG4gICAgbGV0IGMgPSB0aGlzLmNhY2hlW2hvc3Qucm9vdF0gPSB0aGlzLmNhY2hlW2hvc3Qucm9vdF0gfHwgeyB9XG5cbiAgICByb290LnNob3VsZC5ub3QuYmUuZW1wdHkoKVxuICAgIGMuc2hvdWxkLmJlLmFuLk9iamVjdFxuICAgIGhlbHBlcnMuc2hvdWxkLm5vdC5iZS5lbXB0eSgpXG5cbiAgICBPYmplY3Qua2V5cyhoZWxwZXJzKS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgbGV0IG5hbWUgPSB1dGlsLnRhYmVsaXplKHR5cGUpXG4gICAgICBjW25hbWVdID0gY1tuYW1lXSB8fCBSZWdpc3RyeS5idWlsZChob3N0LCBoZWxwZXJzW3R5cGVdLCB7bmFtZSwgcm9vdDogaG9zdC5yb290fSlcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBCdWlsZGVyKF9DQUNIRSlcblxuZnVuY3Rpb24gYnVpbGRBdEludGVyZmFjZSAoaG9zdCkge1xuICBsZXQgY2hhaW4gPSBmdW5jdGlvbiAoaWQpIHtcbiAgICByZXR1cm4gaG9zdC5sb29rdXAoaWQpXG4gIH1cblxuICBsZXQgZXhwYW5kID0gaG9zdC5sb2FkZWRcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaG9zdCwgJ2F0Jywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogY2hhaW5cbiAgfSlcblxuICBsZXQgaWRQYXRocyA9IGhvc3QuYXZhaWxhYmxlLmNvbmNhdChbXSlcblxuICBpZiAoZXhwYW5kKSB7XG4gICAgbGV0IGV4cGFuZGVkID0gaWRQYXRocy5tYXAoaWRQYXRoID0+IGlkUGF0aC5zcGxpdCgnLycpKS5zb3J0KChhLCBiKSA9PiBhLmxlbmd0aCA+IGIubGVuZ3RoKVxuXG4gICAgZXhwYW5kZWQuZm9yRWFjaChwYXJ0cyA9PiB7XG4gICAgICBsZXQgaWQgPSBwYXJ0cy5qb2luKCcvJylcbiAgICAgIGxldCBmaXJzdCA9IHBhcnRzWzBdXG5cbiAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdXRpbC5hc3NpZ24oY2hhaW4sIHtcbiAgICAgICAgICBnZXQgW2ZpcnN0XSAoKSB7XG4gICAgICAgICAgICByZXR1cm4gaG9zdC5sb29rdXAoaWQpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgICAgICBsZXQgZ2V0dGVyID0gcGFydHMucG9wKClcbiAgICAgICAgbGV0IGlkUGF0aCA9IHBhcnRzLmpvaW4oJy4nKS5yZXBsYWNlKC8tL2csICdfJylcbiAgICAgICAgbGV0IHRhcmdldCA9IGNhcnZlLmdldChjaGFpbiwgaWRQYXRoKSB8fCB7IH1cblxuICAgICAgICB1dGlsLmFzc2lnbih0YXJnZXQsIHtcbiAgICAgICAgICBnZXQgW2dldHRlcl0gKCkge1xuICAgICAgICAgICAgcmV0dXJuIGhvc3QubG9va3VwKGlkKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgY2FydmUuc2V0KGNoYWluLCBpZFBhdGgsIHRhcmdldClcbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG4iXX0=