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
    key: 'images',
    get: function get() {
      return this.content.images;
    }
  }, {
    key: 'scripts',
    get: function get() {
      return this.content.scripts;
    }
  }, {
    key: 'stylesheets',
    get: function get() {
      return this.content.stylesheets;
    }
  }, {
    key: 'vectors',
    get: function get() {
      return this.content.vectors;
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
    scripts: (0, _path.join)(this.root, 'src'),
    stylesheets: (0, _path.join)(this.root, 'src'),
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
//# sourceMappingURL=data:application/json;base64,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QUMsUUFBUSxJQUFJLEVBQUUsQ0FBQTs7QUFFcEQsVUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLDJDQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsMElBQUc7QUFDaEQsYUFBTyxRQUFRLENBQUE7S0FDaEIsK0VBQ0QsQ0FBQTs7QUFFRixXQUFPLElBQUksQ0FBQTtHQUNaLEVBQUUsRUFBRSxDQUFDLENBQUE7Q0FDUDs7QUFFRCxTQUFTLFVBQVUsR0FBYTtNQUFaLEtBQUsseURBQUcsRUFBRTs7QUFDNUIsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBOztBQUVsQixTQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLElBQUksRUFBSztBQUMvQyxRQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRXBCLFFBQUksT0FBTyxFQUFFLEtBQUssVUFBVSxFQUFFO0FBQzVCLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQzlCOztBQUVELFdBQU8sSUFBSSxDQUFBO0dBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQTtDQUNQOztBQUVELFNBQVMsZ0JBQWdCLEdBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUNyQyxNQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7QUFDakQsV0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDNUQ7O0FBRUQsU0FBTyxPQUFPLENBQUE7Q0FDZiIsImZpbGUiOiJwcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNreXBhZ2VyIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgbWQ1IGZyb20gJ21kNSdcblxuaW1wb3J0IFJlZ2lzdHJ5IGZyb20gJy4vcmVnaXN0cnknXG5pbXBvcnQgQ29sbGVjdGlvbiBmcm9tICcuL2NvbGxlY3Rpb24nXG5pbXBvcnQgcmVzb2x2ZXIgZnJvbSAnLi9yZXNvbHZlcidcblxuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgKiBhcyBBc3NldHMgZnJvbSAnLi9hc3NldHMnXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcblxuaW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSwgam9pbiwgYmFzZW5hbWUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgX2RlYnVnIGZyb20gJ2RlYnVnJ1xuXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1Zygnc2t5cGFnZXI6cHJvamVjdCcpXG5jb25zdCBoaWRlID0gdXRpbC5oaWRlLmdldHRlclxuY29uc3QgbGF6eSA9IHV0aWwubGF6eVxuXG5jb25zdCBIT09LUyA9IFtcbiAgJ2NvbnRlbnRXaWxsSW5pdGlhbGl6ZScsXG4gICdjb250ZW50RGlkSW5pdGlhbGl6ZScsXG4gICdwcm9qZWN0V2lsbEF1dG9JbXBvcnQnLFxuICAncHJvamVjdERpZEF1dG9JbXBvcnQnLFxuICAnd2lsbEJ1aWxkRW50aXRpZXMnLFxuICAnZGlkQnVpbGRFbnRpdGllcycsXG4gICdyZWdpc3RyaWVzRGlkTG9hZCdcbl1cblxuY2xhc3MgUHJvamVjdCB7XG4gIGNvbnN0cnVjdG9yICh1cmksIG9wdGlvbnMgPSB7fSkge1xuICAgIGRlYnVnKCdwcm9qZWN0IGNyZWF0ZWQgYXQ6ICcgKyB1cmkpXG4gICAgZGVidWcoJ09wdGlvbiBrZXlzOiAnICsgT2JqZWN0LmtleXMob3B0aW9ucykpXG5cbiAgICB1cmkuc2hvdWxkLmJlLmEuU3RyaW5nKClcbiAgICB1cmkuc2hvdWxkLm5vdC5iZS5lbXB0eSgpXG5cbiAgICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpXG5cbiAgICBsZXQgcHJvamVjdCA9IHRoaXNcblxuICAgIHByb2plY3QudXJpID0gdXJpXG4gICAgcHJvamVjdC5yb290ID0gZGlybmFtZSh1cmkpXG4gICAgcHJvamVjdC50eXBlID0gb3B0aW9ucy50eXBlIHx8ICdwcm9qZWN0J1xuXG4gICAgcHJvamVjdC5oaWRkZW4oJ29wdGlvbnMnLCAoKSA9PiBvcHRpb25zKVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2plY3QsICdtYW5pZmVzdCcsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IG9wdGlvbnMubWFuaWZlc3QgfHwge31cbiAgICB9KVxuXG4gICAgLy8gYXV0b2JpbmQgaG9va3MgZnVuY3Rpb25zIHBhc3NlZCBpbiBhcyBvcHRpb25zXG4gICAgcHJvamVjdC5oaWRkZW4oJ2hvb2tzJywgc2V0dXBIb29rcy5jYWxsKHByb2plY3QsIG9wdGlvbnMuaG9va3MpKVxuXG4gICAgcHJvamVjdC5oaWRkZW4oJ3BhdGhzJywgcGF0aHMuYmluZChwcm9qZWN0KSlcblxuICAgIHByb2plY3QuaGlkZGVuKCdyZWdpc3RyaWVzJywgcmVnaXN0cmllcy5jYWxsKHByb2plY3QpLCBmYWxzZSlcblxuICAgIHByb2plY3QubmFtZSA9IG9wdGlvbnMubmFtZSB8fCBiYXNlbmFtZShwcm9qZWN0LnJvb3QpXG5cbiAgICBjb25zdCBwbHVnaW5zID0gWyBdXG4gICAgdXRpbC5oaWRlLmdldHRlcihwcm9qZWN0LCAnZW5hYmxlZFBsdWdpbnMnLCAoKSA9PiBwbHVnaW5zKVxuXG4gICAgaWYgKG9wdGlvbnMucGx1Z2lucykge1xuICAgICAgb3B0aW9ucy5wbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZihwbHVnaW4pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcGx1Z2luLmNhbGwodGhpcywgdGhpcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVzZShwbHVnaW4pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJvamVjdC5lbWl0KCdjb250ZW50V2lsbEluaXRpYWxpemUnKVxuICAgIC8vIHdyYXAgdGhlIGNvbnRlbnQgaW50ZXJmYWNlIGluIGEgZ2V0dGVyIGJ1dCBtYWtlIHN1cmVcbiAgICAvLyB0aGUgZG9jdW1lbnRzIGNvbGxlY3Rpb24gaXMgbG9hZGVkIGFuZCBhdmFpbGFibGUgcmlnaHQgYXdheVxuICAgIHByb2plY3QuaGlkZGVuKCdjb250ZW50JywgY29udGVudC5jYWxsKHByb2plY3QpKVxuXG4gICAgcHJvamVjdC5lbWl0KCdjb250ZW50RGlkSW5pdGlhbGl6ZScpXG5cbiAgICBpZiAob3B0aW9ucy5hdXRvSW1wb3J0ICE9PSBmYWxzZSkge1xuICAgICAgZGVidWcoJ3J1bm5pbmcgYXV0b2ltcG9ydCcsIG9wdGlvbnMuYXV0b0xvYWQpXG5cbiAgICAgIHByb2plY3QuZW1pdCgncHJvamVjdFdpbGxBdXRvSW1wb3J0JylcblxuICAgICAgcnVuSW1wb3J0ZXIuY2FsbChwcm9qZWN0LCB7XG4gICAgICAgIHR5cGU6IChvcHRpb25zLmltcG9ydGVyVHlwZSB8fCAnZGlzaycpLFxuICAgICAgICBhdXRvTG9hZDogb3B0aW9ucy5hdXRvTG9hZCB8fCB7XG4gICAgICAgICAgZG9jdW1lbnRzOiB0cnVlLFxuICAgICAgICAgIGFzc2V0czogdHJ1ZSxcbiAgICAgICAgICB2ZWN0b3JzOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHByb2plY3QuZW1pdCgncHJvamVjdERpZEF1dG9JbXBvcnQnKVxuICAgIH1cblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIocHJvamVjdCwgJ3N1cHBvcnRlZEFzc2V0RXh0ZW5zaW9ucycsICgpID0+IEFzc2V0cy5Bc3NldC5TdXBwb3J0ZWRFeHRlbnNpb25zIClcblxuICAgIC8vIGxhenkgbG9hZCAvIG1lbW9pemUgdGhlIGVudGl0eSBidWlsZGVyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2plY3QsICdlbnRpdGllcycsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWxldGUgcHJvamVjdC5lbnRpdGllc1xuICAgICAgICBkZWJ1ZygnYnVpbGRpbmcgZW50aXRpZXMnKVxuXG4gICAgICAgIHByb2plY3QuZW1pdCgnd2lsbEJ1aWxkRW50aXRpZXMnKVxuICAgICAgICBwcm9qZWN0LmVudGl0aWVzID0gZW50aXRpZXMuY2FsbChwcm9qZWN0KVxuICAgICAgICBwcm9qZWN0LmVtaXQoJ2RpZEJ1aWxkRW50aXRpZXMnLCBwcm9qZWN0LCBwcm9qZWN0LmVudGl0aWVzKVxuXG4gICAgICAgIHJldHVybiBwcm9qZWN0LmVudGl0aWVzXG4gICAgICB9XG4gICAgfSlcblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIocHJvamVjdCwgJ21vZGVsRGVmaW5pdGlvbnMnLCBtb2RlbERlZmluaXRpb25zLmJpbmQodGhpcykpXG4gIH1cblxuICBlbWl0KG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgICBsZXQgZm4gPSBwcm9qZWN0Lmhvb2tzW25hbWVdIHx8IHByb2plY3RbbmFtZV1cbiAgICBpZiAoZm4pIHsgZm4uY2FsbChwcm9qZWN0LCAuLi5hcmdzKSB9XG4gIH1cblxuICAvKipcbiAgICogQSBwcm94eSBvYmplY3QgdGhhdCBsZXRzIHlvdSBydW4gb25lIG9mIHRoZSBwcm9qZWN0IGhlbHBlcnMuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHByb2plY3QucnVuLmltcG9ydGVyKCdkaXNrJylcbiAgICogcHJvamVjdC5ydW4uYWN0aW9uKCdzbmFwc2hvdHMvc2F2ZScsICcvcGF0aC90by9zbmFwc2hvdC5qc29uJylcbiAgICpcbiAgICovXG4gIGdldCBydW4oKSB7XG4gICAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgICByZXR1cm4ge1xuICAgICAgYWN0aW9uIChoZWxwZXJJZCwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgICAgICAgY29udGV4dC5wcm9qZWN0ID0gY29udGV4dC5wcm9qZWN0IHx8IG9wdGlvbnMucHJvamVjdCB8fCBwcm9qZWN0XG4gICAgICAgIHJldHVybiBwcm9qZWN0LmFjdGlvbnMucnVuKGhlbHBlcklkLCBvcHRpb25zLCBjb250ZXh0KVxuICAgICAgfSxcblxuICAgICAgaW1wb3J0ZXIgKGhlbHBlcklkLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICAgICAgICBjb250ZXh0LnByb2plY3QgPSBjb250ZXh0LnByb2plY3QgfHwgb3B0aW9ucy5wcm9qZWN0IHx8IHByb2plY3RcbiAgICAgICAgcmV0dXJuIHByb2plY3QuaW1wb3J0ZXJzLnJ1bihoZWxwZXJJZCwgb3B0aW9ucywgY29udGV4dClcbiAgICAgIH0sXG5cbiAgICAgIGV4cG9ydGVyIChoZWxwZXJJZCwgb3B0aW9ucyA9IHt9LCBjb250ZXh0ID0ge30pIHtcbiAgICAgICAgY29udGV4dC5wcm9qZWN0ID0gY29udGV4dC5wcm9qZWN0IHx8IG9wdGlvbnMucHJvamVjdCB8fCBwcm9qZWN0XG4gICAgICAgIHJldHVybiBwcm9qZWN0LmV4cG9ydGVycy5ydW4oaGVscGVySWQsIG9wdGlvbnMsIGNvbnRleHQpXG4gICAgICB9LFxuXG4gICAgICBwbHVnaW4gKGhlbHBlcklkLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICAgICAgICBjb250ZXh0LnByb2plY3QgPSBjb250ZXh0LnByb2plY3QgfHwgb3B0aW9ucy5wcm9qZWN0IHx8IHByb2plY3RcbiAgICAgICAgcmV0dXJuIHByb2plY3QucGx1Z2lucy5ydW4oaGVscGVySWQsIG9wdGlvbnMsIGNvbnRleHQpXG4gICAgICB9LFxuXG4gICAgICBtb2RlbCAoaGVscGVySWQsIG9wdGlvbnMgPSB7fSwgY29udGV4dCA9IHt9KSB7XG4gICAgICAgIGNvbnRleHQucHJvamVjdCA9IGNvbnRleHQucHJvamVjdCB8fCBvcHRpb25zLnByb2plY3QgfHwgcHJvamVjdFxuICAgICAgICByZXR1cm4gcHJvamVjdC5tb2RlbHMucnVuKGhlbHBlcklkLCBvcHRpb25zLCBjb250ZXh0KVxuICAgICAgfSxcblxuICAgICAgcmVuZGVyZXIgKGhlbHBlcklkLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICAgICAgICBjb250ZXh0LnByb2plY3QgPSBjb250ZXh0LnByb2plY3QgfHwgb3B0aW9ucy5wcm9qZWN0IHx8IHByb2plY3RcbiAgICAgICAgcmV0dXJuIHByb2plY3QucmVuZGVyZXJzLnJ1bihoZWxwZXJJZCwgb3B0aW9ucywgY29udGV4dClcbiAgICAgIH0sXG5cbiAgICAgIHZpZXcgKGhlbHBlcklkLCBvcHRpb25zID0ge30sIGNvbnRleHQgPSB7fSkge1xuICAgICAgICBjb250ZXh0LnByb2plY3QgPSBjb250ZXh0LnByb2plY3QgfHwgb3B0aW9ucy5wcm9qZWN0IHx8IHByb2plY3RcbiAgICAgICAgcmV0dXJuIHByb2plY3Qudmlld3MucnVuKGhlbHBlcklkLCBvcHRpb25zLCBjb250ZXh0KVxuICAgICAgfVxuXG4gICAgfVxuICB9XG5cbiAgcXVlcnkgKHNvdXJjZSwgcGFyYW1zKSB7XG4gICAgc291cmNlID0gYCR7IHNvdXJjZSB9YC50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAoc291cmNlID09PSAnZG9jcycgfHwgc291cmNlID09PSAnZG9jdW1lbnRzJykge1xuICAgICAgcmV0dXJuIHRoaXMuZG9jcy5xdWVyeShwYXJhbXMpXG4gICAgfVxuXG4gICAgaWYgKHNvdXJjZSA9PT0gJ2RhdGEnIHx8IHNvdXJjZSA9PT0gJ2RhdGFzb3VyY2VzJyB8fCBzb3VyY2UgPT09ICdkYXRhX3NvdXJjZXMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50LmRhdGFfc291cmNlcy5xdWVyeShwYXJhbXMpXG4gICAgfVxuXG4gICAgaWYgKFsnYXNzZXRzJywnc2NyaXB0cycsJ3N0eWxlc2hlZXRzJywnaW1hZ2VzJywndmVjdG9ycyddLmluZGV4T2Yoc291cmNlKSA+PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb250ZW50W3NvdXJjZV0ucXVlcnkocGFyYW1zKVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1vZGVsR3JvdXBzLmluZGV4T2Yoc291cmNlKSA+IDApIHtcbiAgICAgIHJldHVybiB1dGlsLmZpbHRlclF1ZXJ5KHV0aWwudmFsdWVzKHRoaXMuZW50aXRpZXNbc291cmNlXSksIHBhcmFtcylcbiAgICB9XG4gIH1cblxuICBxdWVyeUhlbHBlcnMoc291cmNlLCBwYXJhbXMpIHtcbiAgICAgcmV0dXJuIHRoaXMucmVnaXN0cmllc1tzb3VyY2VdLnF1ZXJ5KHBhcmFtcylcbiAgfVxuXG4gIGdldCBhc3NldE1hbmlmZXN0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5leHBvcnRlcnMucnVuKCdhc3NldF9tYW5pZmVzdCcsIHtcbiAgICAgIHByb2plY3Q6IHRoaXNcbiAgICB9KVxuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBhbGwgb2YgdGhpcyBwcm9qZWN0J3MgY29udGVudCBjb2xsZWN0aW9ucy5cbiAgICovXG4gIGdldCBjb2xsZWN0aW9ucygpIHtcbiAgICByZXR1cm4gdXRpbC52YWx1ZXModGhpcy5jb250ZW50KVxuICB9XG5cbiAgZ2V0IGFsbEFzc2V0cyAoKSB7XG4gICAgcmV0dXJuIHV0aWwuZmxhdHRlbih0aGlzLmNvbGxlY3Rpb25zLm1hcChjID0+IGMuYWxsKSlcbiAgfVxuXG4gIGdldCBhc3NldFBhdGhzICgpe1xuICAgIHJldHVybiB0aGlzLmFsbEFzc2V0cy5tYXAoYSA9PiBhLnBhdGhzLnByb2plY3QpXG4gIH1cblxuICBlYWNoQXNzZXQgKC4uLmFyZ3MpIHtcbiAgICAgcmV0dXJuIHRoaXMuYWxsQXNzZXRzLmZvckVhY2goLi4uYXJncylcbiAgfVxuXG4gIHJlZHVjZUFzc2V0cyguLi5hcmdzKSB7XG4gICAgIHJldHVybiB0aGlzLmFsbEFzc2V0cy5yZWR1Y2UoLi4uYXJncylcbiAgfVxuXG4gIG1hcEFzc2V0cyguLi5hcmdzKSB7XG4gICAgIHJldHVybiB0aGlzLmFsbEFzc2V0cy5tYXAoLi4uYXJncylcbiAgfVxuXG4gIGZpbHRlckFzc2V0cyguLi5hcmdzKSB7XG4gICAgIHJldHVybiB0aGlzLmFsbEFzc2V0cy5maWx0ZXIoLi4uYXJncylcbiAgfVxuXG4gIC8qKlxuICAqIEFjY2VzcyBhIGRvY3VtZW50IGJ5IHRoZSBkb2N1bWVudCBpZCBzaG9ydCBoYW5kXG4gICpcbiAgKiBEb2N1bWVudHMgYXJlIHRoZSBtb3N0IGltcG9ydGFudCBwYXJ0IG9mIGEgU2t5cGFnZXIgcHJvamVjdCwgc28gbWFrZSBpdCBlYXN5IHRvIGFjY2VzcyB0aGVtXG4gICpcbiAgKi9cbiAgIGF0IChkb2N1bWVudElkKSB7XG4gICAgIHJldHVybiB0aGlzLmRvY3VtZW50cy5hdChkb2N1bWVudElkKVxuICAgfVxuXG4gIC8qKlxuICAqIFRoaXMgaXMgYSBzeXN0ZW0gZm9yIHJlc29sdmluZyBwYXRocyBpbiB0aGUgcHJvamVjdCB0cmVlIHRvIHRoZVxuICAqIGFwcHJvcHJpYXRlIGhlbHBlciwgb3IgcmVzb2x2aW5nIHBhdGhzIHRvIHRoZSBsaW5rcyB0byB0aGVzZSBwYXRoc1xuICAqIGluIHNvbWUgb3RoZXIgc3lzdGVtIChsaWtlIGEgd2ViIHNpdGUpXG4gICovXG4gIGdldCByZXNvbHZlICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlclxuICB9XG5cbiAgLyoqXG4gICogQGFsaWFzIFByb2plY3QjcmVzb2x2ZVxuICAqL1xuICBnZXQgcmVzb2x2ZXIgKCkge1xuICAgIHJldHVybiByZXNvbHZlci5jYWxsKHRoaXMpXG4gIH1cblxuICAvKipcbiAgKiBVc2UgYSBwbHVnaW4gZnJvbSB0aGUgcGx1Z2lucyByZWdpc3RyeVxuICAqXG4gICovXG4gIHVzZSAocGx1Z2lucywgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKHR5cGVvZiBwbHVnaW5zID09PSAnc3RyaW5nJykge1xuICAgICAgcGx1Z2lucyA9IFtwbHVnaW5zXVxuICAgIH1cblxuICAgIHBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgbGV0IHBsdWdpbkNvbmZpZyA9IHRoaXMucGx1Z2lucy5sb29rdXAocGx1Z2luKVxuXG4gICAgICBpZiAocGx1Z2luQ29uZmlnICYmIHBsdWdpbkNvbmZpZy5hcGkgJiYgcGx1Z2luQ29uZmlnLmFwaS5tb2RpZnkpIHtcbiAgICAgICAgb3B0aW9ucy5wcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0IHx8IHRoaXNcbiAgICAgICAgcGx1Z2luQ29uZmlnLmFwaS5tb2RpZnkob3B0aW9ucylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGx1Z2luQ29uZmlnLmFwaSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHBsdWdpbkNvbmZpZy5hcGkuY2FsbCh0aGlzLCB0aGlzLCBwbHVnaW5Db25maWcpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5lbmFibGVkUGx1Z2lucy5wdXNoKHBsdWdpbilcbiAgICB9KVxuICB9XG5cbiAgLypcbiAgKiBBbGlhc2VzIHRvIGNyZWF0ZSBoaWRkZW4gYW5kIGxhenkgZ2V0dGVycyBvbiB0aGUgcHJvamVjdFxuICAqL1xuICBoaWRkZW4gKC4uLmFyZ3MpIHsgcmV0dXJuIHV0aWwuaGlkZGVuLmdldHRlcih0aGlzLCAuLi5hcmdzKSB9XG4gIGxhenkgKC4uLmFyZ3MpIHsgcmV0dXJuIHV0aWwubGF6eSh0aGlzLCAuLi5hcmdzKSB9XG5cbiAgLyoqXG4gICAqIGJ1aWxkIGEgcGF0aCBmcm9tIGEgYmFzZSAoZS5nLiBkb2N1bWVudHMsIG1vZGVscywgYnVpbGQpXG4gICAqIHVzaW5nIHBhdGguam9pblxuICAgKi9cbiAgcGF0aCAoYmFzZSwgLi4ucmVzdCkge1xuICAgIHJldHVybiBqb2luKHRoaXMucGF0aHNbYmFzZV0sIC4uLnJlc3QpXG4gIH1cblxuICBqb2luKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5wYXRocy5qb2luKC4uLmFyZ3MpXG4gIH1cblxuICAvKipcbiAgKiBDb2xsZWN0aW9uIEFjY2Vzc29yIE1ldGhvZHNcbiAgKlxuICAqIFRoZXNlIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyBkb2N1bWVudCBjb2xsZWN0aW9ucyB3aXRoaW4gdGhlIHByb2plY3RcbiAgKi9cbiAgZ2V0IGRvY3MgKCkge1xuICAgIHJldHVybiB0aGlzLmRvY3VtZW50c1xuICB9XG5cbiAgZ2V0IGRvY3VtZW50cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudC5kb2N1bWVudHNcbiAgfVxuXG4gIGdldCBkYXRhX3NvdXJjZXMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YV9zb3VyY2VzXG4gIH1cblxuICBnZXQgZGF0YSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudC5kYXRhX3NvdXJjZXNcbiAgfVxuXG4gIGdldCBpbWFnZXMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuaW1hZ2VzXG4gIH1cblxuICBnZXQgc2NyaXB0cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudC5zY3JpcHRzXG4gIH1cblxuICBnZXQgc3R5bGVzaGVldHMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuc3R5bGVzaGVldHNcbiAgfVxuXG4gIGdldCBzdHlsZXNoZWV0cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudC5zdHlsZXNoZWV0c1xuICB9XG5cbiAgZ2V0IHZlY3RvcnMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQudmVjdG9yc1xuICB9XG5cbiAgZ2V0IGNvbGxlY3Rpb25zICgpIHtcbiAgICByZXR1cm4gdXRpbC52YWx1ZXModGhpcy5jb250ZW50KVxuICB9XG5cbiAgZ2V0IGFjdGlvbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuYWN0aW9uc1xuICB9XG5cbiAgZ2V0IGNvbnRleHRzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmNvbnRleHRzXG4gIH1cblxuICBnZXQgZXhwb3J0ZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmV4cG9ydGVyc1xuICB9XG5cbiAgZ2V0IGltcG9ydGVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5pbXBvcnRlcnNcbiAgfVxuXG4gIGdldCBwbHVnaW5zICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnBsdWdpbnNcbiAgfVxuXG4gIGdldCBtb2RlbHMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMubW9kZWxzXG4gIH1cblxuICBnZXQgc3RvcmVzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnN0b3Jlc1xuICB9XG5cbiAgZ2V0IHJlbmRlcmVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5yZW5kZXJlcnNcbiAgfVxuXG4gIGdldCB2aWV3cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy52aWV3c1xuICB9XG5cbiAgZ2V0IG1vZGVsR3JvdXBzICgpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbHMuYWxsLm1hcChtb2RlbCA9PlxuICAgICAgdXRpbC50YWJlbGl6ZSh1dGlsLnVuZGVyc2NvcmUobW9kZWwubmFtZSkpXG4gICAgKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvamVjdFxuXG5mdW5jdGlvbiBwYXRocyAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gIGxldCBjb252ZW50aW9uYWwgPSB7XG4gICAgYXNzZXRzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIGFjdGlvbnM6IGpvaW4odGhpcy5yb290LCAnYWN0aW9ucycpLFxuICAgIGNvbnRleHRzOiBqb2luKHRoaXMucm9vdCwgJ2NvbnRleHRzJyksXG4gICAgZGF0YV9zb3VyY2VzOiBqb2luKHRoaXMucm9vdCwgJ2RhdGEnKSxcbiAgICBkb2N1bWVudHM6IGpvaW4odGhpcy5yb290LCAnZG9jcycpLFxuICAgIGV4cG9ydGVyczogam9pbih0aGlzLnJvb3QsICdleHBvcnRlcnMnKSxcbiAgICBpbXBvcnRlcnM6IGpvaW4odGhpcy5yb290LCAnaW1wb3J0ZXJzJyksXG4gICAgbW9kZWxzOiBqb2luKHRoaXMucm9vdCwgJ21vZGVscycpLFxuICAgIHBsdWdpbnM6IGpvaW4odGhpcy5yb290LCAncGx1Z2lucycpLFxuICAgIHJlbmRlcmVyczogam9pbih0aGlzLnJvb3QsICdyZW5kZXJlcnMnKSxcbiAgICB2ZWN0b3JzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIGltYWdlczogam9pbih0aGlzLnJvb3QsICdhc3NldHMnKSxcbiAgICBzY3JpcHRzOiBqb2luKHRoaXMucm9vdCwgJ3NyYycpLFxuICAgIHN0eWxlc2hlZXRzOiBqb2luKHRoaXMucm9vdCwgJ3NyYycpLFxuICAgIG1hbmlmZXN0OiBqb2luKHRoaXMucm9vdCwgJ3BhY2thZ2UuanNvbicpLFxuICAgIGNhY2hlOiBqb2luKHRoaXMucm9vdCwgJ3RtcCcsICdjYWNoZScpLFxuICAgIGxvZ3M6IGpvaW4odGhpcy5yb290LCAnbG9nJyksXG4gICAgYnVpbGQ6IGpvaW4odGhpcy5yb290LCAnZGlzdCcpLFxuICAgIHB1YmxpYzogam9pbih0aGlzLnJvb3QsICdwdWJsaWMnKSxcbiAgICBqb2luOiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgcmV0dXJuIGpvaW4ocHJvamVjdC5yb290LCAuLi5hcmdzKVxuICAgIH1cbiAgfVxuXG4gIGxldCBjdXN0b20gPSBwcm9qZWN0Lm9wdGlvbnMucGF0aHMgfHwgcHJvamVjdC5tYW5pZmVzdC5wYXRocyB8fCB7fVxuXG4gIHJldHVybiB1dGlsLmFzc2lnbihjb252ZW50aW9uYWwsIGN1c3RvbSlcbn1cblxuZnVuY3Rpb24gY29udGVudCAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuICBsZXQgY29sbGVjdGlvbnMgPSBidWlsZENvbnRlbnRDb2xsZWN0aW9uc01hbnVhbGx5LmNhbGwocHJvamVjdClcblxuICByZXR1cm4gY29sbGVjdGlvbnNcbn1cblxuZnVuY3Rpb24gcnVuSW1wb3J0ZXIgKG9wdGlvbnMgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IGNvbGxlY3Rpb25zID0gcHJvamVjdC5jb2xsZWN0aW9uc1xuICBsZXQgeyBhdXRvTG9hZCwgaW1wb3J0ZXIgfSA9IG9wdGlvbnNcblxuICBkZWJ1ZygnaW1wb3J0IHN0YXJ0aW5nJylcbiAgbGV0IHJlc3VsdCA9IHByb2plY3QuaW1wb3J0ZXJzLnJ1bihpbXBvcnRlciB8fCAnZGlzaycsIHsgcHJvamVjdDogdGhpcywgY29sbGVjdGlvbnM6IHRoaXMuY29udGVudCwgYXV0b0xvYWQgfSlcbiAgZGVidWcoJ2ltcG9ydCBmaW5pc2hpbmcnKVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gYnVpbGRDb250ZW50Q29sbGVjdGlvbnNNYW51YWxseSAoKSB7XG4gIGNvbnN0IHByb2plY3QgPSB0aGlzXG4gIGNvbnN0IHBhdGhzID0gcHJvamVjdC5wYXRoc1xuXG4gIGxldCB7IEFzc2V0LCBEYXRhU291cmNlLCBEb2N1bWVudCwgSW1hZ2UsIFNjcmlwdCwgU3R5bGVzaGVldCwgVmVjdG9yIH0gPSBBc3NldHNcblxuICByZXR1cm4ge1xuICAgIGFzc2V0czogQXNzZXQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgZGF0YV9zb3VyY2VzOiBEYXRhU291cmNlLmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGRvY3VtZW50czogRG9jdW1lbnQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgaW1hZ2VzOiBJbWFnZS5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBzY3JpcHRzOiBTY3JpcHQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgc3R5bGVzaGVldHM6IFN0eWxlc2hlZXQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgdmVjdG9yczogVmVjdG9yLmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpXG4gIH1cbn1cblxuZnVuY3Rpb24gc3RvcmVzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG59XG5cbmZ1bmN0aW9uIHJlZ2lzdHJpZXMgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IHJvb3QgPSBwcm9qZWN0LnJvb3RcblxuICBsZXQgcmVnaXN0cmllcyA9IFJlZ2lzdHJ5LmJ1aWxkQWxsKHByb2plY3QsIEhlbHBlcnMsIHtyb290fSlcblxuICBwcm9qZWN0LmVtaXQoJ3JlZ2lzdHJpZXNEaWRMb2FkJywgcmVnaXN0cmllcylcblxuICByZXR1cm4gcmVnaXN0cmllc1xufVxuXG5mdW5jdGlvbiBtb2RlbERlZmluaXRpb25zKCkge1xuICByZXR1cm4gdGhpcy5tb2RlbHMuYXZhaWxhYmxlLnJlZHVjZSgobWVtbyxpZCkgPT4ge1xuICAgIGxldCBtb2RlbCA9IHRoaXMubW9kZWxzLmxvb2t1cChpZClcblxuICAgIE9iamVjdC5hc3NpZ24obWVtbywge1xuICAgICAgZ2V0IFt1dGlsLnRhYmVsaXplKHV0aWwudW5kZXJzY29yZShtb2RlbC5uYW1lKSldKCl7XG4gICAgICAgIHJldHVybiBtb2RlbC5kZWZpbml0aW9uXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBtZW1vXG4gIH0sIHt9KVxufVxuXG5mdW5jdGlvbiBlbnRpdGllcygpIHtcbiAgcmV0dXJuIHRoaXMubW9kZWxzLmF2YWlsYWJsZS5yZWR1Y2UoKG1lbW8saWQpID0+IHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLm1vZGVscy5sb29rdXAoaWQpXG4gICAgbGV0IGVudGl0aWVzID0gbW9kZWwuZW50aXRpZXMgPSBtb2RlbC5lbnRpdGllcyB8fCB7fVxuXG4gICAgT2JqZWN0LmFzc2lnbihtZW1vLCB7XG4gICAgICBnZXQgW3V0aWwudGFiZWxpemUodXRpbC51bmRlcnNjb3JlKG1vZGVsLm5hbWUpKV0oKXtcbiAgICAgICAgcmV0dXJuIGVudGl0aWVzXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBtZW1vXG4gIH0sIHt9KVxufVxuXG5mdW5jdGlvbiBzZXR1cEhvb2tzKGhvb2tzID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGhvb2tzKS5yZWR1Y2UoKG1lbW8sIGhvb2spID0+IHtcbiAgICBsZXQgZm4gPSBob29rc1tob29rXVxuXG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbWVtb1tob29rXSA9IGZuLmJpbmQocHJvamVjdClcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtb1xuICB9LCB7fSlcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplT3B0aW9ucyAob3B0aW9ucyA9IHt9KSB7XG4gIGlmIChvcHRpb25zLm1hbmlmZXN0ICYmIG9wdGlvbnMubWFuaWZlc3Quc2t5cGFnZXIpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihvcHRpb25zLCBvcHRpb25zLm1hbmlmZXN0LnNreXBhZ2VyKVxuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnNcbn1cbiJdfQ==