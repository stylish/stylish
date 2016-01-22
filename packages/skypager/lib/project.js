'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _md = require('md5');

var _md2 = _interopRequireDefault(_md);

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var _assets = require('./assets');

var Assets = _interopRequireWildcard(_assets);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

var _path = require('path');

var _debug2 = require('debug');

var _debug3 = _interopRequireDefault(_debug2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug3.default)('skypager:project');
var hide = util.hide.getter;
var lazy = util.lazy;

var HOOKS = ['contentWillInitialize', 'contentDidInitialize', 'projectWillAutoImport', 'projectDidAutoImport', 'willBuildEntities', 'didBuildEntities', 'registriesDidLoad'];

var Project = (function () {
  function Project(uri) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Project);

    debug('project created at: ' + uri);
    debug('Option keys: ' + Object.keys(options));

    uri.should.be.a.String();
    uri.should.not.be.empty();

    normalizeOptions(options);

    var project = this;

    project.uri = uri;
    project.root = (0, _path.dirname)(uri);
    project.type = options.type || 'project';

    project.hidden('options', function () {
      return options;
    });

    Object.defineProperty(project, 'manifest', {
      enumerable: false,
      value: options.manifest || {}
    });

    // autobind hooks functions passed in as options
    project.hidden('hooks', setupHooks.call(project, options.hooks));

    project.hidden('paths', paths.bind(project));

    project.hidden('registries', registries.call(project), false);

    project.name = options.name || (0, _path.basename)(project.root);

    var plugins = [];
    util.hide.getter(project, 'enabledPlugins', function () {
      return plugins;
    });

    if (options.plugins) {
      options.plugins.forEach(function (plugin) {
        if (typeof plugin === 'function') {
          plugin.call(_this, _this);
        } else {
          _this.use(plugin);
        }
      });
    }

    project.runHook('contentWillInitialize');
    // wrap the content interface in a getter but make sure
    // the documents collection is loaded and available right away
    project.hidden('content', content.call(project));

    project.runHook('contentDidInitialize');

    if (options.autoImport !== false) {
      debug('running autoimport', options.autoLoad);

      project.runHook('projectWillAutoImport');

      runImporter.call(project, {
        type: options.importerType || 'disk',
        autoLoad: options.autoLoad || {
          documents: true,
          assets: true,
          vectors: true
        }
      });

      project.runHook('projectDidAutoImport');
    }

    util.hide.getter(project, 'supportedAssetExtensions', function () {
      return Assets.Asset.SupportedExtensions;
    });

    Object.defineProperty(project, 'entities', {
      configurable: true,
      get: function get() {
        delete project.entities;
        debug('building entities');

        project.runHook('willBuildEntities');
        project.entities = entities.call(project);
        project.runHook('didBuildEntities', project, project.entities);

        return project.entities;
      }
    });
  }

  _createClass(Project, [{
    key: 'runHook',
    value: function runHook(name) {
      var project = this;
      var fn = project.hooks[name] || project[name];
      if (fn) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        fn.call.apply(fn, [project].concat(args));
      }
    }
    /**
     * A proxy object that lets you run one of the project helpers.
     *
     * @example
     *
     * project.run.importer('disk')
     * project.run.action('snapshots/save', '/path/to/snapshot.json')
     *
     */

  }, {
    key: 'at',

    /**
    * Access a document by the document id short hand
    *
    * Documents are the most important part of a Skypager project, so make it easy to access them
    *
    */
    value: function at(documentId) {
      return this.documents.at(documentId);
    }

    /**
    * This is a system for resolving paths in the project tree to the
    * appropriate helper, or resolving paths to the links to these paths
    * in some other system (like a web site)
    */

  }, {
    key: 'use',

    /**
    * Use a plugin from the plugins registry
    *
    */
    value: function use() {
      var _this2 = this;

      for (var _len2 = arguments.length, plugins = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        plugins[_key2] = arguments[_key2];
      }

      plugins.map(function (plugin) {
        var pluginConfig = _this2.plugins.lookup(plugin);

        if (pluginConfig && pluginConfig.api && pluginConfig.api.modify) {
          pluginConfig.api.modify(_this2);
        } else {
          if (typeof pluginConfig.api === 'function') {
            pluginConfig.api.call(_this2, _this2, pluginConfig);
          }
        }

        _this2.enabledPlugins.push(plugin);
      });
    }

    /*
    * Aliases to create hidden and lazy getters on the project
    */

  }, {
    key: 'hidden',
    value: function hidden() {
      var _util$hidden;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      return (_util$hidden = util.hidden).getter.apply(_util$hidden, [this].concat(args));
    }
  }, {
    key: 'lazy',
    value: function lazy() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      return util.lazy.apply(util, [this].concat(args));
    }

    /**
     * build a path from a base (e.g. documents, models, build)
     * using path.join
     */

  }, {
    key: 'path',
    value: function path(base) {
      for (var _len5 = arguments.length, rest = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        rest[_key5 - 1] = arguments[_key5];
      }

      return _path.join.apply(undefined, [this.paths[base]].concat(rest));
    }

    /**
    * Collection Accessor Methods
    *
    * These can be used to access document collections within the project
    */

  }, {
    key: 'run',
    get: function get() {
      var project = this;

      return {
        action: function action() {
          var _project$actions;

          return (_project$actions = project.actions).run.apply(_project$actions, arguments);
        },
        context: function context() {
          var _project$contexts;

          return (_project$contexts = project.contexts).run.apply(_project$contexts, arguments);
        },
        importer: function importer(type) {
          var _project$importers;

          for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            args[_key6 - 1] = arguments[_key6];
          }

          return (_project$importers = project.importers).run.apply(_project$importers, [type || project.options.importer || 'disk'].concat(args));
        },
        exporter: function exporter(type) {
          var _project$exporters;

          for (var _len7 = arguments.length, args = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
            args[_key7 - 1] = arguments[_key7];
          }

          return (_project$exporters = project.exporters).run.apply(_project$exporters, [type || project.options.exporter || 'snapshot'].concat(args));
        },
        model: function model() {
          var _project$models;

          return (_project$models = project.models).run.apply(_project$models, arguments);
        },
        renderer: function renderer() {
          var _project$renderers;

          return (_project$renderers = project.renderers).run.apply(_project$renderers, arguments);
        },
        view: function view() {
          var _project$views;

          return (_project$views = project.views).run.apply(_project$views, arguments);
        }
      };
    }
  }, {
    key: 'assetManifest',
    get: function get() {
      return this.exporters.run('asset_manifest', {
        project: this
      });
    }

    /**
     * Returns an array of all of this project's content collections.
     */

  }, {
    key: 'collections',
    get: function get() {
      return util.values(this.content);
    }
  }, {
    key: 'allAssets',
    get: function get() {
      return util.flatten(this.collections.map(function (c) {
        return c.all;
      }));
    }
  }, {
    key: 'assetPaths',
    get: function get() {
      return this.allAssets.map(function (a) {
        return a.paths.project;
      });
    }
  }, {
    key: 'resolve',
    get: function get() {
      return this.resolver;
    }

    /**
    * @alias Project#resolve
    */

  }, {
    key: 'resolver',
    get: function get() {
      return _resolver2.default.call(this);
    }
  }, {
    key: 'docs',
    get: function get() {
      return this.documents;
    }
  }, {
    key: 'documents',
    get: function get() {
      return this.content.documents;
    }
  }, {
    key: 'data_sources',
    get: function get() {
      return this.content.data_sources;
    }
  }, {
    key: 'actions',
    get: function get() {
      return this.registries.actions;
    }
  }, {
    key: 'contexts',
    get: function get() {
      return this.registries.contexts;
    }
  }, {
    key: 'exporters',
    get: function get() {
      return this.registries.exporters;
    }
  }, {
    key: 'importers',
    get: function get() {
      return this.registries.importers;
    }
  }, {
    key: 'plugins',
    get: function get() {
      return this.registries.plugins;
    }
  }, {
    key: 'models',
    get: function get() {
      return this.registries.models;
    }
  }, {
    key: 'stores',
    get: function get() {
      return this.registries.stores;
    }
  }, {
    key: 'renderers',
    get: function get() {
      return this.registries.renderers;
    }
  }, {
    key: 'views',
    get: function get() {
      return this.registries.views;
    }
  }]);

  return Project;
})();

module.exports = Project;

function paths() {
  var project = this;

  var conventional = {
    assets: (0, _path.join)(this.root, 'assets'),
    actions: (0, _path.join)(this.root, 'actions'),
    contexts: (0, _path.join)(this.root, 'contexts'),
    data_sources: (0, _path.join)(this.root, 'data'),
    documents: (0, _path.join)(this.root, 'docs'),
    exporters: (0, _path.join)(this.root, 'exporters'),
    importers: (0, _path.join)(this.root, 'importers'),
    models: (0, _path.join)(this.root, 'models'),
    plugins: (0, _path.join)(this.root, 'plugins'),
    renderers: (0, _path.join)(this.root, 'renderers'),
    vectors: (0, _path.join)(this.root, 'assets'),
    images: (0, _path.join)(this.root, 'assets'),
    scripts: (0, _path.join)(this.root, 'assets'),
    stylesheets: (0, _path.join)(this.root, 'assets'),
    manifest: (0, _path.join)(this.root, 'package.json'),
    cache: (0, _path.join)(this.root, 'tmp', 'cache'),
    logs: (0, _path.join)(this.root, 'log'),
    build: (0, _path.join)(this.root, 'dist')
  };

  var custom = project.options.paths || project.manifest.paths || {};

  return util.assign(conventional, custom);
}

function content() {
  var project = this;
  var collections = buildContentCollectionsManually.call(project);

  return collections;
}

function runImporter() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = this;
  var collections = project.collections;
  var autoLoad = options.autoLoad;
  var importer = options.importer;

  debug('import starting');
  var result = project.importers.run(importer || 'disk', { project: this, collections: this.content, autoLoad: autoLoad });
  debug('import finishing');

  return result;
}

function buildContentCollectionsManually() {
  var project = this;
  var paths = project.paths;

  var Asset = Assets.Asset;
  var DataSource = Assets.DataSource;
  var Document = Assets.Document;
  var Image = Assets.Image;
  var Script = Assets.Script;
  var Stylesheet = Assets.Stylesheet;
  var Vector = Assets.Vector;

  return {
    assets: Asset.createCollection(this, false),
    data_sources: DataSource.createCollection(this, false),
    documents: Document.createCollection(this, false),
    images: Image.createCollection(this, false),
    scripts: Script.createCollection(this, false),
    stylesheets: Stylesheet.createCollection(this, false),
    vectors: Vector.createCollection(this, false)
  };
}

function stores() {
  var project = this;
}

function registries() {
  var project = this;
  var root = project.root;

  var registries = _registry2.default.buildAll(project, Helpers, { root: root });

  project.runHook('registriesDidLoad', registries);

  return registries;
}

function entities() {
  var _this3 = this;

  var modelNames = ['outline', 'page'].concat(this.models.available);

  return modelNames.reduce(function (memo, id) {
    var _util$tabelize, _Object$assign, _mutatorMap;

    var model = _this3.models.lookup(id);
    var entities = model.entities = model.entities || {};

    Object.assign(memo, (_Object$assign = {}, _util$tabelize = util.tabelize(util.underscore(model.name)), _mutatorMap = {}, _mutatorMap[_util$tabelize] = _mutatorMap[_util$tabelize] || {}, _mutatorMap[_util$tabelize].get = function () {
      return entities;
    }, _defineEnumerableProperties(_Object$assign, _mutatorMap), _Object$assign));

    return memo;
  }, {});
}

function setupHooks() {
  var hooks = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = this;

  return Object.keys(hooks).reduce(function (memo, hook) {
    var fn = hooks[hook];

    if (typeof fn === 'function') {
      memo[hook] = fn.bind(project);
    }

    return memo;
  }, {});
}

function normalizeOptions() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (options.manifest && options.manifest.skypager) {
    options = Object.assign(options, options.manifest.skypager);
  }

  return options;
}
//# sourceMappingURL=data:application/json;base64,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RSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTs7QUFFcEIsUUFBSSxPQUFPLEVBQUUsS0FBSyxVQUFVLEVBQUU7QUFDNUIsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDOUI7O0FBRUQsV0FBTyxJQUFJLENBQUE7R0FDWixFQUFFLEVBQUUsQ0FBQyxDQUFBO0NBQ1A7O0FBRUQsU0FBUyxnQkFBZ0IsR0FBZ0I7TUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3JDLE1BQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtBQUNqRCxXQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQUM1RDs7QUFFRCxTQUFPLE9BQU8sQ0FBQTtDQUNmIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2t5cGFnZXIgZnJvbSAnLi9pbmRleCdcbmltcG9ydCBtZDUgZnJvbSAnbWQ1J1xuXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi9yZWdpc3RyeSdcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vY29sbGVjdGlvbidcbmltcG9ydCByZXNvbHZlciBmcm9tICcuL3Jlc29sdmVyJ1xuXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCAqIGFzIEFzc2V0cyBmcm9tICcuL2Fzc2V0cydcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsJ1xuXG5pbXBvcnQgeyByZXNvbHZlLCBkaXJuYW1lLCBqb2luLCBiYXNlbmFtZSwgZXh0bmFtZSB9IGZyb20gJ3BhdGgnXG5cbmltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5cbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdza3lwYWdlcjpwcm9qZWN0JylcbmNvbnN0IGhpZGUgPSB1dGlsLmhpZGUuZ2V0dGVyXG5jb25zdCBsYXp5ID0gdXRpbC5sYXp5XG5cbmNvbnN0IEhPT0tTID0gW1xuICAnY29udGVudFdpbGxJbml0aWFsaXplJyxcbiAgJ2NvbnRlbnREaWRJbml0aWFsaXplJyxcbiAgJ3Byb2plY3RXaWxsQXV0b0ltcG9ydCcsXG4gICdwcm9qZWN0RGlkQXV0b0ltcG9ydCcsXG4gICd3aWxsQnVpbGRFbnRpdGllcycsXG4gICdkaWRCdWlsZEVudGl0aWVzJyxcbiAgJ3JlZ2lzdHJpZXNEaWRMb2FkJ1xuXVxuXG5jbGFzcyBQcm9qZWN0IHtcbiAgY29uc3RydWN0b3IgKHVyaSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgZGVidWcoJ3Byb2plY3QgY3JlYXRlZCBhdDogJyArIHVyaSlcbiAgICBkZWJ1ZygnT3B0aW9uIGtleXM6ICcgKyBPYmplY3Qua2V5cyhvcHRpb25zKSlcblxuICAgIHVyaS5zaG91bGQuYmUuYS5TdHJpbmcoKVxuICAgIHVyaS5zaG91bGQubm90LmJlLmVtcHR5KClcblxuICAgIG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucylcblxuICAgIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gICAgcHJvamVjdC51cmkgPSB1cmlcbiAgICBwcm9qZWN0LnJvb3QgPSBkaXJuYW1lKHVyaSlcbiAgICBwcm9qZWN0LnR5cGUgPSBvcHRpb25zLnR5cGUgfHwgJ3Byb2plY3QnXG5cbiAgICBwcm9qZWN0LmhpZGRlbignb3B0aW9ucycsICgpID0+IG9wdGlvbnMpXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvamVjdCwgJ21hbmlmZXN0Jywge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogb3B0aW9ucy5tYW5pZmVzdCB8fCB7fVxuICAgIH0pXG5cbiAgICAvLyBhdXRvYmluZCBob29rcyBmdW5jdGlvbnMgcGFzc2VkIGluIGFzIG9wdGlvbnNcbiAgICBwcm9qZWN0LmhpZGRlbignaG9va3MnLCBzZXR1cEhvb2tzLmNhbGwocHJvamVjdCwgb3B0aW9ucy5ob29rcykpXG5cbiAgICBwcm9qZWN0LmhpZGRlbigncGF0aHMnLCBwYXRocy5iaW5kKHByb2plY3QpKVxuXG4gICAgcHJvamVjdC5oaWRkZW4oJ3JlZ2lzdHJpZXMnLCByZWdpc3RyaWVzLmNhbGwocHJvamVjdCksIGZhbHNlKVxuXG4gICAgcHJvamVjdC5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IGJhc2VuYW1lKHByb2plY3Qucm9vdClcblxuICAgIGNvbnN0IHBsdWdpbnMgPSBbIF1cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHByb2plY3QsICdlbmFibGVkUGx1Z2lucycsICgpID0+IHBsdWdpbnMpXG5cbiAgICBpZiAob3B0aW9ucy5wbHVnaW5zKSB7XG4gICAgICBvcHRpb25zLnBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgICBpZiAodHlwZW9mKHBsdWdpbikgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBwbHVnaW4uY2FsbCh0aGlzLCB0aGlzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudXNlKHBsdWdpbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBwcm9qZWN0LnJ1bkhvb2soJ2NvbnRlbnRXaWxsSW5pdGlhbGl6ZScpXG4gICAgLy8gd3JhcCB0aGUgY29udGVudCBpbnRlcmZhY2UgaW4gYSBnZXR0ZXIgYnV0IG1ha2Ugc3VyZVxuICAgIC8vIHRoZSBkb2N1bWVudHMgY29sbGVjdGlvbiBpcyBsb2FkZWQgYW5kIGF2YWlsYWJsZSByaWdodCBhd2F5XG4gICAgcHJvamVjdC5oaWRkZW4oJ2NvbnRlbnQnLCBjb250ZW50LmNhbGwocHJvamVjdCkpXG5cbiAgICBwcm9qZWN0LnJ1bkhvb2soJ2NvbnRlbnREaWRJbml0aWFsaXplJylcblxuICAgIGlmIChvcHRpb25zLmF1dG9JbXBvcnQgIT09IGZhbHNlKSB7XG4gICAgICBkZWJ1ZygncnVubmluZyBhdXRvaW1wb3J0Jywgb3B0aW9ucy5hdXRvTG9hZClcblxuICAgICAgcHJvamVjdC5ydW5Ib29rKCdwcm9qZWN0V2lsbEF1dG9JbXBvcnQnKVxuXG4gICAgICBydW5JbXBvcnRlci5jYWxsKHByb2plY3QsIHtcbiAgICAgICAgdHlwZTogKG9wdGlvbnMuaW1wb3J0ZXJUeXBlIHx8ICdkaXNrJyksXG4gICAgICAgIGF1dG9Mb2FkOiBvcHRpb25zLmF1dG9Mb2FkIHx8IHtcbiAgICAgICAgICBkb2N1bWVudHM6IHRydWUsXG4gICAgICAgICAgYXNzZXRzOiB0cnVlLFxuICAgICAgICAgIHZlY3RvcnM6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcHJvamVjdC5ydW5Ib29rKCdwcm9qZWN0RGlkQXV0b0ltcG9ydCcpXG4gICAgfVxuXG4gICAgdXRpbC5oaWRlLmdldHRlcihwcm9qZWN0LCAnc3VwcG9ydGVkQXNzZXRFeHRlbnNpb25zJywgKCkgPT4gQXNzZXRzLkFzc2V0LlN1cHBvcnRlZEV4dGVuc2lvbnMgKVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2plY3QsICdlbnRpdGllcycsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWxldGUgcHJvamVjdC5lbnRpdGllc1xuICAgICAgICBkZWJ1ZygnYnVpbGRpbmcgZW50aXRpZXMnKVxuXG4gICAgICAgIHByb2plY3QucnVuSG9vaygnd2lsbEJ1aWxkRW50aXRpZXMnKVxuICAgICAgICBwcm9qZWN0LmVudGl0aWVzID0gZW50aXRpZXMuY2FsbChwcm9qZWN0KVxuICAgICAgICBwcm9qZWN0LnJ1bkhvb2soJ2RpZEJ1aWxkRW50aXRpZXMnLCBwcm9qZWN0LCBwcm9qZWN0LmVudGl0aWVzKVxuXG4gICAgICAgIHJldHVybiBwcm9qZWN0LmVudGl0aWVzXG4gICAgICB9XG4gICAgfSlcblxuICB9XG5cbiAgcnVuSG9vayhuYW1lLCAuLi5hcmdzKSB7XG4gICAgbGV0IHByb2plY3QgPSB0aGlzXG4gICAgbGV0IGZuID0gcHJvamVjdC5ob29rc1tuYW1lXSB8fCBwcm9qZWN0W25hbWVdXG4gICAgaWYgKGZuKSB7IGZuLmNhbGwocHJvamVjdCwgLi4uYXJncykgfVxuICB9XG4gIC8qKlxuICAgKiBBIHByb3h5IG9iamVjdCB0aGF0IGxldHMgeW91IHJ1biBvbmUgb2YgdGhlIHByb2plY3QgaGVscGVycy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogcHJvamVjdC5ydW4uaW1wb3J0ZXIoJ2Rpc2snKVxuICAgKiBwcm9qZWN0LnJ1bi5hY3Rpb24oJ3NuYXBzaG90cy9zYXZlJywgJy9wYXRoL3RvL3NuYXBzaG90Lmpzb24nKVxuICAgKlxuICAgKi9cbiAgZ2V0IHJ1bigpe1xuICAgIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbjogZnVuY3Rpb24gYWN0aW9uKC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QuYWN0aW9ucy5ydW4oLi4uYXJncykgfSxcbiAgICAgIGNvbnRleHQ6IGZ1bmN0aW9uIGNvbnRleHQoLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5jb250ZXh0cy5ydW4oLi4uYXJncykgfSxcbiAgICAgIGltcG9ydGVyOiBmdW5jdGlvbiBpbXBvcnRlcih0eXBlLCAuLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LmltcG9ydGVycy5ydW4oKHR5cGUgfHwgcHJvamVjdC5vcHRpb25zLmltcG9ydGVyIHx8ICdkaXNrJyksIC4uLmFyZ3MpIH0sXG4gICAgICBleHBvcnRlcjogZnVuY3Rpb24gZXhwb3J0ZXIodHlwZSwgLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5leHBvcnRlcnMucnVuKCh0eXBlIHx8IHByb2plY3Qub3B0aW9ucy5leHBvcnRlciB8fCAnc25hcHNob3QnKSwgLi4uYXJncykgfSxcbiAgICAgIG1vZGVsOiBmdW5jdGlvbiBtb2RlbCguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0Lm1vZGVscy5ydW4oLi4uYXJncykgfSxcbiAgICAgIHJlbmRlcmVyOiBmdW5jdGlvbiByZW5kZXJlciguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LnJlbmRlcmVycy5ydW4oLi4uYXJncykgfSxcbiAgICAgIHZpZXc6IGZ1bmN0aW9uIHZpZXcoLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC52aWV3cy5ydW4oLi4uYXJncykgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBhc3NldE1hbmlmZXN0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5leHBvcnRlcnMucnVuKCdhc3NldF9tYW5pZmVzdCcsIHtcbiAgICAgIHByb2plY3Q6IHRoaXNcbiAgICB9KVxuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgb2YgdGhpcyBwcm9qZWN0J3MgY29udGVudCBjb2xsZWN0aW9ucy5cbiAgICovXG4gIGdldCBjb2xsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gdXRpbC52YWx1ZXModGhpcy5jb250ZW50KVxuICB9XG5cbiAgZ2V0IGFsbEFzc2V0cyAoKSB7XG4gICAgcmV0dXJuIHV0aWwuZmxhdHRlbih0aGlzLmNvbGxlY3Rpb25zLm1hcChjID0+IGMuYWxsKSlcbiAgfVxuXG4gIGdldCBhc3NldFBhdGhzICgpe1xuICAgIHJldHVybiB0aGlzLmFsbEFzc2V0cy5tYXAoYSA9PiBhLnBhdGhzLnByb2plY3QpXG4gIH1cblxuICAvKipcbiAgKiBBY2Nlc3MgYSBkb2N1bWVudCBieSB0aGUgZG9jdW1lbnQgaWQgc2hvcnQgaGFuZFxuICAqXG4gICogRG9jdW1lbnRzIGFyZSB0aGUgbW9zdCBpbXBvcnRhbnQgcGFydCBvZiBhIFNreXBhZ2VyIHByb2plY3QsIHNvIG1ha2UgaXQgZWFzeSB0byBhY2Nlc3MgdGhlbVxuICAqXG4gICovXG4gICBhdCAoZG9jdW1lbnRJZCkge1xuICAgICByZXR1cm4gdGhpcy5kb2N1bWVudHMuYXQoZG9jdW1lbnRJZClcbiAgIH1cblxuICAvKipcbiAgKiBUaGlzIGlzIGEgc3lzdGVtIGZvciByZXNvbHZpbmcgcGF0aHMgaW4gdGhlIHByb2plY3QgdHJlZSB0byB0aGVcbiAgKiBhcHByb3ByaWF0ZSBoZWxwZXIsIG9yIHJlc29sdmluZyBwYXRocyB0byB0aGUgbGlua3MgdG8gdGhlc2UgcGF0aHNcbiAgKiBpbiBzb21lIG90aGVyIHN5c3RlbSAobGlrZSBhIHdlYiBzaXRlKVxuICAqL1xuICBnZXQgcmVzb2x2ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZXJcbiAgfVxuXG4gIC8qKlxuICAqIEBhbGlhcyBQcm9qZWN0I3Jlc29sdmVcbiAgKi9cbiAgZ2V0IHJlc29sdmVyICgpIHtcbiAgICByZXR1cm4gcmVzb2x2ZXIuY2FsbCh0aGlzKVxuICB9XG5cbiAgLyoqXG4gICogVXNlIGEgcGx1Z2luIGZyb20gdGhlIHBsdWdpbnMgcmVnaXN0cnlcbiAgKlxuICAqL1xuICB1c2UgKC4uLnBsdWdpbnMpIHtcbiAgICBwbHVnaW5zLm1hcChwbHVnaW4gPT4ge1xuICAgICAgbGV0IHBsdWdpbkNvbmZpZyA9IHRoaXMucGx1Z2lucy5sb29rdXAocGx1Z2luKVxuXG4gICAgICBpZiAocGx1Z2luQ29uZmlnICYmIHBsdWdpbkNvbmZpZy5hcGkgJiYgcGx1Z2luQ29uZmlnLmFwaS5tb2RpZnkpIHtcbiAgICAgICAgcGx1Z2luQ29uZmlnLmFwaS5tb2RpZnkodGhpcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGx1Z2luQ29uZmlnLmFwaSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHBsdWdpbkNvbmZpZy5hcGkuY2FsbCh0aGlzLCB0aGlzLCBwbHVnaW5Db25maWcpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5lbmFibGVkUGx1Z2lucy5wdXNoKHBsdWdpbilcbiAgICB9KVxuICB9XG5cbiAgLypcbiAgKiBBbGlhc2VzIHRvIGNyZWF0ZSBoaWRkZW4gYW5kIGxhenkgZ2V0dGVycyBvbiB0aGUgcHJvamVjdFxuICAqL1xuICBoaWRkZW4gKC4uLmFyZ3MpIHsgcmV0dXJuIHV0aWwuaGlkZGVuLmdldHRlcih0aGlzLCAuLi5hcmdzKSB9XG4gIGxhenkgKC4uLmFyZ3MpIHsgcmV0dXJuIHV0aWwubGF6eSh0aGlzLCAuLi5hcmdzKSB9XG5cbiAgLyoqXG4gICAqIGJ1aWxkIGEgcGF0aCBmcm9tIGEgYmFzZSAoZS5nLiBkb2N1bWVudHMsIG1vZGVscywgYnVpbGQpXG4gICAqIHVzaW5nIHBhdGguam9pblxuICAgKi9cbiAgcGF0aCAoYmFzZSwgLi4ucmVzdCkge1xuICAgIHJldHVybiBqb2luKHRoaXMucGF0aHNbYmFzZV0sIC4uLnJlc3QpXG4gIH1cblxuICAvKipcbiAgKiBDb2xsZWN0aW9uIEFjY2Vzc29yIE1ldGhvZHNcbiAgKlxuICAqIFRoZXNlIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyBkb2N1bWVudCBjb2xsZWN0aW9ucyB3aXRoaW4gdGhlIHByb2plY3RcbiAgKi9cbiAgZ2V0IGRvY3MgKCkge1xuICAgIHJldHVybiB0aGlzLmRvY3VtZW50c1xuICB9XG5cbiAgZ2V0IGRvY3VtZW50cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudC5kb2N1bWVudHNcbiAgfVxuXG4gIGdldCBkYXRhX3NvdXJjZXMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YV9zb3VyY2VzXG4gIH1cblxuICBnZXQgZGF0YV9zb3VyY2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50LmRhdGFfc291cmNlc1xuICB9XG5cbiAgZ2V0IGNvbGxlY3Rpb25zICgpIHtcbiAgICByZXR1cm4gdXRpbC52YWx1ZXModGhpcy5jb250ZW50KVxuICB9XG5cbiAgZ2V0IGFjdGlvbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuYWN0aW9uc1xuICB9XG5cbiAgZ2V0IGNvbnRleHRzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmNvbnRleHRzXG4gIH1cblxuICBnZXQgZXhwb3J0ZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmV4cG9ydGVyc1xuICB9XG5cbiAgZ2V0IGltcG9ydGVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5pbXBvcnRlcnNcbiAgfVxuXG4gIGdldCBwbHVnaW5zICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnBsdWdpbnNcbiAgfVxuXG4gIGdldCBtb2RlbHMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMubW9kZWxzXG4gIH1cblxuICBnZXQgc3RvcmVzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnN0b3Jlc1xuICB9XG5cbiAgZ2V0IHJlbmRlcmVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5yZW5kZXJlcnNcbiAgfVxuXG4gIGdldCB2aWV3cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy52aWV3c1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvamVjdFxuXG5mdW5jdGlvbiBwYXRocyAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gIGxldCBjb252ZW50aW9uYWwgPSB7XG4gICAgYXNzZXRzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIGFjdGlvbnM6IGpvaW4odGhpcy5yb290LCAnYWN0aW9ucycpLFxuICAgIGNvbnRleHRzOiBqb2luKHRoaXMucm9vdCwgJ2NvbnRleHRzJyksXG4gICAgZGF0YV9zb3VyY2VzOiBqb2luKHRoaXMucm9vdCwgJ2RhdGEnKSxcbiAgICBkb2N1bWVudHM6IGpvaW4odGhpcy5yb290LCAnZG9jcycpLFxuICAgIGV4cG9ydGVyczogam9pbih0aGlzLnJvb3QsICdleHBvcnRlcnMnKSxcbiAgICBpbXBvcnRlcnM6IGpvaW4odGhpcy5yb290LCAnaW1wb3J0ZXJzJyksXG4gICAgbW9kZWxzOiBqb2luKHRoaXMucm9vdCwgJ21vZGVscycpLFxuICAgIHBsdWdpbnM6IGpvaW4odGhpcy5yb290LCAncGx1Z2lucycpLFxuICAgIHJlbmRlcmVyczogam9pbih0aGlzLnJvb3QsICdyZW5kZXJlcnMnKSxcbiAgICB2ZWN0b3JzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIGltYWdlczogam9pbih0aGlzLnJvb3QsICdhc3NldHMnKSxcbiAgICBzY3JpcHRzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIHN0eWxlc2hlZXRzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIG1hbmlmZXN0OiBqb2luKHRoaXMucm9vdCwgJ3BhY2thZ2UuanNvbicpLFxuICAgIGNhY2hlOiBqb2luKHRoaXMucm9vdCwgJ3RtcCcsICdjYWNoZScpLFxuICAgIGxvZ3M6IGpvaW4odGhpcy5yb290LCAnbG9nJyksXG4gICAgYnVpbGQ6IGpvaW4odGhpcy5yb290LCAnZGlzdCcpXG4gIH1cblxuICBsZXQgY3VzdG9tID0gcHJvamVjdC5vcHRpb25zLnBhdGhzIHx8IHByb2plY3QubWFuaWZlc3QucGF0aHMgfHwge31cblxuICByZXR1cm4gdXRpbC5hc3NpZ24oY29udmVudGlvbmFsLCBjdXN0b20pXG59XG5cbmZ1bmN0aW9uIGNvbnRlbnQgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IGNvbGxlY3Rpb25zID0gYnVpbGRDb250ZW50Q29sbGVjdGlvbnNNYW51YWxseS5jYWxsKHByb2plY3QpXG5cbiAgcmV0dXJuIGNvbGxlY3Rpb25zXG59XG5cbmZ1bmN0aW9uIHJ1bkltcG9ydGVyIChvcHRpb25zID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCBjb2xsZWN0aW9ucyA9IHByb2plY3QuY29sbGVjdGlvbnNcbiAgbGV0IHsgYXV0b0xvYWQsIGltcG9ydGVyIH0gPSBvcHRpb25zXG5cbiAgZGVidWcoJ2ltcG9ydCBzdGFydGluZycpXG4gIGxldCByZXN1bHQgPSBwcm9qZWN0LmltcG9ydGVycy5ydW4oaW1wb3J0ZXIgfHwgJ2Rpc2snLCB7IHByb2plY3Q6IHRoaXMsIGNvbGxlY3Rpb25zOiB0aGlzLmNvbnRlbnQsIGF1dG9Mb2FkIH0pXG4gIGRlYnVnKCdpbXBvcnQgZmluaXNoaW5nJylcblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ29udGVudENvbGxlY3Rpb25zTWFudWFsbHkgKCkge1xuICBjb25zdCBwcm9qZWN0ID0gdGhpc1xuICBjb25zdCBwYXRocyA9IHByb2plY3QucGF0aHNcblxuICBsZXQgeyBBc3NldCwgRGF0YVNvdXJjZSwgRG9jdW1lbnQsIEltYWdlLCBTY3JpcHQsIFN0eWxlc2hlZXQsIFZlY3RvciB9ID0gQXNzZXRzXG5cbiAgcmV0dXJuIHtcbiAgICBhc3NldHM6IEFzc2V0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGRhdGFfc291cmNlczogRGF0YVNvdXJjZS5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBkb2N1bWVudHM6IERvY3VtZW50LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGltYWdlczogSW1hZ2UuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgc2NyaXB0czogU2NyaXB0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIHN0eWxlc2hlZXRzOiBTdHlsZXNoZWV0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIHZlY3RvcnM6IFZlY3Rvci5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0b3JlcyAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xufVxuXG5mdW5jdGlvbiByZWdpc3RyaWVzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCByb290ID0gcHJvamVjdC5yb290XG5cbiAgbGV0IHJlZ2lzdHJpZXMgPSBSZWdpc3RyeS5idWlsZEFsbChwcm9qZWN0LCBIZWxwZXJzLCB7cm9vdH0pXG5cbiAgcHJvamVjdC5ydW5Ib29rKCdyZWdpc3RyaWVzRGlkTG9hZCcsIHJlZ2lzdHJpZXMpXG5cbiAgcmV0dXJuIHJlZ2lzdHJpZXNcbn1cblxuZnVuY3Rpb24gZW50aXRpZXMoKSB7XG4gIGxldCBtb2RlbE5hbWVzID0gWydvdXRsaW5lJywncGFnZSddLmNvbmNhdCh0aGlzLm1vZGVscy5hdmFpbGFibGUpXG5cbiAgcmV0dXJuIG1vZGVsTmFtZXMucmVkdWNlKChtZW1vLGlkKSA9PiB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5tb2RlbHMubG9va3VwKGlkKVxuICAgIGxldCBlbnRpdGllcyA9IG1vZGVsLmVudGl0aWVzID0gbW9kZWwuZW50aXRpZXMgfHwge31cblxuICAgIE9iamVjdC5hc3NpZ24obWVtbywge1xuICAgICAgZ2V0IFt1dGlsLnRhYmVsaXplKHV0aWwudW5kZXJzY29yZShtb2RlbC5uYW1lKSldKCl7XG4gICAgICAgIHJldHVybiBlbnRpdGllc1xuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gbWVtb1xuICB9LCB7fSlcbn1cblxuZnVuY3Rpb24gc2V0dXBIb29rcyhob29rcyA9IHt9KSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhob29rcykucmVkdWNlKChtZW1vLCBob29rKSA9PiB7XG4gICAgbGV0IGZuID0gaG9va3NbaG9va11cblxuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1lbW9baG9va10gPSBmbi5iaW5kKHByb2plY3QpXG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbW9cbiAgfSwge30pXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU9wdGlvbnMgKG9wdGlvbnMgPSB7fSkge1xuICBpZiAob3B0aW9ucy5tYW5pZmVzdCAmJiBvcHRpb25zLm1hbmlmZXN0LnNreXBhZ2VyKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywgb3B0aW9ucy5tYW5pZmVzdC5za3lwYWdlcilcbiAgfVxuXG4gIHJldHVybiBvcHRpb25zXG59XG4iXX0=