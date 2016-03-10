'use strict';

var _defineEnumerableProperties2 = require('babel-runtime/helpers/defineEnumerableProperties');

var _defineEnumerableProperties3 = _interopRequireDefault(_defineEnumerableProperties2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _vault = require('./vault');

var _vault2 = _interopRequireDefault(_vault);

var _path = require('path');

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _pick = require('lodash/pick');

var _pick2 = _interopRequireDefault(_pick);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hide = util.hide.getter;
var lazy = util.lazy;

var HOOKS = ['contentWillInitialize', 'contentDidInitialize', 'projectWillAutoImport', 'projectDidAutoImport', 'willBuildEntities', 'didBuildEntities', 'registriesDidLoad'];

var DefaultOptions = {
  type: 'project',
  env: process.env.NODE_ENV || 'development',
  importer: {
    type: 'disk',
    autoLoad: {
      documents: true,
      data_sources: true,
      settings_files: true,
      copy_files: true
    }
  }
};

var Project = (function () {
  function Project(uri) {
    var _this = this;

    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    (0, _classCallCheck3.default)(this, Project);

    uri.should.be.a.String();
    uri.should.not.be.empty();

    normalizeOptions(options);

    var project = this;

    project.uri = uri;
    project.root = (0, _path.dirname)(uri);
    project.type = options.type;

    project.hidden('options', function () {
      return options;
    });

    Object.defineProperty(project, 'manifest', {
      enumerable: false,
      value: options.manifest || {}
    });

    project.name = options.name || (0, _path.basename)(project.root);

    // autobind hooks functions passed in as options
    project.hidden('hooks', setupHooks.call(project, options.hooks));

    project.hidden('paths', paths.bind(project));

    project.env = options.env;

    (0, _logger2.default)(project, options);

    project.hidden('registries', registries.call(project), false);

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

    if (options.autoImport !== false && options.autoLoad !== false) {
      project.debug('running autoimport', options.autoLoad);

      project.emit('projectWillAutoImport');

      runImporter.call(project, options.importer);

      project.emit('projectDidAutoImport');
    }

    if (project.settings.collections) {
      (0, _defaultsDeep2.default)(project.content, (0, _mapValues2.default)(project.settings.collections, function (cfg, name) {
        var assetClass = Assets[cfg.assetClass];

        if (!assetClass) {
          throw 'Invalid Collection Definition in settings. Invalid assetClass key.\n                   Pick one of: ' + (0, _keys2.default)(Assets).join(' ,');
        }

        return new _collection2.default((0, _extends3.default)({
          root: cfg.root,
          project: project,
          assetClass: assetClass,
          name: name
        }, (0, _pick2.default)(cfg, 'exclude', 'include', 'autoLoad')));
      }));
    }

    util.hide.getter(project, 'supportedAssetExtensions', function () {
      return Assets.Asset.SupportedExtensions;
    });

    // lazy load / memoize the entity builder
    Object.defineProperty(project, 'entities', {
      configurable: true,
      get: function get() {
        delete project.entities;
        project.emit('willBuildEntities');
        project.entities = entities.call(project);
        project.emit('didBuildEntities', project, project.entities);

        project.debug('built entities', (0, _keys2.default)(project.entities));

        return project.entities;
      }
    });

    util.hide.getter(project, 'modelDefinitions', modelDefinitions.bind(this));
  }

  (0, _createClass3.default)(Project, [{
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
  }, {
    key: 'get',
    value: function get() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      return util.result.apply(util, [this].concat(args));
    }
  }, {
    key: 'findBy',
    value: function findBy(source, params) {
      params.limit = 1;
      return this.query(source, params)[0];
    }
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

      if (this.content[source]) {
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
    key: 'streamFile',
    value: function streamFile(path) {
      var type = arguments.length <= 1 || arguments[1] === undefined ? 'readable' : arguments[1];
      var mode = arguments[2];

      var fd = require('fs').openSync(path, 'a+');
      var stream = undefined;

      if (type.match(/read/)) {
        try {
          stream = require('fs').createReadStream(path, { fd: fd });
        } catch (error) {
          console.log(error.message, 'readable');
        }
      } else if (type.match(/write/)) {
        try {
          stream = require('fs').createWriteStream(path, { fd: fd });
        } catch (error) {
          console.log(error.message, 'writeable');
        }
      } else {
        // TODO: How to do bidirectional?
      }

      return stream;
    }
  }, {
    key: 'exists',
    value: function exists() {
      try {
        return require('path-exists').sync(this.path.apply(this, arguments));
      } catch (error) {
        return false;
      }
    }
  }, {
    key: 'ensureFolder',
    value: function ensureFolder() {
      var _this3 = this;

      var fs = require('fs');
      var path = this.path.apply(this, arguments);

      return new _promise2.default(function (resolve, reject) {
        if (_this3.exists(path)) {
          resolve(path);return path;
        }

        require('fs').mkdir(path, function (err) {
          if (err) {
            reject(err);return false;
          }
          resolve(path);
        });
      });
    }
  }, {
    key: 'ensurePath',
    value: function ensurePath() {
      var name = arguments.length <= 0 ? undefined : arguments[0];
      if (this.paths[name]) {
        return this.ensureFolder.apply(this, arguments);
      }
    }
  }, {
    key: 'vault',
    get: function get() {
      return (0, _vault2.default)(this);
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
    key: 'packages',
    get: function get() {
      return this.content.packages;
    }
  }, {
    key: 'projects',
    get: function get() {
      return this.content.projects;
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
  }, {
    key: 'settings',
    get: function get() {
      return this.content.settings_files.query(function (s) {
        return true;
      }).condense({
        key: 'idpath',
        prop: 'data'
      });
    }
  }, {
    key: 'copy',
    get: function get() {
      return this.content.copy_files.query(function (s) {
        return true;
      }).condense({
        key: 'idpath',
        prop: 'data'
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
    packages: (0, _path.join)(this.root, 'packages'),
    plugins: (0, _path.join)(this.root, 'plugins'),
    projects: (0, _path.join)(this.root, 'projects'),
    renderers: (0, _path.join)(this.root, 'renderers'),
    vectors: (0, _path.join)(this.root, 'assets'),
    images: (0, _path.join)(this.root, 'assets'),
    scripts: (0, _path.join)(this.root, 'src'),
    stylesheets: (0, _path.join)(this.root, 'src'),
    manifest: (0, _path.join)(this.root, 'package.json'),
    tmpdir: (0, _path.join)(this.root, 'tmp'),
    temp: (0, _path.join)(this.root, 'tmp'),
    cache: (0, _path.join)(this.root, 'tmp', 'cache'),
    logs: (0, _path.join)(this.root, 'log'),
    build: (0, _path.join)(this.root, 'dist'),
    public: (0, _path.join)(this.root, 'public'),
    settings: (0, _path.join)(this.root, 'settings'),
    copy: (0, _path.join)(this.root, 'copy'),
    join: function join() {
      for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        args[_key6] = arguments[_key6];
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
  var type = options.type;

  project.logger.profile('import starting');

  var result = project.importers.run(type || 'disk', {
    project: this,
    collections: this.content,
    autoLoad: autoLoad
  });

  project.logger.profile('import finishing');

  return result;
}

function buildContentCollectionsManually() {
  var project = this;
  var paths = project.paths;

  var Asset = Assets.Asset;
  var DataSource = Assets.DataSource;
  var Document = Assets.Document;
  var CopyFile = Assets.CopyFile;
  var Image = Assets.Image;
  var Script = Assets.Script;
  var Stylesheet = Assets.Stylesheet;
  var ProjectManifest = Assets.ProjectManifest;
  var SettingsFile = Assets.SettingsFile;
  var Vector = Assets.Vector;

  return {
    assets: Asset.createCollection(this, { root: this.paths.assets }),
    data_sources: DataSource.createCollection(this, { root: this.paths.data_sources }),
    documents: Document.createCollection(this, { root: this.paths.documents }),
    images: Image.createCollection(this, { root: this.paths.images }),
    scripts: Script.createCollection(this, { root: this.paths.scripts }),
    stylesheets: Stylesheet.createCollection(this, { root: this.paths.stylesheets }),
    vectors: Vector.createCollection(this, { root: this.paths.vectors }),

    packages: new _collection2.default({
      root: this.paths.packages,
      project: this,
      assetClass: ProjectManifest,
      include: '*/package.json',
      exclude: '**/node_modules'
    }),

    projects: new _collection2.default({
      root: this.paths.projects,
      project: this,
      assetClass: ProjectManifest,
      include: '*/package.json',
      exclude: '**/node_modules'
    }),

    copy_files: new _collection2.default({
      root: this.paths.copy,
      project: this,
      assetClass: CopyFile
    }),

    settings_files: new _collection2.default({
      root: this.paths.settings,
      project: this,
      assetClass: SettingsFile
    })
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
  var _this4 = this;

  return this.models.available.reduce(function (memo, id) {
    var _util$tabelize, _Object$assign2, _mutatorMap;

    var model = _this4.models.lookup(id);

    (0, _assign2.default)(memo, (_Object$assign2 = {}, _util$tabelize = util.tabelize(util.underscore(model.name)), _mutatorMap = {}, _mutatorMap[_util$tabelize] = _mutatorMap[_util$tabelize] || {}, _mutatorMap[_util$tabelize].get = function () {
      return model.definition;
    }, (0, _defineEnumerableProperties3.default)(_Object$assign2, _mutatorMap), _Object$assign2));

    return memo;
  }, {});
}

function entities() {
  var _this5 = this;

  return this.models.available.reduce(function (memo, id) {
    var _util$tabelize2, _Object$assign3, _mutatorMap2;

    var model = _this5.models.lookup(id);
    var entities = model.entities = model.entities || {};

    (0, _assign2.default)(memo, (_Object$assign3 = {}, _util$tabelize2 = util.tabelize(util.underscore(model.name)), _mutatorMap2 = {}, _mutatorMap2[_util$tabelize2] = _mutatorMap2[_util$tabelize2] || {}, _mutatorMap2[_util$tabelize2].get = function () {
      return entities;
    }, (0, _defineEnumerableProperties3.default)(_Object$assign3, _mutatorMap2), _Object$assign3));

    return memo;
  }, {});
}

function setupHooks() {
  var hooks = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var project = this;

  return (0, _keys2.default)(hooks).reduce(function (memo, hook) {
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
    options = (0, _assign2.default)(options, options.manifest.skypager);
  }

  return (0, _defaultsDeep2.default)(options, DefaultOptions);
}