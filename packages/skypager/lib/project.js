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

    project.emit('contentWillInitialize');
    // wrap the content interface in a getter but make sure
    // the documents collection is loaded and available right away
    project.hidden('content', content.call(project));

    project.emit('contentDidInitialize');

    if (options.autoImport !== false) {
      debug('running autoimport', options.autoLoad);

      project.emit('projectWillAutoImport');

      runImporter.call(project, {
        type: options.importerType || 'disk',
        autoLoad: options.autoLoad || {
          documents: true,
          assets: true,
          vectors: true
        }
      });

      project.emit('projectDidAutoImport');
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

        project.emit('willBuildEntities');
        project.entities = entities.call(project);
        project.emit('didBuildEntities', project, project.entities);

        return project.entities;
      }
    });

    util.hide.getter(project, 'modelDefinitions', modelDefinitions.bind(this));
  }

  _createClass(Project, [{
    key: 'emit',
    value: function emit(name) {
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
    key: 'eachAsset',
    value: function eachAsset() {
      var _allAssets;

      return (_allAssets = this.allAssets).forEach.apply(_allAssets, arguments);
    }
  }, {
    key: 'reduceAssets',
    value: function reduceAssets() {
      var _allAssets2;

      return (_allAssets2 = this.allAssets).reduce.apply(_allAssets2, arguments);
    }
  }, {
    key: 'mapAssets',
    value: function mapAssets() {
      var _allAssets3;

      return (_allAssets3 = this.allAssets).map.apply(_allAssets3, arguments);
    }
  }, {
    key: 'filterAssets',
    value: function filterAssets() {
      var _allAssets4;

      return (_allAssets4 = this.allAssets).filter.apply(_allAssets4, arguments);
    }

    /**
    * Access a document by the document id short hand
    *
    * Documents are the most important part of a Skypager project, so make it easy to access them
    *
    */

  }, {
    key: 'at',
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

  project.emit('registriesDidLoad', registries);

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
//# sourceMappingURL=data:application/json;base64,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OztBQUM1QixNQUFJLE9BQU8sR0FBRyxJQUFJLENBQUE7O0FBRWxCLFNBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxJQUFJLEVBQUUsSUFBSSxFQUFLO0FBQy9DLFFBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQTs7QUFFcEIsUUFBSSxPQUFPLEVBQUUsS0FBSyxVQUFVLEVBQUU7QUFDNUIsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDOUI7O0FBRUQsV0FBTyxJQUFJLENBQUE7R0FDWixFQUFFLEVBQUUsQ0FBQyxDQUFBO0NBQ1A7O0FBRUQsU0FBUyxnQkFBZ0IsR0FBZ0I7TUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQ3JDLE1BQUksT0FBTyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRTtBQUNqRCxXQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtHQUM1RDs7QUFFRCxTQUFPLE9BQU8sQ0FBQTtDQUNmIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2t5cGFnZXIgZnJvbSAnLi9pbmRleCdcbmltcG9ydCBtZDUgZnJvbSAnbWQ1J1xuXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi9yZWdpc3RyeSdcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vY29sbGVjdGlvbidcbmltcG9ydCByZXNvbHZlciBmcm9tICcuL3Jlc29sdmVyJ1xuXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCAqIGFzIEFzc2V0cyBmcm9tICcuL2Fzc2V0cydcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsJ1xuXG5pbXBvcnQgeyByZXNvbHZlLCBkaXJuYW1lLCBqb2luLCBiYXNlbmFtZSwgZXh0bmFtZSB9IGZyb20gJ3BhdGgnXG5cbmltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5cbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdza3lwYWdlcjpwcm9qZWN0JylcbmNvbnN0IGhpZGUgPSB1dGlsLmhpZGUuZ2V0dGVyXG5jb25zdCBsYXp5ID0gdXRpbC5sYXp5XG5cbmNvbnN0IEhPT0tTID0gW1xuICAnY29udGVudFdpbGxJbml0aWFsaXplJyxcbiAgJ2NvbnRlbnREaWRJbml0aWFsaXplJyxcbiAgJ3Byb2plY3RXaWxsQXV0b0ltcG9ydCcsXG4gICdwcm9qZWN0RGlkQXV0b0ltcG9ydCcsXG4gICd3aWxsQnVpbGRFbnRpdGllcycsXG4gICdkaWRCdWlsZEVudGl0aWVzJyxcbiAgJ3JlZ2lzdHJpZXNEaWRMb2FkJ1xuXVxuXG5jbGFzcyBQcm9qZWN0IHtcbiAgY29uc3RydWN0b3IgKHVyaSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgZGVidWcoJ3Byb2plY3QgY3JlYXRlZCBhdDogJyArIHVyaSlcbiAgICBkZWJ1ZygnT3B0aW9uIGtleXM6ICcgKyBPYmplY3Qua2V5cyhvcHRpb25zKSlcblxuICAgIHVyaS5zaG91bGQuYmUuYS5TdHJpbmcoKVxuICAgIHVyaS5zaG91bGQubm90LmJlLmVtcHR5KClcblxuICAgIG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucylcblxuICAgIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gICAgcHJvamVjdC51cmkgPSB1cmlcbiAgICBwcm9qZWN0LnJvb3QgPSBkaXJuYW1lKHVyaSlcbiAgICBwcm9qZWN0LnR5cGUgPSBvcHRpb25zLnR5cGUgfHwgJ3Byb2plY3QnXG5cbiAgICBwcm9qZWN0LmhpZGRlbignb3B0aW9ucycsICgpID0+IG9wdGlvbnMpXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvamVjdCwgJ21hbmlmZXN0Jywge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogb3B0aW9ucy5tYW5pZmVzdCB8fCB7fVxuICAgIH0pXG5cbiAgICAvLyBhdXRvYmluZCBob29rcyBmdW5jdGlvbnMgcGFzc2VkIGluIGFzIG9wdGlvbnNcbiAgICBwcm9qZWN0LmhpZGRlbignaG9va3MnLCBzZXR1cEhvb2tzLmNhbGwocHJvamVjdCwgb3B0aW9ucy5ob29rcykpXG5cbiAgICBwcm9qZWN0LmhpZGRlbigncGF0aHMnLCBwYXRocy5iaW5kKHByb2plY3QpKVxuXG4gICAgcHJvamVjdC5oaWRkZW4oJ3JlZ2lzdHJpZXMnLCByZWdpc3RyaWVzLmNhbGwocHJvamVjdCksIGZhbHNlKVxuXG4gICAgcHJvamVjdC5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IGJhc2VuYW1lKHByb2plY3Qucm9vdClcblxuICAgIGNvbnN0IHBsdWdpbnMgPSBbIF1cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHByb2plY3QsICdlbmFibGVkUGx1Z2lucycsICgpID0+IHBsdWdpbnMpXG5cbiAgICBpZiAob3B0aW9ucy5wbHVnaW5zKSB7XG4gICAgICBvcHRpb25zLnBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgICBpZiAodHlwZW9mKHBsdWdpbikgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBwbHVnaW4uY2FsbCh0aGlzLCB0aGlzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudXNlKHBsdWdpbilcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBwcm9qZWN0LmVtaXQoJ2NvbnRlbnRXaWxsSW5pdGlhbGl6ZScpXG4gICAgLy8gd3JhcCB0aGUgY29udGVudCBpbnRlcmZhY2UgaW4gYSBnZXR0ZXIgYnV0IG1ha2Ugc3VyZVxuICAgIC8vIHRoZSBkb2N1bWVudHMgY29sbGVjdGlvbiBpcyBsb2FkZWQgYW5kIGF2YWlsYWJsZSByaWdodCBhd2F5XG4gICAgcHJvamVjdC5oaWRkZW4oJ2NvbnRlbnQnLCBjb250ZW50LmNhbGwocHJvamVjdCkpXG5cbiAgICBwcm9qZWN0LmVtaXQoJ2NvbnRlbnREaWRJbml0aWFsaXplJylcblxuICAgIGlmIChvcHRpb25zLmF1dG9JbXBvcnQgIT09IGZhbHNlKSB7XG4gICAgICBkZWJ1ZygncnVubmluZyBhdXRvaW1wb3J0Jywgb3B0aW9ucy5hdXRvTG9hZClcblxuICAgICAgcHJvamVjdC5lbWl0KCdwcm9qZWN0V2lsbEF1dG9JbXBvcnQnKVxuXG4gICAgICBydW5JbXBvcnRlci5jYWxsKHByb2plY3QsIHtcbiAgICAgICAgdHlwZTogKG9wdGlvbnMuaW1wb3J0ZXJUeXBlIHx8ICdkaXNrJyksXG4gICAgICAgIGF1dG9Mb2FkOiBvcHRpb25zLmF1dG9Mb2FkIHx8IHtcbiAgICAgICAgICBkb2N1bWVudHM6IHRydWUsXG4gICAgICAgICAgYXNzZXRzOiB0cnVlLFxuICAgICAgICAgIHZlY3RvcnM6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcblxuICAgICAgcHJvamVjdC5lbWl0KCdwcm9qZWN0RGlkQXV0b0ltcG9ydCcpXG4gICAgfVxuXG4gICAgdXRpbC5oaWRlLmdldHRlcihwcm9qZWN0LCAnc3VwcG9ydGVkQXNzZXRFeHRlbnNpb25zJywgKCkgPT4gQXNzZXRzLkFzc2V0LlN1cHBvcnRlZEV4dGVuc2lvbnMgKVxuXG4gICAgLy8gbGF6eSBsb2FkIC8gbWVtb2l6ZSB0aGUgZW50aXR5IGJ1aWxkZXJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvamVjdCwgJ2VudGl0aWVzJywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlbGV0ZSBwcm9qZWN0LmVudGl0aWVzXG4gICAgICAgIGRlYnVnKCdidWlsZGluZyBlbnRpdGllcycpXG5cbiAgICAgICAgcHJvamVjdC5lbWl0KCd3aWxsQnVpbGRFbnRpdGllcycpXG4gICAgICAgIHByb2plY3QuZW50aXRpZXMgPSBlbnRpdGllcy5jYWxsKHByb2plY3QpXG4gICAgICAgIHByb2plY3QuZW1pdCgnZGlkQnVpbGRFbnRpdGllcycsIHByb2plY3QsIHByb2plY3QuZW50aXRpZXMpXG5cbiAgICAgICAgcmV0dXJuIHByb2plY3QuZW50aXRpZXNcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdXRpbC5oaWRlLmdldHRlcihwcm9qZWN0LCAnbW9kZWxEZWZpbml0aW9ucycsIG1vZGVsRGVmaW5pdGlvbnMuYmluZCh0aGlzKSlcbiAgfVxuXG4gIGVtaXQobmFtZSwgLi4uYXJncykge1xuICAgIGxldCBwcm9qZWN0ID0gdGhpc1xuICAgIGxldCBmbiA9IHByb2plY3QuaG9va3NbbmFtZV0gfHwgcHJvamVjdFtuYW1lXVxuICAgIGlmIChmbikgeyBmbi5jYWxsKHByb2plY3QsIC4uLmFyZ3MpIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBIHByb3h5IG9iamVjdCB0aGF0IGxldHMgeW91IHJ1biBvbmUgb2YgdGhlIHByb2plY3QgaGVscGVycy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogcHJvamVjdC5ydW4uaW1wb3J0ZXIoJ2Rpc2snKVxuICAgKiBwcm9qZWN0LnJ1bi5hY3Rpb24oJ3NuYXBzaG90cy9zYXZlJywgJy9wYXRoL3RvL3NuYXBzaG90Lmpzb24nKVxuICAgKlxuICAgKi9cbiAgZ2V0IHJ1bigpe1xuICAgIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbjogZnVuY3Rpb24gYWN0aW9uKC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QuYWN0aW9ucy5ydW4oLi4uYXJncykgfSxcbiAgICAgIGNvbnRleHQ6IGZ1bmN0aW9uIGNvbnRleHQoLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5jb250ZXh0cy5ydW4oLi4uYXJncykgfSxcbiAgICAgIGltcG9ydGVyOiBmdW5jdGlvbiBpbXBvcnRlcih0eXBlLCAuLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LmltcG9ydGVycy5ydW4oKHR5cGUgfHwgcHJvamVjdC5vcHRpb25zLmltcG9ydGVyIHx8ICdkaXNrJyksIC4uLmFyZ3MpIH0sXG4gICAgICBleHBvcnRlcjogZnVuY3Rpb24gZXhwb3J0ZXIodHlwZSwgLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5leHBvcnRlcnMucnVuKCh0eXBlIHx8IHByb2plY3Qub3B0aW9ucy5leHBvcnRlciB8fCAnc25hcHNob3QnKSwgLi4uYXJncykgfSxcbiAgICAgIG1vZGVsOiBmdW5jdGlvbiBtb2RlbCguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0Lm1vZGVscy5ydW4oLi4uYXJncykgfSxcbiAgICAgIHJlbmRlcmVyOiBmdW5jdGlvbiByZW5kZXJlciguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LnJlbmRlcmVycy5ydW4oLi4uYXJncykgfSxcbiAgICAgIHZpZXc6IGZ1bmN0aW9uIHZpZXcoLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC52aWV3cy5ydW4oLi4uYXJncykgfVxuICAgIH1cbiAgfVxuXG4gIHF1ZXJ5IChzb3VyY2UsIHBhcmFtcykge1xuICAgIHNvdXJjZSA9IGAkeyBzb3VyY2UgfWAudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgKHNvdXJjZSA9PT0gJ2RvY3MnIHx8IHNvdXJjZSA9PT0gJ2RvY3VtZW50cycpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvY3MucXVlcnkocGFyYW1zKVxuICAgIH1cblxuICAgIGlmIChzb3VyY2UgPT09ICdkYXRhJyB8fCBzb3VyY2UgPT09ICdkYXRhc291cmNlcycgfHwgc291cmNlID09PSAnZGF0YV9zb3VyY2VzJykge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5kYXRhX3NvdXJjZXMucXVlcnkocGFyYW1zKVxuICAgIH1cblxuICAgIGlmIChbJ2Fzc2V0cycsJ3NjcmlwdHMnLCdzdHlsZXNoZWV0cycsJ2ltYWdlcycsJ3ZlY3RvcnMnXS5pbmRleE9mKHNvdXJjZSkgPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudFtzb3VyY2VdLnF1ZXJ5KHBhcmFtcylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tb2RlbEdyb3Vwcy5pbmRleE9mKHNvdXJjZSkgPiAwKSB7XG4gICAgICByZXR1cm4gdXRpbC5maWx0ZXJRdWVyeSh1dGlsLnZhbHVlcyh0aGlzLmVudGl0aWVzW3NvdXJjZV0pLCBwYXJhbXMpXG4gICAgfVxuICB9XG5cbiAgcXVlcnlIZWxwZXJzKHNvdXJjZSwgcGFyYW1zKSB7XG4gICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXNbc291cmNlXS5xdWVyeShwYXJhbXMpXG4gIH1cblxuICBnZXQgYXNzZXRNYW5pZmVzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwb3J0ZXJzLnJ1bignYXNzZXRfbWFuaWZlc3QnLCB7XG4gICAgICBwcm9qZWN0OiB0aGlzXG4gICAgfSlcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIG9mIHRoaXMgcHJvamVjdCdzIGNvbnRlbnQgY29sbGVjdGlvbnMuXG4gICAqL1xuICBnZXQgY29sbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHV0aWwudmFsdWVzKHRoaXMuY29udGVudClcbiAgfVxuXG4gIGdldCBhbGxBc3NldHMgKCkge1xuICAgIHJldHVybiB1dGlsLmZsYXR0ZW4odGhpcy5jb2xsZWN0aW9ucy5tYXAoYyA9PiBjLmFsbCkpXG4gIH1cblxuICBnZXQgYXNzZXRQYXRocyAoKXtcbiAgICByZXR1cm4gdGhpcy5hbGxBc3NldHMubWFwKGEgPT4gYS5wYXRocy5wcm9qZWN0KVxuICB9XG5cbiAgZWFjaEFzc2V0ICguLi5hcmdzKSB7XG4gICAgIHJldHVybiB0aGlzLmFsbEFzc2V0cy5mb3JFYWNoKC4uLmFyZ3MpXG4gIH1cblxuICByZWR1Y2VBc3NldHMoLi4uYXJncykge1xuICAgICByZXR1cm4gdGhpcy5hbGxBc3NldHMucmVkdWNlKC4uLmFyZ3MpXG4gIH1cblxuICBtYXBBc3NldHMoLi4uYXJncykge1xuICAgICByZXR1cm4gdGhpcy5hbGxBc3NldHMubWFwKC4uLmFyZ3MpXG4gIH1cblxuICBmaWx0ZXJBc3NldHMoLi4uYXJncykge1xuICAgICByZXR1cm4gdGhpcy5hbGxBc3NldHMuZmlsdGVyKC4uLmFyZ3MpXG4gIH1cblxuICAvKipcbiAgKiBBY2Nlc3MgYSBkb2N1bWVudCBieSB0aGUgZG9jdW1lbnQgaWQgc2hvcnQgaGFuZFxuICAqXG4gICogRG9jdW1lbnRzIGFyZSB0aGUgbW9zdCBpbXBvcnRhbnQgcGFydCBvZiBhIFNreXBhZ2VyIHByb2plY3QsIHNvIG1ha2UgaXQgZWFzeSB0byBhY2Nlc3MgdGhlbVxuICAqXG4gICovXG4gICBhdCAoZG9jdW1lbnRJZCkge1xuICAgICByZXR1cm4gdGhpcy5kb2N1bWVudHMuYXQoZG9jdW1lbnRJZClcbiAgIH1cblxuICAvKipcbiAgKiBUaGlzIGlzIGEgc3lzdGVtIGZvciByZXNvbHZpbmcgcGF0aHMgaW4gdGhlIHByb2plY3QgdHJlZSB0byB0aGVcbiAgKiBhcHByb3ByaWF0ZSBoZWxwZXIsIG9yIHJlc29sdmluZyBwYXRocyB0byB0aGUgbGlua3MgdG8gdGhlc2UgcGF0aHNcbiAgKiBpbiBzb21lIG90aGVyIHN5c3RlbSAobGlrZSBhIHdlYiBzaXRlKVxuICAqL1xuICBnZXQgcmVzb2x2ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZXJcbiAgfVxuXG4gIC8qKlxuICAqIEBhbGlhcyBQcm9qZWN0I3Jlc29sdmVcbiAgKi9cbiAgZ2V0IHJlc29sdmVyICgpIHtcbiAgICByZXR1cm4gcmVzb2x2ZXIuY2FsbCh0aGlzKVxuICB9XG5cbiAgLyoqXG4gICogVXNlIGEgcGx1Z2luIGZyb20gdGhlIHBsdWdpbnMgcmVnaXN0cnlcbiAgKlxuICAqL1xuICB1c2UgKHBsdWdpbnMsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICh0eXBlb2YgcGx1Z2lucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBsdWdpbnMgPSBbcGx1Z2luc11cbiAgICB9XG5cbiAgICBwbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgIGxldCBwbHVnaW5Db25maWcgPSB0aGlzLnBsdWdpbnMubG9va3VwKHBsdWdpbilcblxuICAgICAgaWYgKHBsdWdpbkNvbmZpZyAmJiBwbHVnaW5Db25maWcuYXBpICYmIHBsdWdpbkNvbmZpZy5hcGkubW9kaWZ5KSB7XG4gICAgICAgIG9wdGlvbnMucHJvamVjdCA9IG9wdGlvbnMucHJvamVjdCB8fCB0aGlzXG4gICAgICAgIHBsdWdpbkNvbmZpZy5hcGkubW9kaWZ5KG9wdGlvbnMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHBsdWdpbkNvbmZpZy5hcGkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBwbHVnaW5Db25maWcuYXBpLmNhbGwodGhpcywgdGhpcywgcGx1Z2luQ29uZmlnKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW5hYmxlZFBsdWdpbnMucHVzaChwbHVnaW4pXG4gICAgfSlcbiAgfVxuXG4gIC8qXG4gICogQWxpYXNlcyB0byBjcmVhdGUgaGlkZGVuIGFuZCBsYXp5IGdldHRlcnMgb24gdGhlIHByb2plY3RcbiAgKi9cbiAgaGlkZGVuICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmhpZGRlbi5nZXR0ZXIodGhpcywgLi4uYXJncykgfVxuICBsYXp5ICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmxhenkodGhpcywgLi4uYXJncykgfVxuXG4gIC8qKlxuICAgKiBidWlsZCBhIHBhdGggZnJvbSBhIGJhc2UgKGUuZy4gZG9jdW1lbnRzLCBtb2RlbHMsIGJ1aWxkKVxuICAgKiB1c2luZyBwYXRoLmpvaW5cbiAgICovXG4gIHBhdGggKGJhc2UsIC4uLnJlc3QpIHtcbiAgICByZXR1cm4gam9pbih0aGlzLnBhdGhzW2Jhc2VdLCAuLi5yZXN0KVxuICB9XG5cbiAgLyoqXG4gICogQ29sbGVjdGlvbiBBY2Nlc3NvciBNZXRob2RzXG4gICpcbiAgKiBUaGVzZSBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgZG9jdW1lbnQgY29sbGVjdGlvbnMgd2l0aGluIHRoZSBwcm9qZWN0XG4gICovXG4gIGdldCBkb2NzICgpIHtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudHNcbiAgfVxuXG4gIGdldCBkb2N1bWVudHMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZG9jdW1lbnRzXG4gIH1cblxuICBnZXQgZGF0YV9zb3VyY2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50LmRhdGFfc291cmNlc1xuICB9XG5cbiAgZ2V0IGRhdGEgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YV9zb3VyY2VzXG4gIH1cblxuICBnZXQgY29sbGVjdGlvbnMgKCkge1xuICAgIHJldHVybiB1dGlsLnZhbHVlcyh0aGlzLmNvbnRlbnQpXG4gIH1cblxuICBnZXQgYWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5hY3Rpb25zXG4gIH1cblxuICBnZXQgY29udGV4dHMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuY29udGV4dHNcbiAgfVxuXG4gIGdldCBleHBvcnRlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuZXhwb3J0ZXJzXG4gIH1cblxuICBnZXQgaW1wb3J0ZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmltcG9ydGVyc1xuICB9XG5cbiAgZ2V0IHBsdWdpbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMucGx1Z2luc1xuICB9XG5cbiAgZ2V0IG1vZGVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5tb2RlbHNcbiAgfVxuXG4gIGdldCBzdG9yZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuc3RvcmVzXG4gIH1cblxuICBnZXQgcmVuZGVyZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnJlbmRlcmVyc1xuICB9XG5cbiAgZ2V0IHZpZXdzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnZpZXdzXG4gIH1cblxuICBnZXQgbW9kZWxHcm91cHMgKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVscy5hbGwubWFwKG1vZGVsID0+XG4gICAgICB1dGlsLnRhYmVsaXplKHV0aWwudW5kZXJzY29yZShtb2RlbC5uYW1lKSlcbiAgICApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9qZWN0XG5cbmZ1bmN0aW9uIHBhdGhzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgbGV0IGNvbnZlbnRpb25hbCA9IHtcbiAgICBhc3NldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgYWN0aW9uczogam9pbih0aGlzLnJvb3QsICdhY3Rpb25zJyksXG4gICAgY29udGV4dHM6IGpvaW4odGhpcy5yb290LCAnY29udGV4dHMnKSxcbiAgICBkYXRhX3NvdXJjZXM6IGpvaW4odGhpcy5yb290LCAnZGF0YScpLFxuICAgIGRvY3VtZW50czogam9pbih0aGlzLnJvb3QsICdkb2NzJyksXG4gICAgZXhwb3J0ZXJzOiBqb2luKHRoaXMucm9vdCwgJ2V4cG9ydGVycycpLFxuICAgIGltcG9ydGVyczogam9pbih0aGlzLnJvb3QsICdpbXBvcnRlcnMnKSxcbiAgICBtb2RlbHM6IGpvaW4odGhpcy5yb290LCAnbW9kZWxzJyksXG4gICAgcGx1Z2luczogam9pbih0aGlzLnJvb3QsICdwbHVnaW5zJyksXG4gICAgcmVuZGVyZXJzOiBqb2luKHRoaXMucm9vdCwgJ3JlbmRlcmVycycpLFxuICAgIHZlY3RvcnM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgaW1hZ2VzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIHNjcmlwdHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgc3R5bGVzaGVldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgbWFuaWZlc3Q6IGpvaW4odGhpcy5yb290LCAncGFja2FnZS5qc29uJyksXG4gICAgY2FjaGU6IGpvaW4odGhpcy5yb290LCAndG1wJywgJ2NhY2hlJyksXG4gICAgbG9nczogam9pbih0aGlzLnJvb3QsICdsb2cnKSxcbiAgICBidWlsZDogam9pbih0aGlzLnJvb3QsICdkaXN0JyksXG4gICAgcHVibGljOiBqb2luKHRoaXMucm9vdCwgJ3B1YmxpYycpXG4gIH1cblxuICBsZXQgY3VzdG9tID0gcHJvamVjdC5vcHRpb25zLnBhdGhzIHx8IHByb2plY3QubWFuaWZlc3QucGF0aHMgfHwge31cblxuICByZXR1cm4gdXRpbC5hc3NpZ24oY29udmVudGlvbmFsLCBjdXN0b20pXG59XG5cbmZ1bmN0aW9uIGNvbnRlbnQgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IGNvbGxlY3Rpb25zID0gYnVpbGRDb250ZW50Q29sbGVjdGlvbnNNYW51YWxseS5jYWxsKHByb2plY3QpXG5cbiAgcmV0dXJuIGNvbGxlY3Rpb25zXG59XG5cbmZ1bmN0aW9uIHJ1bkltcG9ydGVyIChvcHRpb25zID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCBjb2xsZWN0aW9ucyA9IHByb2plY3QuY29sbGVjdGlvbnNcbiAgbGV0IHsgYXV0b0xvYWQsIGltcG9ydGVyIH0gPSBvcHRpb25zXG5cbiAgZGVidWcoJ2ltcG9ydCBzdGFydGluZycpXG4gIGxldCByZXN1bHQgPSBwcm9qZWN0LmltcG9ydGVycy5ydW4oaW1wb3J0ZXIgfHwgJ2Rpc2snLCB7IHByb2plY3Q6IHRoaXMsIGNvbGxlY3Rpb25zOiB0aGlzLmNvbnRlbnQsIGF1dG9Mb2FkIH0pXG4gIGRlYnVnKCdpbXBvcnQgZmluaXNoaW5nJylcblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ29udGVudENvbGxlY3Rpb25zTWFudWFsbHkgKCkge1xuICBjb25zdCBwcm9qZWN0ID0gdGhpc1xuICBjb25zdCBwYXRocyA9IHByb2plY3QucGF0aHNcblxuICBsZXQgeyBBc3NldCwgRGF0YVNvdXJjZSwgRG9jdW1lbnQsIEltYWdlLCBTY3JpcHQsIFN0eWxlc2hlZXQsIFZlY3RvciB9ID0gQXNzZXRzXG5cbiAgcmV0dXJuIHtcbiAgICBhc3NldHM6IEFzc2V0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGRhdGFfc291cmNlczogRGF0YVNvdXJjZS5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBkb2N1bWVudHM6IERvY3VtZW50LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGltYWdlczogSW1hZ2UuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgc2NyaXB0czogU2NyaXB0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIHN0eWxlc2hlZXRzOiBTdHlsZXNoZWV0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIHZlY3RvcnM6IFZlY3Rvci5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0b3JlcyAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xufVxuXG5mdW5jdGlvbiByZWdpc3RyaWVzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCByb290ID0gcHJvamVjdC5yb290XG5cbiAgbGV0IHJlZ2lzdHJpZXMgPSBSZWdpc3RyeS5idWlsZEFsbChwcm9qZWN0LCBIZWxwZXJzLCB7cm9vdH0pXG5cbiAgcHJvamVjdC5lbWl0KCdyZWdpc3RyaWVzRGlkTG9hZCcsIHJlZ2lzdHJpZXMpXG5cbiAgcmV0dXJuIHJlZ2lzdHJpZXNcbn1cblxuZnVuY3Rpb24gbW9kZWxEZWZpbml0aW9ucygpIHtcbiAgcmV0dXJuIHRoaXMubW9kZWxzLmF2YWlsYWJsZS5yZWR1Y2UoKG1lbW8saWQpID0+IHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLm1vZGVscy5sb29rdXAoaWQpXG5cbiAgICBPYmplY3QuYXNzaWduKG1lbW8sIHtcbiAgICAgIGdldCBbdXRpbC50YWJlbGl6ZSh1dGlsLnVuZGVyc2NvcmUobW9kZWwubmFtZSkpXSgpe1xuICAgICAgICByZXR1cm4gbW9kZWwuZGVmaW5pdGlvblxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gbWVtb1xuICB9LCB7fSlcbn1cblxuZnVuY3Rpb24gZW50aXRpZXMoKSB7XG4gIHJldHVybiB0aGlzLm1vZGVscy5hdmFpbGFibGUucmVkdWNlKChtZW1vLGlkKSA9PiB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5tb2RlbHMubG9va3VwKGlkKVxuICAgIGxldCBlbnRpdGllcyA9IG1vZGVsLmVudGl0aWVzID0gbW9kZWwuZW50aXRpZXMgfHwge31cblxuICAgIE9iamVjdC5hc3NpZ24obWVtbywge1xuICAgICAgZ2V0IFt1dGlsLnRhYmVsaXplKHV0aWwudW5kZXJzY29yZShtb2RlbC5uYW1lKSldKCl7XG4gICAgICAgIHJldHVybiBlbnRpdGllc1xuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gbWVtb1xuICB9LCB7fSlcbn1cblxuZnVuY3Rpb24gc2V0dXBIb29rcyhob29rcyA9IHt9KSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhob29rcykucmVkdWNlKChtZW1vLCBob29rKSA9PiB7XG4gICAgbGV0IGZuID0gaG9va3NbaG9va11cblxuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1lbW9baG9va10gPSBmbi5iaW5kKHByb2plY3QpXG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbW9cbiAgfSwge30pXG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU9wdGlvbnMgKG9wdGlvbnMgPSB7fSkge1xuICBpZiAob3B0aW9ucy5tYW5pZmVzdCAmJiBvcHRpb25zLm1hbmlmZXN0LnNreXBhZ2VyKSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24ob3B0aW9ucywgb3B0aW9ucy5tYW5pZmVzdC5za3lwYWdlcilcbiAgfVxuXG4gIHJldHVybiBvcHRpb25zXG59XG4iXX0=