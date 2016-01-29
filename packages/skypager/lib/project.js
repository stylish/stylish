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
  }, {
    key: 'join',
    value: function join() {
      var _paths;

      return (_paths = this.paths).join.apply(_paths, arguments);
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
        action: function action(helperId) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          context.project = context.project || options.project || project;
          return project.actions.run(helperId, options, context);
        },
        importer: function importer(helperId) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          context.project = context.project || options.project || project;
          return project.importers.run(helperId, options, context);
        },
        exporter: function exporter(helperId) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          context.project = context.project || options.project || project;
          return project.exporters.run(helperId, options, context);
        },
        plugin: function plugin(helperId) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          context.project = context.project || options.project || project;
          return project.plugins.run(helperId, options, context);
        },
        model: function model(helperId) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          context.project = context.project || options.project || project;
          return project.models.run(helperId, options, context);
        },
        renderer: function renderer(helperId) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          context.project = context.project || options.project || project;
          return project.renderers.run(helperId, options, context);
        },
        view: function view(helperId) {
          var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
          var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

          context.project = context.project || options.project || project;
          return project.views.run(helperId, options, context);
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
    public: (0, _path.join)(this.root, 'public'),
    join: function join() {
      for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }

      return _path.join.apply(undefined, [project.root].concat(args));
    }
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
//# sourceMappingURL=data:application/json;base64,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Q1A7O0FBRUQsU0FBUyxVQUFVLEdBQWE7TUFBWixLQUFLLHlEQUFHLEVBQUU7O0FBQzVCLE1BQUksT0FBTyxHQUFHLElBQUksQ0FBQTs7QUFFbEIsU0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBRSxJQUFJLEVBQUs7QUFDL0MsUUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFBOztBQUVwQixRQUFJLE9BQU8sRUFBRSxLQUFLLFVBQVUsRUFBRTtBQUM1QixVQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUM5Qjs7QUFFRCxXQUFPLElBQUksQ0FBQTtHQUNaLEVBQUUsRUFBRSxDQUFDLENBQUE7Q0FDUDs7QUFFRCxTQUFTLGdCQUFnQixHQUFnQjtNQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDckMsTUFBSSxPQUFPLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO0FBQ2pELFdBQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0dBQzVEOztBQUVELFNBQU8sT0FBTyxDQUFBO0NBQ2YiLCJmaWxlIjoicHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTa3lwYWdlciBmcm9tICcuL2luZGV4J1xuaW1wb3J0IG1kNSBmcm9tICdtZDUnXG5cbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuL3JlZ2lzdHJ5J1xuaW1wb3J0IENvbGxlY3Rpb24gZnJvbSAnLi9jb2xsZWN0aW9uJ1xuaW1wb3J0IHJlc29sdmVyIGZyb20gJy4vcmVzb2x2ZXInXG5cbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuaW1wb3J0ICogYXMgQXNzZXRzIGZyb20gJy4vYXNzZXRzJ1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnXG5cbmltcG9ydCB7IHJlc29sdmUsIGRpcm5hbWUsIGpvaW4sIGJhc2VuYW1lLCBleHRuYW1lIH0gZnJvbSAncGF0aCdcblxuaW1wb3J0IF9kZWJ1ZyBmcm9tICdkZWJ1ZydcblxuY29uc3QgZGVidWcgPSBfZGVidWcoJ3NreXBhZ2VyOnByb2plY3QnKVxuY29uc3QgaGlkZSA9IHV0aWwuaGlkZS5nZXR0ZXJcbmNvbnN0IGxhenkgPSB1dGlsLmxhenlcblxuY29uc3QgSE9PS1MgPSBbXG4gICdjb250ZW50V2lsbEluaXRpYWxpemUnLFxuICAnY29udGVudERpZEluaXRpYWxpemUnLFxuICAncHJvamVjdFdpbGxBdXRvSW1wb3J0JyxcbiAgJ3Byb2plY3REaWRBdXRvSW1wb3J0JyxcbiAgJ3dpbGxCdWlsZEVudGl0aWVzJyxcbiAgJ2RpZEJ1aWxkRW50aXRpZXMnLFxuICAncmVnaXN0cmllc0RpZExvYWQnXG5dXG5cbmNsYXNzIFByb2plY3Qge1xuICBjb25zdHJ1Y3RvciAodXJpLCBvcHRpb25zID0ge30pIHtcbiAgICBkZWJ1ZygncHJvamVjdCBjcmVhdGVkIGF0OiAnICsgdXJpKVxuICAgIGRlYnVnKCdPcHRpb24ga2V5czogJyArIE9iamVjdC5rZXlzKG9wdGlvbnMpKVxuXG4gICAgdXJpLnNob3VsZC5iZS5hLlN0cmluZygpXG4gICAgdXJpLnNob3VsZC5ub3QuYmUuZW1wdHkoKVxuXG4gICAgbm9ybWFsaXplT3B0aW9ucyhvcHRpb25zKVxuXG4gICAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgICBwcm9qZWN0LnVyaSA9IHVyaVxuICAgIHByb2plY3Qucm9vdCA9IGRpcm5hbWUodXJpKVxuICAgIHByb2plY3QudHlwZSA9IG9wdGlvbnMudHlwZSB8fCAncHJvamVjdCdcblxuICAgIHByb2plY3QuaGlkZGVuKCdvcHRpb25zJywgKCkgPT4gb3B0aW9ucylcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9qZWN0LCAnbWFuaWZlc3QnLCB7XG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBvcHRpb25zLm1hbmlmZXN0IHx8IHt9XG4gICAgfSlcblxuICAgIC8vIGF1dG9iaW5kIGhvb2tzIGZ1bmN0aW9ucyBwYXNzZWQgaW4gYXMgb3B0aW9uc1xuICAgIHByb2plY3QuaGlkZGVuKCdob29rcycsIHNldHVwSG9va3MuY2FsbChwcm9qZWN0LCBvcHRpb25zLmhvb2tzKSlcblxuICAgIHByb2plY3QuaGlkZGVuKCdwYXRocycsIHBhdGhzLmJpbmQocHJvamVjdCkpXG5cbiAgICBwcm9qZWN0LmhpZGRlbigncmVnaXN0cmllcycsIHJlZ2lzdHJpZXMuY2FsbChwcm9qZWN0KSwgZmFsc2UpXG5cbiAgICBwcm9qZWN0Lm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgYmFzZW5hbWUocHJvamVjdC5yb290KVxuXG4gICAgY29uc3QgcGx1Z2lucyA9IFsgXVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIocHJvamVjdCwgJ2VuYWJsZWRQbHVnaW5zJywgKCkgPT4gcGx1Z2lucylcblxuICAgIGlmIChvcHRpb25zLnBsdWdpbnMpIHtcbiAgICAgIG9wdGlvbnMucGx1Z2lucy5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YocGx1Z2luKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHBsdWdpbi5jYWxsKHRoaXMsIHRoaXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy51c2UocGx1Z2luKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIHByb2plY3QuZW1pdCgnY29udGVudFdpbGxJbml0aWFsaXplJylcbiAgICAvLyB3cmFwIHRoZSBjb250ZW50IGludGVyZmFjZSBpbiBhIGdldHRlciBidXQgbWFrZSBzdXJlXG4gICAgLy8gdGhlIGRvY3VtZW50cyBjb2xsZWN0aW9uIGlzIGxvYWRlZCBhbmQgYXZhaWxhYmxlIHJpZ2h0IGF3YXlcbiAgICBwcm9qZWN0LmhpZGRlbignY29udGVudCcsIGNvbnRlbnQuY2FsbChwcm9qZWN0KSlcblxuICAgIHByb2plY3QuZW1pdCgnY29udGVudERpZEluaXRpYWxpemUnKVxuXG4gICAgaWYgKG9wdGlvbnMuYXV0b0ltcG9ydCAhPT0gZmFsc2UpIHtcbiAgICAgIGRlYnVnKCdydW5uaW5nIGF1dG9pbXBvcnQnLCBvcHRpb25zLmF1dG9Mb2FkKVxuXG4gICAgICBwcm9qZWN0LmVtaXQoJ3Byb2plY3RXaWxsQXV0b0ltcG9ydCcpXG5cbiAgICAgIHJ1bkltcG9ydGVyLmNhbGwocHJvamVjdCwge1xuICAgICAgICB0eXBlOiAob3B0aW9ucy5pbXBvcnRlclR5cGUgfHwgJ2Rpc2snKSxcbiAgICAgICAgYXV0b0xvYWQ6IG9wdGlvbnMuYXV0b0xvYWQgfHwge1xuICAgICAgICAgIGRvY3VtZW50czogdHJ1ZSxcbiAgICAgICAgICBhc3NldHM6IHRydWUsXG4gICAgICAgICAgdmVjdG9yczogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBwcm9qZWN0LmVtaXQoJ3Byb2plY3REaWRBdXRvSW1wb3J0JylcbiAgICB9XG5cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHByb2plY3QsICdzdXBwb3J0ZWRBc3NldEV4dGVuc2lvbnMnLCAoKSA9PiBBc3NldHMuQXNzZXQuU3VwcG9ydGVkRXh0ZW5zaW9ucyApXG5cbiAgICAvLyBsYXp5IGxvYWQgLyBtZW1vaXplIHRoZSBlbnRpdHkgYnVpbGRlclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9qZWN0LCAnZW50aXRpZXMnLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVsZXRlIHByb2plY3QuZW50aXRpZXNcbiAgICAgICAgZGVidWcoJ2J1aWxkaW5nIGVudGl0aWVzJylcblxuICAgICAgICBwcm9qZWN0LmVtaXQoJ3dpbGxCdWlsZEVudGl0aWVzJylcbiAgICAgICAgcHJvamVjdC5lbnRpdGllcyA9IGVudGl0aWVzLmNhbGwocHJvamVjdClcbiAgICAgICAgcHJvamVjdC5lbWl0KCdkaWRCdWlsZEVudGl0aWVzJywgcHJvamVjdCwgcHJvamVjdC5lbnRpdGllcylcblxuICAgICAgICByZXR1cm4gcHJvamVjdC5lbnRpdGllc1xuICAgICAgfVxuICAgIH0pXG5cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHByb2plY3QsICdtb2RlbERlZmluaXRpb25zJywgbW9kZWxEZWZpbml0aW9ucy5iaW5kKHRoaXMpKVxuICB9XG5cbiAgZW1pdChuYW1lLCAuLi5hcmdzKSB7XG4gICAgbGV0IHByb2plY3QgPSB0aGlzXG4gICAgbGV0IGZuID0gcHJvamVjdC5ob29rc1tuYW1lXSB8fCBwcm9qZWN0W25hbWVdXG4gICAgaWYgKGZuKSB7IGZuLmNhbGwocHJvamVjdCwgLi4uYXJncykgfVxuICB9XG5cbiAgLyoqXG4gICAqIEEgcHJveHkgb2JqZWN0IHRoYXQgbGV0cyB5b3UgcnVuIG9uZSBvZiB0aGUgcHJvamVjdCBoZWxwZXJzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBwcm9qZWN0LnJ1bi5pbXBvcnRlcignZGlzaycpXG4gICAqIHByb2plY3QucnVuLmFjdGlvbignc25hcHNob3RzL3NhdmUnLCAnL3BhdGgvdG8vc25hcHNob3QuanNvbicpXG4gICAqXG4gICAqL1xuICBnZXQgcnVuKCkge1xuICAgIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbiAoaGVscGVySWQsIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gICAgICAgIGNvbnRleHQucHJvamVjdCA9IGNvbnRleHQucHJvamVjdCB8fCBvcHRpb25zLnByb2plY3QgfHwgcHJvamVjdFxuICAgICAgICByZXR1cm4gcHJvamVjdC5hY3Rpb25zLnJ1bihoZWxwZXJJZCwgb3B0aW9ucywgY29udGV4dClcbiAgICAgIH0sXG5cbiAgICAgIGltcG9ydGVyIChoZWxwZXJJZCwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgICAgICAgY29udGV4dC5wcm9qZWN0ID0gY29udGV4dC5wcm9qZWN0IHx8IG9wdGlvbnMucHJvamVjdCB8fCBwcm9qZWN0XG4gICAgICAgIHJldHVybiBwcm9qZWN0LmltcG9ydGVycy5ydW4oaGVscGVySWQsIG9wdGlvbnMsIGNvbnRleHQpXG4gICAgICB9LFxuXG4gICAgICBleHBvcnRlciAoaGVscGVySWQsIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gICAgICAgIGNvbnRleHQucHJvamVjdCA9IGNvbnRleHQucHJvamVjdCB8fCBvcHRpb25zLnByb2plY3QgfHwgcHJvamVjdFxuICAgICAgICByZXR1cm4gcHJvamVjdC5leHBvcnRlcnMucnVuKGhlbHBlcklkLCBvcHRpb25zLCBjb250ZXh0KVxuICAgICAgfSxcblxuICAgICAgcGx1Z2luIChoZWxwZXJJZCwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgICAgICAgY29udGV4dC5wcm9qZWN0ID0gY29udGV4dC5wcm9qZWN0IHx8IG9wdGlvbnMucHJvamVjdCB8fCBwcm9qZWN0XG4gICAgICAgIHJldHVybiBwcm9qZWN0LnBsdWdpbnMucnVuKGhlbHBlcklkLCBvcHRpb25zLCBjb250ZXh0KVxuICAgICAgfSxcblxuICAgICAgbW9kZWwgKGhlbHBlcklkLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICAgICAgICBjb250ZXh0LnByb2plY3QgPSBjb250ZXh0LnByb2plY3QgfHwgb3B0aW9ucy5wcm9qZWN0IHx8IHByb2plY3RcbiAgICAgICAgcmV0dXJuIHByb2plY3QubW9kZWxzLnJ1bihoZWxwZXJJZCwgb3B0aW9ucywgY29udGV4dClcbiAgICAgIH0sXG5cbiAgICAgIHJlbmRlcmVyIChoZWxwZXJJZCwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgICAgICAgY29udGV4dC5wcm9qZWN0ID0gY29udGV4dC5wcm9qZWN0IHx8IG9wdGlvbnMucHJvamVjdCB8fCBwcm9qZWN0XG4gICAgICAgIHJldHVybiBwcm9qZWN0LnJlbmRlcmVycy5ydW4oaGVscGVySWQsIG9wdGlvbnMsIGNvbnRleHQpXG4gICAgICB9LFxuXG4gICAgICB2aWV3IChoZWxwZXJJZCwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgICAgICAgY29udGV4dC5wcm9qZWN0ID0gY29udGV4dC5wcm9qZWN0IHx8IG9wdGlvbnMucHJvamVjdCB8fCBwcm9qZWN0XG4gICAgICAgIHJldHVybiBwcm9qZWN0LnZpZXdzLnJ1bihoZWxwZXJJZCwgb3B0aW9ucywgY29udGV4dClcbiAgICAgIH1cblxuICAgIH1cbiAgfVxuXG4gIHF1ZXJ5IChzb3VyY2UsIHBhcmFtcykge1xuICAgIHNvdXJjZSA9IGAkeyBzb3VyY2UgfWAudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgKHNvdXJjZSA9PT0gJ2RvY3MnIHx8IHNvdXJjZSA9PT0gJ2RvY3VtZW50cycpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvY3MucXVlcnkocGFyYW1zKVxuICAgIH1cblxuICAgIGlmIChzb3VyY2UgPT09ICdkYXRhJyB8fCBzb3VyY2UgPT09ICdkYXRhc291cmNlcycgfHwgc291cmNlID09PSAnZGF0YV9zb3VyY2VzJykge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5kYXRhX3NvdXJjZXMucXVlcnkocGFyYW1zKVxuICAgIH1cblxuICAgIGlmIChbJ2Fzc2V0cycsJ3NjcmlwdHMnLCdzdHlsZXNoZWV0cycsJ2ltYWdlcycsJ3ZlY3RvcnMnXS5pbmRleE9mKHNvdXJjZSkgPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudFtzb3VyY2VdLnF1ZXJ5KHBhcmFtcylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tb2RlbEdyb3Vwcy5pbmRleE9mKHNvdXJjZSkgPiAwKSB7XG4gICAgICByZXR1cm4gdXRpbC5maWx0ZXJRdWVyeSh1dGlsLnZhbHVlcyh0aGlzLmVudGl0aWVzW3NvdXJjZV0pLCBwYXJhbXMpXG4gICAgfVxuICB9XG5cbiAgcXVlcnlIZWxwZXJzKHNvdXJjZSwgcGFyYW1zKSB7XG4gICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXNbc291cmNlXS5xdWVyeShwYXJhbXMpXG4gIH1cblxuICBnZXQgYXNzZXRNYW5pZmVzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwb3J0ZXJzLnJ1bignYXNzZXRfbWFuaWZlc3QnLCB7XG4gICAgICBwcm9qZWN0OiB0aGlzXG4gICAgfSlcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIG9mIHRoaXMgcHJvamVjdCdzIGNvbnRlbnQgY29sbGVjdGlvbnMuXG4gICAqL1xuICBnZXQgY29sbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHV0aWwudmFsdWVzKHRoaXMuY29udGVudClcbiAgfVxuXG4gIGdldCBhbGxBc3NldHMgKCkge1xuICAgIHJldHVybiB1dGlsLmZsYXR0ZW4odGhpcy5jb2xsZWN0aW9ucy5tYXAoYyA9PiBjLmFsbCkpXG4gIH1cblxuICBnZXQgYXNzZXRQYXRocyAoKXtcbiAgICByZXR1cm4gdGhpcy5hbGxBc3NldHMubWFwKGEgPT4gYS5wYXRocy5wcm9qZWN0KVxuICB9XG5cbiAgZWFjaEFzc2V0ICguLi5hcmdzKSB7XG4gICAgIHJldHVybiB0aGlzLmFsbEFzc2V0cy5mb3JFYWNoKC4uLmFyZ3MpXG4gIH1cblxuICByZWR1Y2VBc3NldHMoLi4uYXJncykge1xuICAgICByZXR1cm4gdGhpcy5hbGxBc3NldHMucmVkdWNlKC4uLmFyZ3MpXG4gIH1cblxuICBtYXBBc3NldHMoLi4uYXJncykge1xuICAgICByZXR1cm4gdGhpcy5hbGxBc3NldHMubWFwKC4uLmFyZ3MpXG4gIH1cblxuICBmaWx0ZXJBc3NldHMoLi4uYXJncykge1xuICAgICByZXR1cm4gdGhpcy5hbGxBc3NldHMuZmlsdGVyKC4uLmFyZ3MpXG4gIH1cblxuICAvKipcbiAgKiBBY2Nlc3MgYSBkb2N1bWVudCBieSB0aGUgZG9jdW1lbnQgaWQgc2hvcnQgaGFuZFxuICAqXG4gICogRG9jdW1lbnRzIGFyZSB0aGUgbW9zdCBpbXBvcnRhbnQgcGFydCBvZiBhIFNreXBhZ2VyIHByb2plY3QsIHNvIG1ha2UgaXQgZWFzeSB0byBhY2Nlc3MgdGhlbVxuICAqXG4gICovXG4gICBhdCAoZG9jdW1lbnRJZCkge1xuICAgICByZXR1cm4gdGhpcy5kb2N1bWVudHMuYXQoZG9jdW1lbnRJZClcbiAgIH1cblxuICAvKipcbiAgKiBUaGlzIGlzIGEgc3lzdGVtIGZvciByZXNvbHZpbmcgcGF0aHMgaW4gdGhlIHByb2plY3QgdHJlZSB0byB0aGVcbiAgKiBhcHByb3ByaWF0ZSBoZWxwZXIsIG9yIHJlc29sdmluZyBwYXRocyB0byB0aGUgbGlua3MgdG8gdGhlc2UgcGF0aHNcbiAgKiBpbiBzb21lIG90aGVyIHN5c3RlbSAobGlrZSBhIHdlYiBzaXRlKVxuICAqL1xuICBnZXQgcmVzb2x2ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVzb2x2ZXJcbiAgfVxuXG4gIC8qKlxuICAqIEBhbGlhcyBQcm9qZWN0I3Jlc29sdmVcbiAgKi9cbiAgZ2V0IHJlc29sdmVyICgpIHtcbiAgICByZXR1cm4gcmVzb2x2ZXIuY2FsbCh0aGlzKVxuICB9XG5cbiAgLyoqXG4gICogVXNlIGEgcGx1Z2luIGZyb20gdGhlIHBsdWdpbnMgcmVnaXN0cnlcbiAgKlxuICAqL1xuICB1c2UgKHBsdWdpbnMsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICh0eXBlb2YgcGx1Z2lucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBsdWdpbnMgPSBbcGx1Z2luc11cbiAgICB9XG5cbiAgICBwbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgIGxldCBwbHVnaW5Db25maWcgPSB0aGlzLnBsdWdpbnMubG9va3VwKHBsdWdpbilcblxuICAgICAgaWYgKHBsdWdpbkNvbmZpZyAmJiBwbHVnaW5Db25maWcuYXBpICYmIHBsdWdpbkNvbmZpZy5hcGkubW9kaWZ5KSB7XG4gICAgICAgIG9wdGlvbnMucHJvamVjdCA9IG9wdGlvbnMucHJvamVjdCB8fCB0aGlzXG4gICAgICAgIHBsdWdpbkNvbmZpZy5hcGkubW9kaWZ5KG9wdGlvbnMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHBsdWdpbkNvbmZpZy5hcGkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBwbHVnaW5Db25maWcuYXBpLmNhbGwodGhpcywgdGhpcywgcGx1Z2luQ29uZmlnKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW5hYmxlZFBsdWdpbnMucHVzaChwbHVnaW4pXG4gICAgfSlcbiAgfVxuXG4gIC8qXG4gICogQWxpYXNlcyB0byBjcmVhdGUgaGlkZGVuIGFuZCBsYXp5IGdldHRlcnMgb24gdGhlIHByb2plY3RcbiAgKi9cbiAgaGlkZGVuICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmhpZGRlbi5nZXR0ZXIodGhpcywgLi4uYXJncykgfVxuICBsYXp5ICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmxhenkodGhpcywgLi4uYXJncykgfVxuXG4gIC8qKlxuICAgKiBidWlsZCBhIHBhdGggZnJvbSBhIGJhc2UgKGUuZy4gZG9jdW1lbnRzLCBtb2RlbHMsIGJ1aWxkKVxuICAgKiB1c2luZyBwYXRoLmpvaW5cbiAgICovXG4gIHBhdGggKGJhc2UsIC4uLnJlc3QpIHtcbiAgICByZXR1cm4gam9pbih0aGlzLnBhdGhzW2Jhc2VdLCAuLi5yZXN0KVxuICB9XG5cbiAgam9pbiguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0aHMuam9pbiguLi5hcmdzKVxuICB9XG5cbiAgLyoqXG4gICogQ29sbGVjdGlvbiBBY2Nlc3NvciBNZXRob2RzXG4gICpcbiAgKiBUaGVzZSBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgZG9jdW1lbnQgY29sbGVjdGlvbnMgd2l0aGluIHRoZSBwcm9qZWN0XG4gICovXG4gIGdldCBkb2NzICgpIHtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudHNcbiAgfVxuXG4gIGdldCBkb2N1bWVudHMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZG9jdW1lbnRzXG4gIH1cblxuICBnZXQgZGF0YV9zb3VyY2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50LmRhdGFfc291cmNlc1xuICB9XG5cbiAgZ2V0IGRhdGEgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YV9zb3VyY2VzXG4gIH1cblxuICBnZXQgY29sbGVjdGlvbnMgKCkge1xuICAgIHJldHVybiB1dGlsLnZhbHVlcyh0aGlzLmNvbnRlbnQpXG4gIH1cblxuICBnZXQgYWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5hY3Rpb25zXG4gIH1cblxuICBnZXQgY29udGV4dHMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuY29udGV4dHNcbiAgfVxuXG4gIGdldCBleHBvcnRlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuZXhwb3J0ZXJzXG4gIH1cblxuICBnZXQgaW1wb3J0ZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmltcG9ydGVyc1xuICB9XG5cbiAgZ2V0IHBsdWdpbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMucGx1Z2luc1xuICB9XG5cbiAgZ2V0IG1vZGVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5tb2RlbHNcbiAgfVxuXG4gIGdldCBzdG9yZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuc3RvcmVzXG4gIH1cblxuICBnZXQgcmVuZGVyZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnJlbmRlcmVyc1xuICB9XG5cbiAgZ2V0IHZpZXdzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnZpZXdzXG4gIH1cblxuICBnZXQgbW9kZWxHcm91cHMgKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVscy5hbGwubWFwKG1vZGVsID0+XG4gICAgICB1dGlsLnRhYmVsaXplKHV0aWwudW5kZXJzY29yZShtb2RlbC5uYW1lKSlcbiAgICApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9qZWN0XG5cbmZ1bmN0aW9uIHBhdGhzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgbGV0IGNvbnZlbnRpb25hbCA9IHtcbiAgICBhc3NldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgYWN0aW9uczogam9pbih0aGlzLnJvb3QsICdhY3Rpb25zJyksXG4gICAgY29udGV4dHM6IGpvaW4odGhpcy5yb290LCAnY29udGV4dHMnKSxcbiAgICBkYXRhX3NvdXJjZXM6IGpvaW4odGhpcy5yb290LCAnZGF0YScpLFxuICAgIGRvY3VtZW50czogam9pbih0aGlzLnJvb3QsICdkb2NzJyksXG4gICAgZXhwb3J0ZXJzOiBqb2luKHRoaXMucm9vdCwgJ2V4cG9ydGVycycpLFxuICAgIGltcG9ydGVyczogam9pbih0aGlzLnJvb3QsICdpbXBvcnRlcnMnKSxcbiAgICBtb2RlbHM6IGpvaW4odGhpcy5yb290LCAnbW9kZWxzJyksXG4gICAgcGx1Z2luczogam9pbih0aGlzLnJvb3QsICdwbHVnaW5zJyksXG4gICAgcmVuZGVyZXJzOiBqb2luKHRoaXMucm9vdCwgJ3JlbmRlcmVycycpLFxuICAgIHZlY3RvcnM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgaW1hZ2VzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIHNjcmlwdHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgc3R5bGVzaGVldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgbWFuaWZlc3Q6IGpvaW4odGhpcy5yb290LCAncGFja2FnZS5qc29uJyksXG4gICAgY2FjaGU6IGpvaW4odGhpcy5yb290LCAndG1wJywgJ2NhY2hlJyksXG4gICAgbG9nczogam9pbih0aGlzLnJvb3QsICdsb2cnKSxcbiAgICBidWlsZDogam9pbih0aGlzLnJvb3QsICdkaXN0JyksXG4gICAgcHVibGljOiBqb2luKHRoaXMucm9vdCwgJ3B1YmxpYycpLFxuICAgIGpvaW46IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICByZXR1cm4gam9pbihwcm9qZWN0LnJvb3QsIC4uLmFyZ3MpXG4gICAgfVxuICB9XG5cbiAgbGV0IGN1c3RvbSA9IHByb2plY3Qub3B0aW9ucy5wYXRocyB8fCBwcm9qZWN0Lm1hbmlmZXN0LnBhdGhzIHx8IHt9XG5cbiAgcmV0dXJuIHV0aWwuYXNzaWduKGNvbnZlbnRpb25hbCwgY3VzdG9tKVxufVxuXG5mdW5jdGlvbiBjb250ZW50ICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCBjb2xsZWN0aW9ucyA9IGJ1aWxkQ29udGVudENvbGxlY3Rpb25zTWFudWFsbHkuY2FsbChwcm9qZWN0KVxuXG4gIHJldHVybiBjb2xsZWN0aW9uc1xufVxuXG5mdW5jdGlvbiBydW5JbXBvcnRlciAob3B0aW9ucyA9IHt9KSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuICBsZXQgY29sbGVjdGlvbnMgPSBwcm9qZWN0LmNvbGxlY3Rpb25zXG4gIGxldCB7IGF1dG9Mb2FkLCBpbXBvcnRlciB9ID0gb3B0aW9uc1xuXG4gIGRlYnVnKCdpbXBvcnQgc3RhcnRpbmcnKVxuICBsZXQgcmVzdWx0ID0gcHJvamVjdC5pbXBvcnRlcnMucnVuKGltcG9ydGVyIHx8ICdkaXNrJywgeyBwcm9qZWN0OiB0aGlzLCBjb2xsZWN0aW9uczogdGhpcy5jb250ZW50LCBhdXRvTG9hZCB9KVxuICBkZWJ1ZygnaW1wb3J0IGZpbmlzaGluZycpXG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiBidWlsZENvbnRlbnRDb2xsZWN0aW9uc01hbnVhbGx5ICgpIHtcbiAgY29uc3QgcHJvamVjdCA9IHRoaXNcbiAgY29uc3QgcGF0aHMgPSBwcm9qZWN0LnBhdGhzXG5cbiAgbGV0IHsgQXNzZXQsIERhdGFTb3VyY2UsIERvY3VtZW50LCBJbWFnZSwgU2NyaXB0LCBTdHlsZXNoZWV0LCBWZWN0b3IgfSA9IEFzc2V0c1xuXG4gIHJldHVybiB7XG4gICAgYXNzZXRzOiBBc3NldC5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBkYXRhX3NvdXJjZXM6IERhdGFTb3VyY2UuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgZG9jdW1lbnRzOiBEb2N1bWVudC5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBpbWFnZXM6IEltYWdlLmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIHNjcmlwdHM6IFNjcmlwdC5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBzdHlsZXNoZWV0czogU3R5bGVzaGVldC5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICB2ZWN0b3JzOiBWZWN0b3IuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBzdG9yZXMgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbn1cblxuZnVuY3Rpb24gcmVnaXN0cmllcyAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuICBsZXQgcm9vdCA9IHByb2plY3Qucm9vdFxuXG4gIGxldCByZWdpc3RyaWVzID0gUmVnaXN0cnkuYnVpbGRBbGwocHJvamVjdCwgSGVscGVycywge3Jvb3R9KVxuXG4gIHByb2plY3QuZW1pdCgncmVnaXN0cmllc0RpZExvYWQnLCByZWdpc3RyaWVzKVxuXG4gIHJldHVybiByZWdpc3RyaWVzXG59XG5cbmZ1bmN0aW9uIG1vZGVsRGVmaW5pdGlvbnMoKSB7XG4gIHJldHVybiB0aGlzLm1vZGVscy5hdmFpbGFibGUucmVkdWNlKChtZW1vLGlkKSA9PiB7XG4gICAgbGV0IG1vZGVsID0gdGhpcy5tb2RlbHMubG9va3VwKGlkKVxuXG4gICAgT2JqZWN0LmFzc2lnbihtZW1vLCB7XG4gICAgICBnZXQgW3V0aWwudGFiZWxpemUodXRpbC51bmRlcnNjb3JlKG1vZGVsLm5hbWUpKV0oKXtcbiAgICAgICAgcmV0dXJuIG1vZGVsLmRlZmluaXRpb25cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIG1lbW9cbiAgfSwge30pXG59XG5cbmZ1bmN0aW9uIGVudGl0aWVzKCkge1xuICByZXR1cm4gdGhpcy5tb2RlbHMuYXZhaWxhYmxlLnJlZHVjZSgobWVtbyxpZCkgPT4ge1xuICAgIGxldCBtb2RlbCA9IHRoaXMubW9kZWxzLmxvb2t1cChpZClcbiAgICBsZXQgZW50aXRpZXMgPSBtb2RlbC5lbnRpdGllcyA9IG1vZGVsLmVudGl0aWVzIHx8IHt9XG5cbiAgICBPYmplY3QuYXNzaWduKG1lbW8sIHtcbiAgICAgIGdldCBbdXRpbC50YWJlbGl6ZSh1dGlsLnVuZGVyc2NvcmUobW9kZWwubmFtZSkpXSgpe1xuICAgICAgICByZXR1cm4gZW50aXRpZXNcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIG1lbW9cbiAgfSwge30pXG59XG5cbmZ1bmN0aW9uIHNldHVwSG9va3MoaG9va3MgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcblxuICByZXR1cm4gT2JqZWN0LmtleXMoaG9va3MpLnJlZHVjZSgobWVtbywgaG9vaykgPT4ge1xuICAgIGxldCBmbiA9IGhvb2tzW2hvb2tdXG5cbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZW1vW2hvb2tdID0gZm4uYmluZChwcm9qZWN0KVxuICAgIH1cblxuICAgIHJldHVybiBtZW1vXG4gIH0sIHt9KVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemVPcHRpb25zIChvcHRpb25zID0ge30pIHtcbiAgaWYgKG9wdGlvbnMubWFuaWZlc3QgJiYgb3B0aW9ucy5tYW5pZmVzdC5za3lwYWdlcikge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKG9wdGlvbnMsIG9wdGlvbnMubWFuaWZlc3Quc2t5cGFnZXIpXG4gIH1cblxuICByZXR1cm4gb3B0aW9uc1xufVxuIl19