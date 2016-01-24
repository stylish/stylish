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

    project.__runHook('contentWillInitialize');
    // wrap the content interface in a getter but make sure
    // the documents collection is loaded and available right away
    project.hidden('content', content.call(project));

    project.__runHook('contentDidInitialize');

    if (options.autoImport !== false) {
      debug('running autoimport', options.autoLoad);

      project.__runHook('projectWillAutoImport');

      runImporter.call(project, {
        type: options.importerType || 'disk',
        autoLoad: options.autoLoad || {
          documents: true,
          assets: true,
          vectors: true
        }
      });

      project.__runHook('projectDidAutoImport');
    }

    util.hide.getter(project, 'supportedAssetExtensions', function () {
      return Assets.Asset.SupportedExtensions;
    });

    // lazy load / memoize the entity builder
    Object.defineProperty(project, 'entities', {
      configurable: true,
      get: function get() {
        delete project.entities;
        debug('building entities');

        project.__runHook('willBuildEntities');
        project.entities = entities.call(project);
        project.__runHook('didBuildEntities', project, project.entities);

        return project.entities;
      }
    });

    util.hide.getter(project, 'modelDefinitions', modelDefinitions.bind(this));
  }

  _createClass(Project, [{
    key: '__runHook',
    value: function __runHook(name) {
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
    key: 'query',
    value: function query(source, params) {
      source = ('' + source).toLowerCase();

      if (source === 'docs' || source === 'documents') {
        return this.docs.query(params);
      }

      if (source === 'data' || source === 'datasources' || source === 'data_sources') {
        return this.content.data_sources.query(params);
      }

      if (['assets', 'scripts', 'stylesheets', 'images', 'vectors'].indexOf(source) >= 0) {
        return this.content[source].query(params);
      }

      if (this.modelGroups.indexOf(source) > 0) {
        return util.filterQuery(util.values(this.entities[source]), params);
      }
    }
  }, {
    key: 'queryHelpers',
    value: function queryHelpers(source, params) {
      return this.registries[source].query(params);
    }
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
    value: function use(plugins) {
      var _this2 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (typeof plugins === 'string') {
        plugins = [plugins];
      }

      plugins.forEach(function (plugin) {
        var pluginConfig = _this2.plugins.lookup(plugin);

        if (pluginConfig && pluginConfig.api && pluginConfig.api.modify) {
          options.project = options.project || _this2;
          pluginConfig.api.modify(options);
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

    /**
     * build a path from a base (e.g. documents, models, build)
     * using path.join
     */

  }, {
    key: 'path',
    value: function path(base) {
      for (var _len4 = arguments.length, rest = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        rest[_key4 - 1] = arguments[_key4];
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

          for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            args[_key5 - 1] = arguments[_key5];
          }

          return (_project$importers = project.importers).run.apply(_project$importers, [type || project.options.importer || 'disk'].concat(args));
        },
        exporter: function exporter(type) {
          var _project$exporters;

          for (var _len6 = arguments.length, args = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
            args[_key6 - 1] = arguments[_key6];
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
    key: 'data',
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
  }, {
    key: 'modelGroups',
    get: function get() {
      return this.models.all.map(function (model) {
        return util.tabelize(util.underscore(model.name));
      });
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
    build: (0, _path.join)(this.root, 'dist'),
    public: (0, _path.join)(this.root, 'public')
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

  project.__runHook('registriesDidLoad', registries);

  return registries;
}

function modelDefinitions() {
  var _this3 = this;

  return this.models.available.reduce(function (memo, id) {
    var _util$tabelize, _Object$assign, _mutatorMap;

    var model = _this3.models.lookup(id);

    Object.assign(memo, (_Object$assign = {}, _util$tabelize = util.tabelize(util.underscore(model.name)), _mutatorMap = {}, _mutatorMap[_util$tabelize] = _mutatorMap[_util$tabelize] || {}, _mutatorMap[_util$tabelize].get = function () {
      return model.definition;
    }, _defineEnumerableProperties(_Object$assign, _mutatorMap), _Object$assign));

    return memo;
  }, {});
}

function entities() {
  var _this4 = this;

  return this.models.available.reduce(function (memo, id) {
    var _util$tabelize2, _Object$assign2, _mutatorMap2;

    var model = _this4.models.lookup(id);
    var entities = model.entities = model.entities || {};

    Object.assign(memo, (_Object$assign2 = {}, _util$tabelize2 = util.tabelize(util.underscore(model.name)), _mutatorMap2 = {}, _mutatorMap2[_util$tabelize2] = _mutatorMap2[_util$tabelize2] || {}, _mutatorMap2[_util$tabelize2].get = function () {
      return entities;
    }, _defineEnumerableProperties(_Object$assign2, _mutatorMap2), _Object$assign2));

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
//# sourceMappingURL=data:application/json;base64,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QUUsRUFBRSxDQUFDLENBQUE7Q0FDUDs7QUFFRCxTQUFTLGdCQUFnQixHQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDckMsTUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO0FBQ2pELFdBQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBQzVEOztBQUVELFNBQU8sT0FBTyxDQUFBO0NBQ2YiLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTa3lwYWdlciBmcm9tICcuL2luZGV4J1xuaW1wb3J0IG1kNSBmcm9tICdtZDUnXG5cbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuL3JlZ2lzdHJ5J1xuaW1wb3J0IENvbGxlY3Rpb24gZnJvbSAnLi9jb2xsZWN0aW9uJ1xuaW1wb3J0IHJlc29sdmVyIGZyb20gJy4vcmVzb2x2ZXInXG5cbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0ICogYXMgQXNzZXRzIGZyb20gJy4vYXNzZXRzJ1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnXG5cbmltcG9ydCB7IHJlc29sdmUsIGRpcm5hbWUsIGpvaW4sIGJhc2VuYW1lLCBleHRuYW1lIH0gZnJvbSAncGF0aCdcblxuaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcblxuY29uc3QgZGVidWcgPSBfZGVidWcoJ3NreXBhZ2VyOnByb2plY3QnKVxuY29uc3QgaGlkZSA9IHV0aWwuaGlkZS5nZXR0ZXJcbmNvbnN0IGxhenkgPSB1dGlsLmxhenlcblxuY29uc3QgSE9PS1MgPSBbXG4gICdjb250ZW50V2lsbEluaXRpYWxpemUnLFxuICAnY29udGVudERpZEluaXRpYWxpemUnLFxuICAncHJvamVjdFdpbGxBdXRvSW1wb3J0JyxcbiAgJ3Byb2plY3REaWRBdXRvSW1wb3J0JyxcbiAgJ3dpbGxCdWlsZEVudGl0aWVzJyxcbiAgJ2RpZEJ1aWxkRW50aXRpZXMnLFxuICAncmVnaXN0cmllc0RpZExvYWQnXG5dXG5cbmNsYXNzIFByb2plY3Qge1xuICBjb25zdHJ1Y3RvciAodXJpLCBvcHRpb25zID0ge30pIHtcbiAgICBkZWJ1ZygncHJvamVjdCBjcmVhdGVkIGF0OiAnICsgdXJpKVxuICAgIGRlYnVnKCdPcHRpb24ga2V5czogJyArIE9iamVjdC5rZXlzKG9wdGlvbnMpKVxuXG4gICAgdXJpLnNob3VsZC5iZS5hLlN0cmluZygpXG4gICAgdXJpLnNob3VsZC5ub3QuYmUuZW1wdHkoKVxuXG4gICAgbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKVxuXG4gICAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgICBwcm9qZWN0LnVyaSA9IHVyaVxuICAgIHByb2plY3Qucm9vdCA9IGRpcm5hbWUodXJpKVxuICAgIHByb2plY3QudHlwZSA9IG9wdGlvbnMudHlwZSB8fCAncHJvamVjdCdcblxuICAgIHByb2plY3QuaGlkZGVuKCdvcHRpb25zJywgKCkgPT4gb3B0aW9ucylcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9qZWN0LCAnbWFuaWZlc3QnLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBvcHRpb25zLm1hbmlmZXN0IHx8IHt9XG4gICAgfSlcblxuICAgIC8vIGF1dG9iaW5kIGhvb2tzIGZ1bmN0aW9ucyBwYXNzZWQgaW4gYXMgb3B0aW9uc1xuICAgIHByb2plY3QuaGlkZGVuKCdob29rcycsIHNldHVwSG9va3MuY2FsbChwcm9qZWN0LCBvcHRpb25zLmhvb2tzKSlcblxuICAgIHByb2plY3QuaGlkZGVuKCdwYXRocycsIHBhdGhzLmJpbmQocHJvamVjdCkpXG5cbiAgICBwcm9qZWN0LmhpZGRlbigncmVnaXN0cmllcycsIHJlZ2lzdHJpZXMuY2FsbChwcm9qZWN0KSwgZmFsc2UpXG5cbiAgICBwcm9qZWN0Lm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgYmFzZW5hbWUocHJvamVjdC5yb290KVxuXG4gICAgY29uc3QgcGx1Z2lucyA9IFsgXVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIocHJvamVjdCwgJ2VuYWJsZWRQbHVnaW5zJywgKCkgPT4gcGx1Z2lucylcblxuICAgIGlmIChvcHRpb25zLnBsdWdpbnMpIHtcbiAgICAgIG9wdGlvbnMucGx1Z2lucy5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YocGx1Z2luKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHBsdWdpbi5jYWxsKHRoaXMsIHRoaXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51c2UocGx1Z2luKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHByb2plY3QuX19ydW5Ib29rKCdjb250ZW50V2lsbEluaXRpYWxpemUnKVxuICAgIC8vIHdyYXAgdGhlIGNvbnRlbnQgaW50ZXJmYWNlIGluIGEgZ2V0dGVyIGJ1dCBtYWtlIHN1cmVcbiAgICAvLyB0aGUgZG9jdW1lbnRzIGNvbGxlY3Rpb24gaXMgbG9hZGVkIGFuZCBhdmFpbGFibGUgcmlnaHQgYXdheVxuICAgIHByb2plY3QuaGlkZGVuKCdjb250ZW50JywgY29udGVudC5jYWxsKHByb2plY3QpKVxuXG4gICAgcHJvamVjdC5fX3J1bkhvb2soJ2NvbnRlbnREaWRJbml0aWFsaXplJylcblxuICAgIGlmIChvcHRpb25zLmF1dG9JbXBvcnQgIT09IGZhbHNlKSB7XG4gICAgICBkZWJ1ZygncnVubmluZyBhdXRvaW1wb3J0Jywgb3B0aW9ucy5hdXRvTG9hZClcblxuICAgICAgcHJvamVjdC5fX3J1bkhvb2soJ3Byb2plY3RXaWxsQXV0b0ltcG9ydCcpXG5cbiAgICAgIHJ1bkltcG9ydGVyLmNhbGwocHJvamVjdCwge1xuICAgICAgICB0eXBlOiAob3B0aW9ucy5pbXBvcnRlclR5cGUgfHwgJ2Rpc2snKSxcbiAgICAgICAgYXV0b0xvYWQ6IG9wdGlvbnMuYXV0b0xvYWQgfHwge1xuICAgICAgICAgIGRvY3VtZW50czogdHJ1ZSxcbiAgICAgICAgICBhc3NldHM6IHRydWUsXG4gICAgICAgICAgdmVjdG9yczogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBwcm9qZWN0Ll9fcnVuSG9vaygncHJvamVjdERpZEF1dG9JbXBvcnQnKVxuICAgIH1cblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIocHJvamVjdCwgJ3N1cHBvcnRlZEFzc2V0RXh0ZW5zaW9ucycsICgpID0+IEFzc2V0cy5Bc3NldC5TdXBwb3J0ZWRFeHRlbnNpb25zIClcblxuICAgIC8vIGxhenkgbG9hZCAvIG1lbW9pemUgdGhlIGVudGl0eSBidWlsZGVyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2plY3QsICdlbnRpdGllcycsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWxldGUgcHJvamVjdC5lbnRpdGllc1xuICAgICAgICBkZWJ1ZygnYnVpbGRpbmcgZW50aXRpZXMnKVxuXG4gICAgICAgIHByb2plY3QuX19ydW5Ib29rKCd3aWxsQnVpbGRFbnRpdGllcycpXG4gICAgICAgIHByb2plY3QuZW50aXRpZXMgPSBlbnRpdGllcy5jYWxsKHByb2plY3QpXG4gICAgICAgIHByb2plY3QuX19ydW5Ib29rKCdkaWRCdWlsZEVudGl0aWVzJywgcHJvamVjdCwgcHJvamVjdC5lbnRpdGllcylcblxuICAgICAgICByZXR1cm4gcHJvamVjdC5lbnRpdGllc1xuICAgICAgfVxuICAgIH0pXG5cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHByb2plY3QsICdtb2RlbERlZmluaXRpb25zJywgbW9kZWxEZWZpbml0aW9ucy5iaW5kKHRoaXMpKVxuICB9XG5cbiAgX19ydW5Ib29rKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgICBsZXQgZm4gPSBwcm9qZWN0Lmhvb2tzW25hbWVdIHx8IHByb2plY3RbbmFtZV1cbiAgICBpZiAoZm4pIHsgZm4uY2FsbChwcm9qZWN0LCAuLi5hcmdzKSB9XG4gIH1cbiAgLyoqXG4gICAqIEEgcHJveHkgb2JqZWN0IHRoYXQgbGV0cyB5b3UgcnVuIG9uZSBvZiB0aGUgcHJvamVjdCBoZWxwZXJzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBwcm9qZWN0LnJ1bi5pbXBvcnRlcignZGlzaycpXG4gICAqIHByb2plY3QucnVuLmFjdGlvbignc25hcHNob3RzL3NhdmUnLCAnL3BhdGgvdG8vc25hcHNob3QuanNvbicpXG4gICAqXG4gICAqL1xuICBnZXQgcnVuKCl7XG4gICAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgICByZXR1cm4ge1xuICAgICAgYWN0aW9uOiBmdW5jdGlvbiBhY3Rpb24oLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5hY3Rpb25zLnJ1biguLi5hcmdzKSB9LFxuICAgICAgY29udGV4dDogZnVuY3Rpb24gY29udGV4dCguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LmNvbnRleHRzLnJ1biguLi5hcmdzKSB9LFxuICAgICAgaW1wb3J0ZXI6IGZ1bmN0aW9uIGltcG9ydGVyKHR5cGUsIC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QuaW1wb3J0ZXJzLnJ1bigodHlwZSB8fCBwcm9qZWN0Lm9wdGlvbnMuaW1wb3J0ZXIgfHwgJ2Rpc2snKSwgLi4uYXJncykgfSxcbiAgICAgIGV4cG9ydGVyOiBmdW5jdGlvbiBleHBvcnRlcih0eXBlLCAuLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LmV4cG9ydGVycy5ydW4oKHR5cGUgfHwgcHJvamVjdC5vcHRpb25zLmV4cG9ydGVyIHx8ICdzbmFwc2hvdCcpLCAuLi5hcmdzKSB9LFxuICAgICAgbW9kZWw6IGZ1bmN0aW9uIG1vZGVsKC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QubW9kZWxzLnJ1biguLi5hcmdzKSB9LFxuICAgICAgcmVuZGVyZXI6IGZ1bmN0aW9uIHJlbmRlcmVyKC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QucmVuZGVyZXJzLnJ1biguLi5hcmdzKSB9LFxuICAgICAgdmlldzogZnVuY3Rpb24gdmlldyguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LnZpZXdzLnJ1biguLi5hcmdzKSB9XG4gICAgfVxuICB9XG5cbiAgcXVlcnkgKHNvdXJjZSwgcGFyYW1zKSB7XG4gICAgc291cmNlID0gYCR7IHNvdXJjZSB9YC50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAoc291cmNlID09PSAnZG9jcycgfHwgc291cmNlID09PSAnZG9jdW1lbnRzJykge1xuICAgICAgcmV0dXJuIHRoaXMuZG9jcy5xdWVyeShwYXJhbXMpXG4gICAgfVxuXG4gICAgaWYgKHNvdXJjZSA9PT0gJ2RhdGEnIHx8IHNvdXJjZSA9PT0gJ2RhdGFzb3VyY2VzJyB8fCBzb3VyY2UgPT09ICdkYXRhX3NvdXJjZXMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50LmRhdGFfc291cmNlcy5xdWVyeShwYXJhbXMpXG4gICAgfVxuXG4gICAgaWYgKFsnYXNzZXRzJywnc2NyaXB0cycsJ3N0eWxlc2hlZXRzJywnaW1hZ2VzJywndmVjdG9ycyddLmluZGV4T2Yoc291cmNlKSA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50W3NvdXJjZV0ucXVlcnkocGFyYW1zKVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1vZGVsR3JvdXBzLmluZGV4T2Yoc291cmNlKSA+IDApIHtcbiAgICAgIHJldHVybiB1dGlsLmZpbHRlclF1ZXJ5KHV0aWwudmFsdWVzKHRoaXMuZW50aXRpZXNbc291cmNlXSksIHBhcmFtcylcbiAgICB9XG4gIH1cblxuICBxdWVyeUhlbHBlcnMoc291cmNlLCBwYXJhbXMpIHtcbiAgICAgcmV0dXJuIHRoaXMucmVnaXN0cmllc1tzb3VyY2VdLnF1ZXJ5KHBhcmFtcylcbiAgfVxuXG4gIGdldCBhc3NldE1hbmlmZXN0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5leHBvcnRlcnMucnVuKCdhc3NldF9tYW5pZmVzdCcsIHtcbiAgICAgIHByb2plY3Q6IHRoaXNcbiAgICB9KVxuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgb2YgdGhpcyBwcm9qZWN0J3MgY29udGVudCBjb2xsZWN0aW9ucy5cbiAgICovXG4gIGdldCBjb2xsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gdXRpbC52YWx1ZXModGhpcy5jb250ZW50KVxuICB9XG5cbiAgZ2V0IGFsbEFzc2V0cyAoKSB7XG4gICAgcmV0dXJuIHV0aWwuZmxhdHRlbih0aGlzLmNvbGxlY3Rpb25zLm1hcChjID0+IGMuYWxsKSlcbiAgfVxuXG4gIGdldCBhc3NldFBhdGhzICgpe1xuICAgIHJldHVybiB0aGlzLmFsbEFzc2V0cy5tYXAoYSA9PiBhLnBhdGhzLnByb2plY3QpXG4gIH1cblxuICAvKipcbiAgKiBBY2Nlc3MgYSBkb2N1bWVudCBieSB0aGUgZG9jdW1lbnQgaWQgc2hvcnQgaGFuZFxuICAqXG4gICogRG9jdW1lbnRzIGFyZSB0aGUgbW9zdCBpbXBvcnRhbnQgcGFydCBvZiBhIFNreXBhZ2VyIHByb2plY3QsIHNvIG1ha2UgaXQgZWFzeSB0byBhY2Nlc3MgdGhlbVxuICAqXG4gICovXG4gICBhdCAoZG9jdW1lbnRJZCkge1xuICAgICByZXR1cm4gdGhpcy5kb2N1bWVudHMuYXQoZG9jdW1lbnRJZClcbiAgIH1cblxuICAvKipcbiAgKiBUaGlzIGlzIGEgc3lzdGVtIGZvciByZXNvbHZpbmcgcGF0aHMgaW4gdGhlIHByb2plY3QgdHJlZSB0byB0aGVcbiAgKiBhcHByb3ByaWF0ZSBoZWxwZXIsIG9yIHJlc29sdmluZyBwYXRocyB0byB0aGUgbGlua3MgdG8gdGhlc2UgcGF0aHNcbiAgKiBpbiBzb21lIG90aGVyIHN5c3RlbSAobGlrZSBhIHdlYiBzaXRlKVxuICAqL1xuICBnZXQgcmVzb2x2ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZXJcbiAgfVxuXG4gIC8qKlxuICAqIEBhbGlhcyBQcm9qZWN0I3Jlc29sdmVcbiAgKi9cbiAgZ2V0IHJlc29sdmVyICgpIHtcbiAgICByZXR1cm4gcmVzb2x2ZXIuY2FsbCh0aGlzKVxuICB9XG5cbiAgLyoqXG4gICogVXNlIGEgcGx1Z2luIGZyb20gdGhlIHBsdWdpbnMgcmVnaXN0cnlcbiAgKlxuICAqL1xuICB1c2UgKHBsdWdpbnMsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICh0eXBlb2YgcGx1Z2lucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBsdWdpbnMgPSBbcGx1Z2luc11cbiAgICB9XG5cbiAgICBwbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgIGxldCBwbHVnaW5Db25maWcgPSB0aGlzLnBsdWdpbnMubG9va3VwKHBsdWdpbilcblxuICAgICAgaWYgKHBsdWdpbkNvbmZpZyAmJiBwbHVnaW5Db25maWcuYXBpICYmIHBsdWdpbkNvbmZpZy5hcGkubW9kaWZ5KSB7XG4gICAgICAgIG9wdGlvbnMucHJvamVjdCA9IG9wdGlvbnMucHJvamVjdCB8fCB0aGlzXG4gICAgICAgIHBsdWdpbkNvbmZpZy5hcGkubW9kaWZ5KG9wdGlvbnMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHBsdWdpbkNvbmZpZy5hcGkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBwbHVnaW5Db25maWcuYXBpLmNhbGwodGhpcywgdGhpcywgcGx1Z2luQ29uZmlnKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW5hYmxlZFBsdWdpbnMucHVzaChwbHVnaW4pXG4gICAgfSlcbiAgfVxuXG4gIC8qXG4gICogQWxpYXNlcyB0byBjcmVhdGUgaGlkZGVuIGFuZCBsYXp5IGdldHRlcnMgb24gdGhlIHByb2plY3RcbiAgKi9cbiAgaGlkZGVuICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmhpZGRlbi5nZXR0ZXIodGhpcywgLi4uYXJncykgfVxuICBsYXp5ICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmxhenkodGhpcywgLi4uYXJncykgfVxuXG4gIC8qKlxuICAgKiBidWlsZCBhIHBhdGggZnJvbSBhIGJhc2UgKGUuZy4gZG9jdW1lbnRzLCBtb2RlbHMsIGJ1aWxkKVxuICAgKiB1c2luZyBwYXRoLmpvaW5cbiAgICovXG4gIHBhdGggKGJhc2UsIC4uLnJlc3QpIHtcbiAgICByZXR1cm4gam9pbih0aGlzLnBhdGhzW2Jhc2VdLCAuLi5yZXN0KVxuICB9XG5cbiAgLyoqXG4gICogQ29sbGVjdGlvbiBBY2Nlc3NvciBNZXRob2RzXG4gICpcbiAgKiBUaGVzZSBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgZG9jdW1lbnQgY29sbGVjdGlvbnMgd2l0aGluIHRoZSBwcm9qZWN0XG4gICovXG4gIGdldCBkb2NzICgpIHtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudHNcbiAgfVxuXG4gIGdldCBkb2N1bWVudHMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZG9jdW1lbnRzXG4gIH1cblxuICBnZXQgZGF0YV9zb3VyY2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50LmRhdGFfc291cmNlc1xuICB9XG5cbiAgZ2V0IGRhdGEgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YV9zb3VyY2VzXG4gIH1cblxuICBnZXQgY29sbGVjdGlvbnMgKCkge1xuICAgIHJldHVybiB1dGlsLnZhbHVlcyh0aGlzLmNvbnRlbnQpXG4gIH1cblxuICBnZXQgYWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5hY3Rpb25zXG4gIH1cblxuICBnZXQgY29udGV4dHMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuY29udGV4dHNcbiAgfVxuXG4gIGdldCBleHBvcnRlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuZXhwb3J0ZXJzXG4gIH1cblxuICBnZXQgaW1wb3J0ZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmltcG9ydGVyc1xuICB9XG5cbiAgZ2V0IHBsdWdpbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMucGx1Z2luc1xuICB9XG5cbiAgZ2V0IG1vZGVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5tb2RlbHNcbiAgfVxuXG4gIGdldCBzdG9yZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuc3RvcmVzXG4gIH1cblxuICBnZXQgcmVuZGVyZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnJlbmRlcmVyc1xuICB9XG5cbiAgZ2V0IHZpZXdzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnZpZXdzXG4gIH1cblxuICBnZXQgbW9kZWxHcm91cHMgKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVscy5hbGwubWFwKG1vZGVsID0+XG4gICAgICB1dGlsLnRhYmVsaXplKHV0aWwudW5kZXJzY29yZShtb2RlbC5uYW1lKSlcbiAgICApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9qZWN0XG5cbmZ1bmN0aW9uIHBhdGhzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgbGV0IGNvbnZlbnRpb25hbCA9IHtcbiAgICBhc3NldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgYWN0aW9uczogam9pbih0aGlzLnJvb3QsICdhY3Rpb25zJyksXG4gICAgY29udGV4dHM6IGpvaW4odGhpcy5yb290LCAnY29udGV4dHMnKSxcbiAgICBkYXRhX3NvdXJjZXM6IGpvaW4odGhpcy5yb290LCAnZGF0YScpLFxuICAgIGRvY3VtZW50czogam9pbih0aGlzLnJvb3QsICdkb2NzJyksXG4gICAgZXhwb3J0ZXJzOiBqb2luKHRoaXMucm9vdCwgJ2V4cG9ydGVycycpLFxuICAgIGltcG9ydGVyczogam9pbih0aGlzLnJvb3QsICdpbXBvcnRlcnMnKSxcbiAgICBtb2RlbHM6IGpvaW4odGhpcy5yb290LCAnbW9kZWxzJyksXG4gICAgcGx1Z2luczogam9pbih0aGlzLnJvb3QsICdwbHVnaW5zJyksXG4gICAgcmVuZGVyZXJzOiBqb2luKHRoaXMucm9vdCwgJ3JlbmRlcmVycycpLFxuICAgIHZlY3RvcnM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgaW1hZ2VzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIHNjcmlwdHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgc3R5bGVzaGVldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgbWFuaWZlc3Q6IGpvaW4odGhpcy5yb290LCAncGFja2FnZS5qc29uJyksXG4gICAgY2FjaGU6IGpvaW4odGhpcy5yb290LCAndG1wJywgJ2NhY2hlJyksXG4gICAgbG9nczogam9pbih0aGlzLnJvb3QsICdsb2cnKSxcbiAgICBidWlsZDogam9pbih0aGlzLnJvb3QsICdkaXN0JyksXG4gICAgcHVibGljOiBqb2luKHRoaXMucm9vdCwgJ3B1YmxpYycpXG4gIH1cblxuICBsZXQgY3VzdG9tID0gcHJvamVjdC5vcHRpb25zLnBhdGhzIHx8IHByb2plY3QubWFuaWZlc3QucGF0aHMgfHwge31cblxuICByZXR1cm4gdXRpbC5hc3NpZ24oY29udmVudGlvbmFsLCBjdXN0b20pXG59XG5cbmZ1bmN0aW9uIGNvbnRlbnQgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IGNvbGxlY3Rpb25zID0gYnVpbGRDb250ZW50Q29sbGVjdGlvbnNNYW51YWxseS5jYWxsKHByb2plY3QpXG5cbiAgcmV0dXJuIGNvbGxlY3Rpb25zXG59XG5cbmZ1bmN0aW9uIHJ1bkltcG9ydGVyIChvcHRpb25zID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCBjb2xsZWN0aW9ucyA9IHByb2plY3QuY29sbGVjdGlvbnNcbiAgbGV0IHsgYXV0b0xvYWQsIGltcG9ydGVyIH0gPSBvcHRpb25zXG5cbiAgZGVidWcoJ2ltcG9ydCBzdGFydGluZycpXG4gIGxldCByZXN1bHQgPSBwcm9qZWN0LmltcG9ydGVycy5ydW4oaW1wb3J0ZXIgfHwgJ2Rpc2snLCB7IHByb2plY3Q6IHRoaXMsIGNvbGxlY3Rpb25zOiB0aGlzLmNvbnRlbnQsIGF1dG9Mb2FkIH0pXG4gIGRlYnVnKCdpbXBvcnQgZmluaXNoaW5nJylcblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ29udGVudENvbGxlY3Rpb25zTWFudWFsbHkgKCkge1xuICBjb25zdCBwcm9qZWN0ID0gdGhpc1xuICBjb25zdCBwYXRocyA9IHByb2plY3QucGF0aHNcblxuICBsZXQgeyBBc3NldCwgRGF0YVNvdXJjZSwgRG9jdW1lbnQsIEltYWdlLCBTY3JpcHQsIFN0eWxlc2hlZXQsIFZlY3RvciB9ID0gQXNzZXRzXG5cbiAgcmV0dXJuIHtcbiAgICBhc3NldHM6IEFzc2V0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGRhdGFfc291cmNlczogRGF0YVNvdXJjZS5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBkb2N1bWVudHM6IERvY3VtZW50LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGltYWdlczogSW1hZ2UuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgc2NyaXB0czogU2NyaXB0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIHN0eWxlc2hlZXRzOiBTdHlsZXNoZWV0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIHZlY3RvcnM6IFZlY3Rvci5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0b3JlcyAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xufVxuXG5mdW5jdGlvbiByZWdpc3RyaWVzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCByb290ID0gcHJvamVjdC5yb290XG5cbiAgbGV0IHJlZ2lzdHJpZXMgPSBSZWdpc3RyeS5idWlsZEFsbChwcm9qZWN0LCBIZWxwZXJzLCB7cm9vdH0pXG5cbiAgcHJvamVjdC5fX3J1bkhvb2soJ3JlZ2lzdHJpZXNEaWRMb2FkJywgcmVnaXN0cmllcylcblxuICByZXR1cm4gcmVnaXN0cmllc1xufVxuXG5mdW5jdGlvbiBtb2RlbERlZmluaXRpb25zKCkge1xuICByZXR1cm4gdGhpcy5tb2RlbHMuYXZhaWxhYmxlLnJlZHVjZSgobWVtbyxpZCkgPT4ge1xuICAgIGxldCBtb2RlbCA9IHRoaXMubW9kZWxzLmxvb2t1cChpZClcblxuICAgIE9iamVjdC5hc3NpZ24obWVtbywge1xuICAgICAgZ2V0IFt1dGlsLnRhYmVsaXplKHV0aWwudW5kZXJzY29yZShtb2RlbC5uYW1lKSldKCl7XG4gICAgICAgIHJldHVybiBtb2RlbC5kZWZpbml0aW9uXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBtZW1vXG4gIH0sIHt9KVxufVxuXG5mdW5jdGlvbiBlbnRpdGllcygpIHtcbiAgcmV0dXJuIHRoaXMubW9kZWxzLmF2YWlsYWJsZS5yZWR1Y2UoKG1lbW8saWQpID0+IHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLm1vZGVscy5sb29rdXAoaWQpXG4gICAgbGV0IGVudGl0aWVzID0gbW9kZWwuZW50aXRpZXMgPSBtb2RlbC5lbnRpdGllcyB8fCB7fVxuXG4gICAgT2JqZWN0LmFzc2lnbihtZW1vLCB7XG4gICAgICBnZXQgW3V0aWwudGFiZWxpemUodXRpbC51bmRlcnNjb3JlKG1vZGVsLm5hbWUpKV0oKXtcbiAgICAgICAgcmV0dXJuIGVudGl0aWVzXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBtZW1vXG4gIH0sIHt9KVxufVxuXG5mdW5jdGlvbiBzZXR1cEhvb2tzKGhvb2tzID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGhvb2tzKS5yZWR1Y2UoKG1lbW8sIGhvb2spID0+IHtcbiAgICBsZXQgZm4gPSBob29rc1tob29rXVxuXG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbWVtb1tob29rXSA9IGZuLmJpbmQocHJvamVjdClcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtb1xuICB9LCB7fSlcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplT3B0aW9ucyAob3B0aW9ucyA9IHt9KSB7XG4gIGlmIChvcHRpb25zLm1hbmlmZXN0ICYmIG9wdGlvbnMubWFuaWZlc3Quc2t5cGFnZXIpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihvcHRpb25zLCBvcHRpb25zLm1hbmlmZXN0LnNreXBhZ2VyKVxuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnNcbn1cbiJdfQ==