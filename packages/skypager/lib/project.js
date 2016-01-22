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
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Project);

    debug('project created at: ' + uri);
    debug('Option keys: ' + Object.keys(options));

    uri.should.be.a.String();
    uri.should.not.be.empty();

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

    var plugins = [];
    util.hide.getter(project, 'enabledPlugins', function () {
      return plugins;
    });

    project.lazy('registries', registries.bind(project), false);

    project.name = options.name || (0, _path.basename)(project.root);

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
      var _this = this;

      for (var _len2 = arguments.length, plugins = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        plugins[_key2] = arguments[_key2];
      }

      this.enabledPlugins.concat(plugins.map(function (plugin) {
        var pluginConfig = _this.plugins.lookup(plugin);

        if (pluginConfig && pluginConfig.api && pluginConfig.api.modify) {
          pluginConfig.api.modify(_this);
        } else {
          if (typeof pluginConfig.api === 'function') {
            pluginConfig.api.call(_this, _this, pluginConfig);
          }
        }

        return plugin;
      }));
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
  var _this2 = this;

  var modelNames = ['outline', 'page'].concat(this.models.available);

  return modelNames.reduce(function (memo, id) {
    var _util$tabelize, _Object$assign, _mutatorMap;

    var model = _this2.models.lookup(id);
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
//# sourceMappingURL=data:application/json;base64,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aW5kZXgnXG5pbXBvcnQgbWQ1IGZyb20gJ21kNSdcblxuaW1wb3J0IFJlZ2lzdHJ5IGZyb20gJy4vcmVnaXN0cnknXG5pbXBvcnQgQ29sbGVjdGlvbiBmcm9tICcuL2NvbGxlY3Rpb24nXG5pbXBvcnQgcmVzb2x2ZXIgZnJvbSAnLi9yZXNvbHZlcidcblxuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgKiBhcyBBc3NldHMgZnJvbSAnLi9hc3NldHMnXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcblxuaW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSwgam9pbiwgYmFzZW5hbWUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgX2RlYnVnIGZyb20gJ2RlYnVnJ1xuXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1Zygnc2t5cGFnZXI6cHJvamVjdCcpXG5jb25zdCBoaWRlID0gdXRpbC5oaWRlLmdldHRlclxuY29uc3QgbGF6eSA9IHV0aWwubGF6eVxuXG5jb25zdCBIT09LUyA9IFtcbiAgJ2NvbnRlbnRXaWxsSW5pdGlhbGl6ZScsXG4gICdjb250ZW50RGlkSW5pdGlhbGl6ZScsXG4gICdwcm9qZWN0V2lsbEF1dG9JbXBvcnQnLFxuICAncHJvamVjdERpZEF1dG9JbXBvcnQnLFxuICAnd2lsbEJ1aWxkRW50aXRpZXMnLFxuICAnZGlkQnVpbGRFbnRpdGllcycsXG4gICdyZWdpc3RyaWVzRGlkTG9hZCdcbl1cblxuY2xhc3MgUHJvamVjdCB7XG4gIGNvbnN0cnVjdG9yICh1cmksIG9wdGlvbnMgPSB7fSkge1xuICAgIGRlYnVnKCdwcm9qZWN0IGNyZWF0ZWQgYXQ6ICcgKyB1cmkpXG4gICAgZGVidWcoJ09wdGlvbiBrZXlzOiAnICsgT2JqZWN0LmtleXMob3B0aW9ucykpXG5cbiAgICB1cmkuc2hvdWxkLmJlLmEuU3RyaW5nKClcbiAgICB1cmkuc2hvdWxkLm5vdC5iZS5lbXB0eSgpXG5cbiAgICBsZXQgcHJvamVjdCA9IHRoaXNcblxuICAgIHByb2plY3QudXJpID0gdXJpXG4gICAgcHJvamVjdC5yb290ID0gZGlybmFtZSh1cmkpXG4gICAgcHJvamVjdC50eXBlID0gb3B0aW9ucy50eXBlIHx8ICdwcm9qZWN0J1xuXG4gICAgcHJvamVjdC5oaWRkZW4oJ29wdGlvbnMnLCAoKSA9PiBvcHRpb25zKVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2plY3QsICdtYW5pZmVzdCcsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IG9wdGlvbnMubWFuaWZlc3QgfHwge31cbiAgICB9KVxuXG4gICAgLy8gYXV0b2JpbmQgaG9va3MgZnVuY3Rpb25zIHBhc3NlZCBpbiBhcyBvcHRpb25zXG4gICAgcHJvamVjdC5oaWRkZW4oJ2hvb2tzJywgc2V0dXBIb29rcy5jYWxsKHByb2plY3QsIG9wdGlvbnMuaG9va3MpKVxuXG4gICAgcHJvamVjdC5oaWRkZW4oJ3BhdGhzJywgcGF0aHMuYmluZChwcm9qZWN0KSlcblxuICAgIGNvbnN0IHBsdWdpbnMgPSBbIF1cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHByb2plY3QsICdlbmFibGVkUGx1Z2lucycsICgpID0+IHBsdWdpbnMpXG5cbiAgICBwcm9qZWN0LmxhenkoJ3JlZ2lzdHJpZXMnLCByZWdpc3RyaWVzLmJpbmQocHJvamVjdCksIGZhbHNlKVxuXG4gICAgcHJvamVjdC5uYW1lID0gb3B0aW9ucy5uYW1lIHx8IGJhc2VuYW1lKHByb2plY3Qucm9vdClcblxuICAgIHByb2plY3QucnVuSG9vaygnY29udGVudFdpbGxJbml0aWFsaXplJylcbiAgICAvLyB3cmFwIHRoZSBjb250ZW50IGludGVyZmFjZSBpbiBhIGdldHRlciBidXQgbWFrZSBzdXJlXG4gICAgLy8gdGhlIGRvY3VtZW50cyBjb2xsZWN0aW9uIGlzIGxvYWRlZCBhbmQgYXZhaWxhYmxlIHJpZ2h0IGF3YXlcbiAgICBwcm9qZWN0LmhpZGRlbignY29udGVudCcsIGNvbnRlbnQuY2FsbChwcm9qZWN0KSlcblxuICAgIHByb2plY3QucnVuSG9vaygnY29udGVudERpZEluaXRpYWxpemUnKVxuXG4gICAgaWYgKG9wdGlvbnMuYXV0b0ltcG9ydCAhPT0gZmFsc2UpIHtcbiAgICAgIGRlYnVnKCdydW5uaW5nIGF1dG9pbXBvcnQnLCBvcHRpb25zLmF1dG9Mb2FkKVxuXG4gICAgICBwcm9qZWN0LnJ1bkhvb2soJ3Byb2plY3RXaWxsQXV0b0ltcG9ydCcpXG5cbiAgICAgIHJ1bkltcG9ydGVyLmNhbGwocHJvamVjdCwge1xuICAgICAgICB0eXBlOiAob3B0aW9ucy5pbXBvcnRlclR5cGUgfHwgJ2Rpc2snKSxcbiAgICAgICAgYXV0b0xvYWQ6IG9wdGlvbnMuYXV0b0xvYWQgfHwge1xuICAgICAgICAgIGRvY3VtZW50czogdHJ1ZSxcbiAgICAgICAgICBhc3NldHM6IHRydWUsXG4gICAgICAgICAgdmVjdG9yczogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBwcm9qZWN0LnJ1bkhvb2soJ3Byb2plY3REaWRBdXRvSW1wb3J0JylcbiAgICB9XG5cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHByb2plY3QsICdzdXBwb3J0ZWRBc3NldEV4dGVuc2lvbnMnLCAoKSA9PiBBc3NldHMuQXNzZXQuU3VwcG9ydGVkRXh0ZW5zaW9ucyApXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvamVjdCwgJ2VudGl0aWVzJywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGRlbGV0ZSBwcm9qZWN0LmVudGl0aWVzXG4gICAgICAgIGRlYnVnKCdidWlsZGluZyBlbnRpdGllcycpXG5cbiAgICAgICAgcHJvamVjdC5ydW5Ib29rKCd3aWxsQnVpbGRFbnRpdGllcycpXG4gICAgICAgIHByb2plY3QuZW50aXRpZXMgPSBlbnRpdGllcy5jYWxsKHByb2plY3QpXG4gICAgICAgIHByb2plY3QucnVuSG9vaygnZGlkQnVpbGRFbnRpdGllcycsIHByb2plY3QsIHByb2plY3QuZW50aXRpZXMpXG5cbiAgICAgICAgcmV0dXJuIHByb2plY3QuZW50aXRpZXNcbiAgICAgIH1cbiAgICB9KVxuXG4gIH1cblxuICBydW5Ib29rKG5hbWUsIC4uLmFyZ3MpIHtcbiAgICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgICBsZXQgZm4gPSBwcm9qZWN0Lmhvb2tzW25hbWVdIHx8IHByb2plY3RbbmFtZV1cbiAgICBpZiAoZm4pIHsgZm4uY2FsbChwcm9qZWN0LCAuLi5hcmdzKSB9XG4gIH1cbiAgLyoqXG4gICAqIEEgcHJveHkgb2JqZWN0IHRoYXQgbGV0cyB5b3UgcnVuIG9uZSBvZiB0aGUgcHJvamVjdCBoZWxwZXJzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKlxuICAgKiBwcm9qZWN0LnJ1bi5pbXBvcnRlcignZGlzaycpXG4gICAqIHByb2plY3QucnVuLmFjdGlvbignc25hcHNob3RzL3NhdmUnLCAnL3BhdGgvdG8vc25hcHNob3QuanNvbicpXG4gICAqXG4gICAqL1xuICBnZXQgcnVuKCl7XG4gICAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgICByZXR1cm4ge1xuICAgICAgYWN0aW9uOiBmdW5jdGlvbiBhY3Rpb24oLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5hY3Rpb25zLnJ1biguLi5hcmdzKSB9LFxuICAgICAgY29udGV4dDogZnVuY3Rpb24gY29udGV4dCguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LmNvbnRleHRzLnJ1biguLi5hcmdzKSB9LFxuICAgICAgaW1wb3J0ZXI6IGZ1bmN0aW9uIGltcG9ydGVyKHR5cGUsIC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QuaW1wb3J0ZXJzLnJ1bigodHlwZSB8fCBwcm9qZWN0Lm9wdGlvbnMuaW1wb3J0ZXIgfHwgJ2Rpc2snKSwgLi4uYXJncykgfSxcbiAgICAgIGV4cG9ydGVyOiBmdW5jdGlvbiBleHBvcnRlcih0eXBlLCAuLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LmV4cG9ydGVycy5ydW4oKHR5cGUgfHwgcHJvamVjdC5vcHRpb25zLmV4cG9ydGVyIHx8ICdzbmFwc2hvdCcpLCAuLi5hcmdzKSB9LFxuICAgICAgbW9kZWw6IGZ1bmN0aW9uIG1vZGVsKC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QubW9kZWxzLnJ1biguLi5hcmdzKSB9LFxuICAgICAgcmVuZGVyZXI6IGZ1bmN0aW9uIHJlbmRlcmVyKC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QucmVuZGVyZXJzLnJ1biguLi5hcmdzKSB9LFxuICAgICAgdmlldzogZnVuY3Rpb24gdmlldyguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LnZpZXdzLnJ1biguLi5hcmdzKSB9XG4gICAgfVxuICB9XG5cbiAgZ2V0IGFzc2V0TWFuaWZlc3QgKCkge1xuICAgIHJldHVybiB0aGlzLmV4cG9ydGVycy5ydW4oJ2Fzc2V0X21hbmlmZXN0Jywge1xuICAgICAgcHJvamVjdDogdGhpc1xuICAgIH0pXG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBvZiB0aGlzIHByb2plY3QncyBjb250ZW50IGNvbGxlY3Rpb25zLlxuICAgKi9cbiAgZ2V0IGNvbGxlY3Rpb25zKCkge1xuICAgIHJldHVybiB1dGlsLnZhbHVlcyh0aGlzLmNvbnRlbnQpXG4gIH1cblxuICBnZXQgYWxsQXNzZXRzICgpIHtcbiAgICByZXR1cm4gdXRpbC5mbGF0dGVuKHRoaXMuY29sbGVjdGlvbnMubWFwKGMgPT4gYy5hbGwpKVxuICB9XG5cbiAgZ2V0IGFzc2V0UGF0aHMgKCl7XG4gICAgcmV0dXJuIHRoaXMuYWxsQXNzZXRzLm1hcChhID0+IGEucGF0aHMucHJvamVjdClcbiAgfVxuXG4gIC8qKlxuICAqIEFjY2VzcyBhIGRvY3VtZW50IGJ5IHRoZSBkb2N1bWVudCBpZCBzaG9ydCBoYW5kXG4gICpcbiAgKiBEb2N1bWVudHMgYXJlIHRoZSBtb3N0IGltcG9ydGFudCBwYXJ0IG9mIGEgU2t5cGFnZXIgcHJvamVjdCwgc28gbWFrZSBpdCBlYXN5IHRvIGFjY2VzcyB0aGVtXG4gICpcbiAgKi9cbiAgIGF0IChkb2N1bWVudElkKSB7XG4gICAgIHJldHVybiB0aGlzLmRvY3VtZW50cy5hdChkb2N1bWVudElkKVxuICAgfVxuXG4gIC8qKlxuICAqIFRoaXMgaXMgYSBzeXN0ZW0gZm9yIHJlc29sdmluZyBwYXRocyBpbiB0aGUgcHJvamVjdCB0cmVlIHRvIHRoZVxuICAqIGFwcHJvcHJpYXRlIGhlbHBlciwgb3IgcmVzb2x2aW5nIHBhdGhzIHRvIHRoZSBsaW5rcyB0byB0aGVzZSBwYXRoc1xuICAqIGluIHNvbWUgb3RoZXIgc3lzdGVtIChsaWtlIGEgd2ViIHNpdGUpXG4gICovXG4gIGdldCByZXNvbHZlICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlclxuICB9XG5cbiAgLyoqXG4gICogQGFsaWFzIFByb2plY3QjcmVzb2x2ZVxuICAqL1xuICBnZXQgcmVzb2x2ZXIgKCkge1xuICAgIHJldHVybiByZXNvbHZlci5jYWxsKHRoaXMpXG4gIH1cblxuICAvKipcbiAgKiBVc2UgYSBwbHVnaW4gZnJvbSB0aGUgcGx1Z2lucyByZWdpc3RyeVxuICAqXG4gICovXG4gIHVzZSAoLi4ucGx1Z2lucykge1xuICAgIHRoaXMuZW5hYmxlZFBsdWdpbnMuY29uY2F0KHBsdWdpbnMubWFwKHBsdWdpbiA9PiB7XG4gICAgICBsZXQgcGx1Z2luQ29uZmlnID0gdGhpcy5wbHVnaW5zLmxvb2t1cChwbHVnaW4pXG5cbiAgICAgIGlmIChwbHVnaW5Db25maWcgJiYgcGx1Z2luQ29uZmlnLmFwaSAmJiBwbHVnaW5Db25maWcuYXBpLm1vZGlmeSkge1xuICAgICAgICBwbHVnaW5Db25maWcuYXBpLm1vZGlmeSh0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwbHVnaW5Db25maWcuYXBpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcGx1Z2luQ29uZmlnLmFwaS5jYWxsKHRoaXMsIHRoaXMsIHBsdWdpbkNvbmZpZylcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGx1Z2luXG4gICAgfSkpXG4gIH1cblxuICAvKlxuICAqIEFsaWFzZXMgdG8gY3JlYXRlIGhpZGRlbiBhbmQgbGF6eSBnZXR0ZXJzIG9uIHRoZSBwcm9qZWN0XG4gICovXG4gIGhpZGRlbiAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5oaWRkZW4uZ2V0dGVyKHRoaXMsIC4uLmFyZ3MpIH1cbiAgbGF6eSAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5sYXp5KHRoaXMsIC4uLmFyZ3MpIH1cblxuICAvKipcbiAgICogYnVpbGQgYSBwYXRoIGZyb20gYSBiYXNlIChlLmcuIGRvY3VtZW50cywgbW9kZWxzLCBidWlsZClcbiAgICogdXNpbmcgcGF0aC5qb2luXG4gICAqL1xuICBwYXRoIChiYXNlLCAuLi5yZXN0KSB7XG4gICAgcmV0dXJuIGpvaW4odGhpcy5wYXRoc1tiYXNlXSwgLi4ucmVzdClcbiAgfVxuXG4gIC8qKlxuICAqIENvbGxlY3Rpb24gQWNjZXNzb3IgTWV0aG9kc1xuICAqXG4gICogVGhlc2UgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIGRvY3VtZW50IGNvbGxlY3Rpb25zIHdpdGhpbiB0aGUgcHJvamVjdFxuICAqL1xuICBnZXQgZG9jcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRzXG4gIH1cblxuICBnZXQgZG9jdW1lbnRzICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50LmRvY3VtZW50c1xuICB9XG5cbiAgZ2V0IGRhdGFfc291cmNlcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudC5kYXRhX3NvdXJjZXNcbiAgfVxuXG4gIGdldCBkYXRhX3NvdXJjZXMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YV9zb3VyY2VzXG4gIH1cblxuICBnZXQgY29sbGVjdGlvbnMgKCkge1xuICAgIHJldHVybiB1dGlsLnZhbHVlcyh0aGlzLmNvbnRlbnQpXG4gIH1cblxuICBnZXQgYWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5hY3Rpb25zXG4gIH1cblxuICBnZXQgY29udGV4dHMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuY29udGV4dHNcbiAgfVxuXG4gIGdldCBleHBvcnRlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuZXhwb3J0ZXJzXG4gIH1cblxuICBnZXQgaW1wb3J0ZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmltcG9ydGVyc1xuICB9XG5cbiAgZ2V0IHBsdWdpbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMucGx1Z2luc1xuICB9XG5cbiAgZ2V0IG1vZGVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5tb2RlbHNcbiAgfVxuXG4gIGdldCBzdG9yZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuc3RvcmVzXG4gIH1cblxuICBnZXQgcmVuZGVyZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnJlbmRlcmVyc1xuICB9XG5cbiAgZ2V0IHZpZXdzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnZpZXdzXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9qZWN0XG5cbmZ1bmN0aW9uIHBhdGhzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgbGV0IGNvbnZlbnRpb25hbCA9IHtcbiAgICBhc3NldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgYWN0aW9uczogam9pbih0aGlzLnJvb3QsICdhY3Rpb25zJyksXG4gICAgY29udGV4dHM6IGpvaW4odGhpcy5yb290LCAnY29udGV4dHMnKSxcbiAgICBkYXRhX3NvdXJjZXM6IGpvaW4odGhpcy5yb290LCAnZGF0YScpLFxuICAgIGRvY3VtZW50czogam9pbih0aGlzLnJvb3QsICdkb2NzJyksXG4gICAgZXhwb3J0ZXJzOiBqb2luKHRoaXMucm9vdCwgJ2V4cG9ydGVycycpLFxuICAgIGltcG9ydGVyczogam9pbih0aGlzLnJvb3QsICdpbXBvcnRlcnMnKSxcbiAgICBtb2RlbHM6IGpvaW4odGhpcy5yb290LCAnbW9kZWxzJyksXG4gICAgcGx1Z2luczogam9pbih0aGlzLnJvb3QsICdwbHVnaW5zJyksXG4gICAgcmVuZGVyZXJzOiBqb2luKHRoaXMucm9vdCwgJ3JlbmRlcmVycycpLFxuICAgIHZlY3RvcnM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgaW1hZ2VzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIHNjcmlwdHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgc3R5bGVzaGVldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgbWFuaWZlc3Q6IGpvaW4odGhpcy5yb290LCAncGFja2FnZS5qc29uJyksXG4gICAgY2FjaGU6IGpvaW4odGhpcy5yb290LCAndG1wJywgJ2NhY2hlJyksXG4gICAgbG9nczogam9pbih0aGlzLnJvb3QsICdsb2cnKSxcbiAgICBidWlsZDogam9pbih0aGlzLnJvb3QsICdkaXN0JylcbiAgfVxuXG4gIGxldCBjdXN0b20gPSBwcm9qZWN0Lm9wdGlvbnMucGF0aHMgfHwgcHJvamVjdC5tYW5pZmVzdC5wYXRocyB8fCB7fVxuXG4gIHJldHVybiB1dGlsLmFzc2lnbihjb252ZW50aW9uYWwsIGN1c3RvbSlcbn1cblxuZnVuY3Rpb24gY29udGVudCAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuICBsZXQgY29sbGVjdGlvbnMgPSBidWlsZENvbnRlbnRDb2xsZWN0aW9uc01hbnVhbGx5LmNhbGwocHJvamVjdClcblxuICByZXR1cm4gY29sbGVjdGlvbnNcbn1cblxuZnVuY3Rpb24gcnVuSW1wb3J0ZXIgKG9wdGlvbnMgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IGNvbGxlY3Rpb25zID0gcHJvamVjdC5jb2xsZWN0aW9uc1xuICBsZXQgeyBhdXRvTG9hZCwgaW1wb3J0ZXIgfSA9IG9wdGlvbnNcblxuICBkZWJ1ZygnaW1wb3J0IHN0YXJ0aW5nJylcbiAgbGV0IHJlc3VsdCA9IHByb2plY3QuaW1wb3J0ZXJzLnJ1bihpbXBvcnRlciB8fCAnZGlzaycsIHsgcHJvamVjdDogdGhpcywgY29sbGVjdGlvbnM6IHRoaXMuY29udGVudCwgYXV0b0xvYWQgfSlcbiAgZGVidWcoJ2ltcG9ydCBmaW5pc2hpbmcnKVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gYnVpbGRDb250ZW50Q29sbGVjdGlvbnNNYW51YWxseSAoKSB7XG4gIGNvbnN0IHByb2plY3QgPSB0aGlzXG4gIGNvbnN0IHBhdGhzID0gcHJvamVjdC5wYXRoc1xuXG4gIGxldCB7IEFzc2V0LCBEYXRhU291cmNlLCBEb2N1bWVudCwgSW1hZ2UsIFNjcmlwdCwgU3R5bGVzaGVldCwgVmVjdG9yIH0gPSBBc3NldHNcblxuICByZXR1cm4ge1xuICAgIGFzc2V0czogQXNzZXQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgZGF0YV9zb3VyY2VzOiBEYXRhU291cmNlLmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGRvY3VtZW50czogRG9jdW1lbnQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgaW1hZ2VzOiBJbWFnZS5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBzY3JpcHRzOiBTY3JpcHQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgc3R5bGVzaGVldHM6IFN0eWxlc2hlZXQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgdmVjdG9yczogVmVjdG9yLmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpXG4gIH1cbn1cblxuZnVuY3Rpb24gc3RvcmVzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG59XG5cbmZ1bmN0aW9uIHJlZ2lzdHJpZXMgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IHJvb3QgPSBwcm9qZWN0LnJvb3RcblxuICBsZXQgcmVnaXN0cmllcyA9IFJlZ2lzdHJ5LmJ1aWxkQWxsKHByb2plY3QsIEhlbHBlcnMsIHtyb290fSlcblxuICBwcm9qZWN0LnJ1bkhvb2soJ3JlZ2lzdHJpZXNEaWRMb2FkJywgcmVnaXN0cmllcylcblxuICByZXR1cm4gcmVnaXN0cmllc1xufVxuXG5mdW5jdGlvbiBlbnRpdGllcygpIHtcbiAgbGV0IG1vZGVsTmFtZXMgPSBbJ291dGxpbmUnLCdwYWdlJ10uY29uY2F0KHRoaXMubW9kZWxzLmF2YWlsYWJsZSlcblxuICByZXR1cm4gbW9kZWxOYW1lcy5yZWR1Y2UoKG1lbW8saWQpID0+IHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLm1vZGVscy5sb29rdXAoaWQpXG4gICAgbGV0IGVudGl0aWVzID0gbW9kZWwuZW50aXRpZXMgPSBtb2RlbC5lbnRpdGllcyB8fCB7fVxuXG4gICAgT2JqZWN0LmFzc2lnbihtZW1vLCB7XG4gICAgICBnZXQgW3V0aWwudGFiZWxpemUodXRpbC51bmRlcnNjb3JlKG1vZGVsLm5hbWUpKV0oKXtcbiAgICAgICAgcmV0dXJuIGVudGl0aWVzXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBtZW1vXG4gIH0sIHt9KVxufVxuXG5mdW5jdGlvbiBzZXR1cEhvb2tzKGhvb2tzID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGhvb2tzKS5yZWR1Y2UoKG1lbW8sIGhvb2spID0+IHtcbiAgICBsZXQgZm4gPSBob29rc1tob29rXVxuXG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbWVtb1tob29rXSA9IGZuLmJpbmQocHJvamVjdClcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtb1xuICB9LCB7fSlcbn1cbiJdfQ==