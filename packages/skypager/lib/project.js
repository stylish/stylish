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

      if (this.modelNames.indexOf(source) > 0) {
        return util.filterQuery(this.entities[source], params);
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
    key: 'modelNames',
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

function entities() {
  var _this3 = this;

  return this.models.available.reduce(function (memo, id) {
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
//# sourceMappingURL=data:application/json;base64,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QUE7Q0FDUDs7QUFFRCxTQUFTLFVBQVUsR0FBYTtNQUFaLEtBQUsseURBQUcsRUFBRTs7QUFDNUIsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBOztBQUVsQixTQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLElBQUksRUFBSztBQUMvQyxRQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRXBCLFFBQUksT0FBTyxFQUFFLEtBQUssVUFBVSxFQUFFO0FBQzVCLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQzlCOztBQUVELFdBQU8sSUFBSSxDQUFBO0dBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQTtDQUNQOztBQUVELFNBQVMsZ0JBQWdCLEdBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUNyQyxNQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7QUFDakQsV0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDNUQ7O0FBRUQsU0FBTyxPQUFPLENBQUE7Q0FDZiIsImZpbGUiOiJwcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNreXBhZ2VyIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgbWQ1IGZyb20gJ21kNSdcblxuaW1wb3J0IFJlZ2lzdHJ5IGZyb20gJy4vcmVnaXN0cnknXG5pbXBvcnQgQ29sbGVjdGlvbiBmcm9tICcuL2NvbGxlY3Rpb24nXG5pbXBvcnQgcmVzb2x2ZXIgZnJvbSAnLi9yZXNvbHZlcidcblxuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgKiBhcyBBc3NldHMgZnJvbSAnLi9hc3NldHMnXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcblxuaW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSwgam9pbiwgYmFzZW5hbWUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgX2RlYnVnIGZyb20gJ2RlYnVnJ1xuXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1Zygnc2t5cGFnZXI6cHJvamVjdCcpXG5jb25zdCBoaWRlID0gdXRpbC5oaWRlLmdldHRlclxuY29uc3QgbGF6eSA9IHV0aWwubGF6eVxuXG5jb25zdCBIT09LUyA9IFtcbiAgJ2NvbnRlbnRXaWxsSW5pdGlhbGl6ZScsXG4gICdjb250ZW50RGlkSW5pdGlhbGl6ZScsXG4gICdwcm9qZWN0V2lsbEF1dG9JbXBvcnQnLFxuICAncHJvamVjdERpZEF1dG9JbXBvcnQnLFxuICAnd2lsbEJ1aWxkRW50aXRpZXMnLFxuICAnZGlkQnVpbGRFbnRpdGllcycsXG4gICdyZWdpc3RyaWVzRGlkTG9hZCdcbl1cblxuY2xhc3MgUHJvamVjdCB7XG4gIGNvbnN0cnVjdG9yICh1cmksIG9wdGlvbnMgPSB7fSkge1xuICAgIGRlYnVnKCdwcm9qZWN0IGNyZWF0ZWQgYXQ6ICcgKyB1cmkpXG4gICAgZGVidWcoJ09wdGlvbiBrZXlzOiAnICsgT2JqZWN0LmtleXMob3B0aW9ucykpXG5cbiAgICB1cmkuc2hvdWxkLmJlLmEuU3RyaW5nKClcbiAgICB1cmkuc2hvdWxkLm5vdC5iZS5lbXB0eSgpXG5cbiAgICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpXG5cbiAgICBsZXQgcHJvamVjdCA9IHRoaXNcblxuICAgIHByb2plY3QudXJpID0gdXJpXG4gICAgcHJvamVjdC5yb290ID0gZGlybmFtZSh1cmkpXG4gICAgcHJvamVjdC50eXBlID0gb3B0aW9ucy50eXBlIHx8ICdwcm9qZWN0J1xuXG4gICAgcHJvamVjdC5oaWRkZW4oJ29wdGlvbnMnLCAoKSA9PiBvcHRpb25zKVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2plY3QsICdtYW5pZmVzdCcsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IG9wdGlvbnMubWFuaWZlc3QgfHwge31cbiAgICB9KVxuXG4gICAgLy8gYXV0b2JpbmQgaG9va3MgZnVuY3Rpb25zIHBhc3NlZCBpbiBhcyBvcHRpb25zXG4gICAgcHJvamVjdC5oaWRkZW4oJ2hvb2tzJywgc2V0dXBIb29rcy5jYWxsKHByb2plY3QsIG9wdGlvbnMuaG9va3MpKVxuXG4gICAgcHJvamVjdC5oaWRkZW4oJ3BhdGhzJywgcGF0aHMuYmluZChwcm9qZWN0KSlcblxuICAgIHByb2plY3QuaGlkZGVuKCdyZWdpc3RyaWVzJywgcmVnaXN0cmllcy5jYWxsKHByb2plY3QpLCBmYWxzZSlcblxuICAgIHByb2plY3QubmFtZSA9IG9wdGlvbnMubmFtZSB8fCBiYXNlbmFtZShwcm9qZWN0LnJvb3QpXG5cbiAgICBjb25zdCBwbHVnaW5zID0gWyBdXG4gICAgdXRpbC5oaWRlLmdldHRlcihwcm9qZWN0LCAnZW5hYmxlZFBsdWdpbnMnLCAoKSA9PiBwbHVnaW5zKVxuXG4gICAgaWYgKG9wdGlvbnMucGx1Z2lucykge1xuICAgICAgb3B0aW9ucy5wbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZihwbHVnaW4pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcGx1Z2luLmNhbGwodGhpcywgdGhpcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVzZShwbHVnaW4pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJvamVjdC5fX3J1bkhvb2soJ2NvbnRlbnRXaWxsSW5pdGlhbGl6ZScpXG4gICAgLy8gd3JhcCB0aGUgY29udGVudCBpbnRlcmZhY2UgaW4gYSBnZXR0ZXIgYnV0IG1ha2Ugc3VyZVxuICAgIC8vIHRoZSBkb2N1bWVudHMgY29sbGVjdGlvbiBpcyBsb2FkZWQgYW5kIGF2YWlsYWJsZSByaWdodCBhd2F5XG4gICAgcHJvamVjdC5oaWRkZW4oJ2NvbnRlbnQnLCBjb250ZW50LmNhbGwocHJvamVjdCkpXG5cbiAgICBwcm9qZWN0Ll9fcnVuSG9vaygnY29udGVudERpZEluaXRpYWxpemUnKVxuXG4gICAgaWYgKG9wdGlvbnMuYXV0b0ltcG9ydCAhPT0gZmFsc2UpIHtcbiAgICAgIGRlYnVnKCdydW5uaW5nIGF1dG9pbXBvcnQnLCBvcHRpb25zLmF1dG9Mb2FkKVxuXG4gICAgICBwcm9qZWN0Ll9fcnVuSG9vaygncHJvamVjdFdpbGxBdXRvSW1wb3J0JylcblxuICAgICAgcnVuSW1wb3J0ZXIuY2FsbChwcm9qZWN0LCB7XG4gICAgICAgIHR5cGU6IChvcHRpb25zLmltcG9ydGVyVHlwZSB8fCAnZGlzaycpLFxuICAgICAgICBhdXRvTG9hZDogb3B0aW9ucy5hdXRvTG9hZCB8fCB7XG4gICAgICAgICAgZG9jdW1lbnRzOiB0cnVlLFxuICAgICAgICAgIGFzc2V0czogdHJ1ZSxcbiAgICAgICAgICB2ZWN0b3JzOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHByb2plY3QuX19ydW5Ib29rKCdwcm9qZWN0RGlkQXV0b0ltcG9ydCcpXG4gICAgfVxuXG4gICAgdXRpbC5oaWRlLmdldHRlcihwcm9qZWN0LCAnc3VwcG9ydGVkQXNzZXRFeHRlbnNpb25zJywgKCkgPT4gQXNzZXRzLkFzc2V0LlN1cHBvcnRlZEV4dGVuc2lvbnMgKVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2plY3QsICdlbnRpdGllcycsIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWxldGUgcHJvamVjdC5lbnRpdGllc1xuICAgICAgICBkZWJ1ZygnYnVpbGRpbmcgZW50aXRpZXMnKVxuXG4gICAgICAgIHByb2plY3QuX19ydW5Ib29rKCd3aWxsQnVpbGRFbnRpdGllcycpXG4gICAgICAgIHByb2plY3QuZW50aXRpZXMgPSBlbnRpdGllcy5jYWxsKHByb2plY3QpXG4gICAgICAgIHByb2plY3QuX19ydW5Ib29rKCdkaWRCdWlsZEVudGl0aWVzJywgcHJvamVjdCwgcHJvamVjdC5lbnRpdGllcylcblxuICAgICAgICByZXR1cm4gcHJvamVjdC5lbnRpdGllc1xuICAgICAgfVxuICAgIH0pXG5cbiAgfVxuXG4gIF9fcnVuSG9vayhuYW1lLCAuLi5hcmdzKSB7XG4gICAgbGV0IHByb2plY3QgPSB0aGlzXG4gICAgbGV0IGZuID0gcHJvamVjdC5ob29rc1tuYW1lXSB8fCBwcm9qZWN0W25hbWVdXG4gICAgaWYgKGZuKSB7IGZuLmNhbGwocHJvamVjdCwgLi4uYXJncykgfVxuICB9XG4gIC8qKlxuICAgKiBBIHByb3h5IG9iamVjdCB0aGF0IGxldHMgeW91IHJ1biBvbmUgb2YgdGhlIHByb2plY3QgaGVscGVycy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogcHJvamVjdC5ydW4uaW1wb3J0ZXIoJ2Rpc2snKVxuICAgKiBwcm9qZWN0LnJ1bi5hY3Rpb24oJ3NuYXBzaG90cy9zYXZlJywgJy9wYXRoL3RvL3NuYXBzaG90Lmpzb24nKVxuICAgKlxuICAgKi9cbiAgZ2V0IHJ1bigpe1xuICAgIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGlvbjogZnVuY3Rpb24gYWN0aW9uKC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QuYWN0aW9ucy5ydW4oLi4uYXJncykgfSxcbiAgICAgIGNvbnRleHQ6IGZ1bmN0aW9uIGNvbnRleHQoLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5jb250ZXh0cy5ydW4oLi4uYXJncykgfSxcbiAgICAgIGltcG9ydGVyOiBmdW5jdGlvbiBpbXBvcnRlcih0eXBlLCAuLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LmltcG9ydGVycy5ydW4oKHR5cGUgfHwgcHJvamVjdC5vcHRpb25zLmltcG9ydGVyIHx8ICdkaXNrJyksIC4uLmFyZ3MpIH0sXG4gICAgICBleHBvcnRlcjogZnVuY3Rpb24gZXhwb3J0ZXIodHlwZSwgLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5leHBvcnRlcnMucnVuKCh0eXBlIHx8IHByb2plY3Qub3B0aW9ucy5leHBvcnRlciB8fCAnc25hcHNob3QnKSwgLi4uYXJncykgfSxcbiAgICAgIG1vZGVsOiBmdW5jdGlvbiBtb2RlbCguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0Lm1vZGVscy5ydW4oLi4uYXJncykgfSxcbiAgICAgIHJlbmRlcmVyOiBmdW5jdGlvbiByZW5kZXJlciguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LnJlbmRlcmVycy5ydW4oLi4uYXJncykgfSxcbiAgICAgIHZpZXc6IGZ1bmN0aW9uIHZpZXcoLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC52aWV3cy5ydW4oLi4uYXJncykgfVxuICAgIH1cbiAgfVxuXG4gIHF1ZXJ5IChzb3VyY2UsIHBhcmFtcykge1xuICAgIHNvdXJjZSA9IGAkeyBzb3VyY2UgfWAudG9Mb3dlckNhc2UoKVxuXG4gICAgaWYgKHNvdXJjZSA9PT0gJ2RvY3MnIHx8IHNvdXJjZSA9PT0gJ2RvY3VtZW50cycpIHtcbiAgICAgIHJldHVybiB0aGlzLmRvY3MucXVlcnkocGFyYW1zKVxuICAgIH1cblxuICAgIGlmIChzb3VyY2UgPT09ICdkYXRhJyB8fCBzb3VyY2UgPT09ICdkYXRhc291cmNlcycgfHwgc291cmNlID09PSAnZGF0YV9zb3VyY2VzJykge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudC5kYXRhX3NvdXJjZXMucXVlcnkocGFyYW1zKVxuICAgIH1cblxuICAgIGlmIChbJ2Fzc2V0cycsJ3NjcmlwdHMnLCdzdHlsZXNoZWV0cycsJ2ltYWdlcycsJ3ZlY3RvcnMnXS5pbmRleE9mKHNvdXJjZSkgPj0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29udGVudFtzb3VyY2VdLnF1ZXJ5KHBhcmFtcylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5tb2RlbE5hbWVzLmluZGV4T2Yoc291cmNlKSA+IDApIHtcbiAgICAgIHJldHVybiB1dGlsLmZpbHRlclF1ZXJ5KHRoaXMuZW50aXRpZXNbc291cmNlXSwgcGFyYW1zKVxuICAgIH1cbiAgfVxuXG4gIHF1ZXJ5SGVscGVycyhzb3VyY2UsIHBhcmFtcykge1xuICAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzW3NvdXJjZV0ucXVlcnkocGFyYW1zKVxuICB9XG5cbiAgZ2V0IGFzc2V0TWFuaWZlc3QgKCkge1xuICAgIHJldHVybiB0aGlzLmV4cG9ydGVycy5ydW4oJ2Fzc2V0X21hbmlmZXN0Jywge1xuICAgICAgcHJvamVjdDogdGhpc1xuICAgIH0pXG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGFsbCBvZiB0aGlzIHByb2plY3QncyBjb250ZW50IGNvbGxlY3Rpb25zLlxuICAgKi9cbiAgZ2V0IGNvbGxlY3Rpb25zKCkge1xuICAgIHJldHVybiB1dGlsLnZhbHVlcyh0aGlzLmNvbnRlbnQpXG4gIH1cblxuICBnZXQgYWxsQXNzZXRzICgpIHtcbiAgICByZXR1cm4gdXRpbC5mbGF0dGVuKHRoaXMuY29sbGVjdGlvbnMubWFwKGMgPT4gYy5hbGwpKVxuICB9XG5cbiAgZ2V0IGFzc2V0UGF0aHMgKCl7XG4gICAgcmV0dXJuIHRoaXMuYWxsQXNzZXRzLm1hcChhID0+IGEucGF0aHMucHJvamVjdClcbiAgfVxuXG4gIC8qKlxuICAqIEFjY2VzcyBhIGRvY3VtZW50IGJ5IHRoZSBkb2N1bWVudCBpZCBzaG9ydCBoYW5kXG4gICpcbiAgKiBEb2N1bWVudHMgYXJlIHRoZSBtb3N0IGltcG9ydGFudCBwYXJ0IG9mIGEgU2t5cGFnZXIgcHJvamVjdCwgc28gbWFrZSBpdCBlYXN5IHRvIGFjY2VzcyB0aGVtXG4gICpcbiAgKi9cbiAgIGF0IChkb2N1bWVudElkKSB7XG4gICAgIHJldHVybiB0aGlzLmRvY3VtZW50cy5hdChkb2N1bWVudElkKVxuICAgfVxuXG4gIC8qKlxuICAqIFRoaXMgaXMgYSBzeXN0ZW0gZm9yIHJlc29sdmluZyBwYXRocyBpbiB0aGUgcHJvamVjdCB0cmVlIHRvIHRoZVxuICAqIGFwcHJvcHJpYXRlIGhlbHBlciwgb3IgcmVzb2x2aW5nIHBhdGhzIHRvIHRoZSBsaW5rcyB0byB0aGVzZSBwYXRoc1xuICAqIGluIHNvbWUgb3RoZXIgc3lzdGVtIChsaWtlIGEgd2ViIHNpdGUpXG4gICovXG4gIGdldCByZXNvbHZlICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlclxuICB9XG5cbiAgLyoqXG4gICogQGFsaWFzIFByb2plY3QjcmVzb2x2ZVxuICAqL1xuICBnZXQgcmVzb2x2ZXIgKCkge1xuICAgIHJldHVybiByZXNvbHZlci5jYWxsKHRoaXMpXG4gIH1cblxuICAvKipcbiAgKiBVc2UgYSBwbHVnaW4gZnJvbSB0aGUgcGx1Z2lucyByZWdpc3RyeVxuICAqXG4gICovXG4gIHVzZSAocGx1Z2lucywgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKHR5cGVvZiBwbHVnaW5zID09PSAnc3RyaW5nJykge1xuICAgICAgcGx1Z2lucyA9IFtwbHVnaW5zXVxuICAgIH1cblxuICAgIHBsdWdpbnMuZm9yRWFjaChwbHVnaW4gPT4ge1xuICAgICAgbGV0IHBsdWdpbkNvbmZpZyA9IHRoaXMucGx1Z2lucy5sb29rdXAocGx1Z2luKVxuXG4gICAgICBpZiAocGx1Z2luQ29uZmlnICYmIHBsdWdpbkNvbmZpZy5hcGkgJiYgcGx1Z2luQ29uZmlnLmFwaS5tb2RpZnkpIHtcbiAgICAgICAgb3B0aW9ucy5wcm9qZWN0ID0gb3B0aW9ucy5wcm9qZWN0IHx8IHRoaXNcbiAgICAgICAgcGx1Z2luQ29uZmlnLmFwaS5tb2RpZnkob3B0aW9ucylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgcGx1Z2luQ29uZmlnLmFwaSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHBsdWdpbkNvbmZpZy5hcGkuY2FsbCh0aGlzLCB0aGlzLCBwbHVnaW5Db25maWcpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5lbmFibGVkUGx1Z2lucy5wdXNoKHBsdWdpbilcbiAgICB9KVxuICB9XG5cbiAgLypcbiAgKiBBbGlhc2VzIHRvIGNyZWF0ZSBoaWRkZW4gYW5kIGxhenkgZ2V0dGVycyBvbiB0aGUgcHJvamVjdFxuICAqL1xuICBoaWRkZW4gKC4uLmFyZ3MpIHsgcmV0dXJuIHV0aWwuaGlkZGVuLmdldHRlcih0aGlzLCAuLi5hcmdzKSB9XG4gIGxhenkgKC4uLmFyZ3MpIHsgcmV0dXJuIHV0aWwubGF6eSh0aGlzLCAuLi5hcmdzKSB9XG5cbiAgLyoqXG4gICAqIGJ1aWxkIGEgcGF0aCBmcm9tIGEgYmFzZSAoZS5nLiBkb2N1bWVudHMsIG1vZGVscywgYnVpbGQpXG4gICAqIHVzaW5nIHBhdGguam9pblxuICAgKi9cbiAgcGF0aCAoYmFzZSwgLi4ucmVzdCkge1xuICAgIHJldHVybiBqb2luKHRoaXMucGF0aHNbYmFzZV0sIC4uLnJlc3QpXG4gIH1cblxuICAvKipcbiAgKiBDb2xsZWN0aW9uIEFjY2Vzc29yIE1ldGhvZHNcbiAgKlxuICAqIFRoZXNlIGNhbiBiZSB1c2VkIHRvIGFjY2VzcyBkb2N1bWVudCBjb2xsZWN0aW9ucyB3aXRoaW4gdGhlIHByb2plY3RcbiAgKi9cbiAgZ2V0IGRvY3MgKCkge1xuICAgIHJldHVybiB0aGlzLmRvY3VtZW50c1xuICB9XG5cbiAgZ2V0IGRvY3VtZW50cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudC5kb2N1bWVudHNcbiAgfVxuXG4gIGdldCBkYXRhX3NvdXJjZXMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YV9zb3VyY2VzXG4gIH1cblxuICBnZXQgZGF0YV9zb3VyY2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50LmRhdGFfc291cmNlc1xuICB9XG5cbiAgZ2V0IGNvbGxlY3Rpb25zICgpIHtcbiAgICByZXR1cm4gdXRpbC52YWx1ZXModGhpcy5jb250ZW50KVxuICB9XG5cbiAgZ2V0IGFjdGlvbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuYWN0aW9uc1xuICB9XG5cbiAgZ2V0IGNvbnRleHRzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmNvbnRleHRzXG4gIH1cblxuICBnZXQgZXhwb3J0ZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmV4cG9ydGVyc1xuICB9XG5cbiAgZ2V0IGltcG9ydGVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5pbXBvcnRlcnNcbiAgfVxuXG4gIGdldCBwbHVnaW5zICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnBsdWdpbnNcbiAgfVxuXG4gIGdldCBtb2RlbHMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMubW9kZWxzXG4gIH1cblxuICBnZXQgc3RvcmVzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnN0b3Jlc1xuICB9XG5cbiAgZ2V0IHJlbmRlcmVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5yZW5kZXJlcnNcbiAgfVxuXG4gIGdldCB2aWV3cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy52aWV3c1xuICB9XG5cbiAgZ2V0IG1vZGVsTmFtZXMgKCkge1xuICAgIHJldHVybiB0aGlzLm1vZGVscy5hbGwubWFwKG1vZGVsID0+XG4gICAgICB1dGlsLnRhYmVsaXplKHV0aWwudW5kZXJzY29yZShtb2RlbC5uYW1lKSlcbiAgICApXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9qZWN0XG5cbmZ1bmN0aW9uIHBhdGhzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgbGV0IGNvbnZlbnRpb25hbCA9IHtcbiAgICBhc3NldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgYWN0aW9uczogam9pbih0aGlzLnJvb3QsICdhY3Rpb25zJyksXG4gICAgY29udGV4dHM6IGpvaW4odGhpcy5yb290LCAnY29udGV4dHMnKSxcbiAgICBkYXRhX3NvdXJjZXM6IGpvaW4odGhpcy5yb290LCAnZGF0YScpLFxuICAgIGRvY3VtZW50czogam9pbih0aGlzLnJvb3QsICdkb2NzJyksXG4gICAgZXhwb3J0ZXJzOiBqb2luKHRoaXMucm9vdCwgJ2V4cG9ydGVycycpLFxuICAgIGltcG9ydGVyczogam9pbih0aGlzLnJvb3QsICdpbXBvcnRlcnMnKSxcbiAgICBtb2RlbHM6IGpvaW4odGhpcy5yb290LCAnbW9kZWxzJyksXG4gICAgcGx1Z2luczogam9pbih0aGlzLnJvb3QsICdwbHVnaW5zJyksXG4gICAgcmVuZGVyZXJzOiBqb2luKHRoaXMucm9vdCwgJ3JlbmRlcmVycycpLFxuICAgIHZlY3RvcnM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgaW1hZ2VzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIHNjcmlwdHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgc3R5bGVzaGVldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgbWFuaWZlc3Q6IGpvaW4odGhpcy5yb290LCAncGFja2FnZS5qc29uJyksXG4gICAgY2FjaGU6IGpvaW4odGhpcy5yb290LCAndG1wJywgJ2NhY2hlJyksXG4gICAgbG9nczogam9pbih0aGlzLnJvb3QsICdsb2cnKSxcbiAgICBidWlsZDogam9pbih0aGlzLnJvb3QsICdkaXN0JyksXG4gICAgcHVibGljOiBqb2luKHRoaXMucm9vdCwgJ3B1YmxpYycpXG4gIH1cblxuICBsZXQgY3VzdG9tID0gcHJvamVjdC5vcHRpb25zLnBhdGhzIHx8IHByb2plY3QubWFuaWZlc3QucGF0aHMgfHwge31cblxuICByZXR1cm4gdXRpbC5hc3NpZ24oY29udmVudGlvbmFsLCBjdXN0b20pXG59XG5cbmZ1bmN0aW9uIGNvbnRlbnQgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IGNvbGxlY3Rpb25zID0gYnVpbGRDb250ZW50Q29sbGVjdGlvbnNNYW51YWxseS5jYWxsKHByb2plY3QpXG5cbiAgcmV0dXJuIGNvbGxlY3Rpb25zXG59XG5cbmZ1bmN0aW9uIHJ1bkltcG9ydGVyIChvcHRpb25zID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCBjb2xsZWN0aW9ucyA9IHByb2plY3QuY29sbGVjdGlvbnNcbiAgbGV0IHsgYXV0b0xvYWQsIGltcG9ydGVyIH0gPSBvcHRpb25zXG5cbiAgZGVidWcoJ2ltcG9ydCBzdGFydGluZycpXG4gIGxldCByZXN1bHQgPSBwcm9qZWN0LmltcG9ydGVycy5ydW4oaW1wb3J0ZXIgfHwgJ2Rpc2snLCB7IHByb2plY3Q6IHRoaXMsIGNvbGxlY3Rpb25zOiB0aGlzLmNvbnRlbnQsIGF1dG9Mb2FkIH0pXG4gIGRlYnVnKCdpbXBvcnQgZmluaXNoaW5nJylcblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ29udGVudENvbGxlY3Rpb25zTWFudWFsbHkgKCkge1xuICBjb25zdCBwcm9qZWN0ID0gdGhpc1xuICBjb25zdCBwYXRocyA9IHByb2plY3QucGF0aHNcblxuICBsZXQgeyBBc3NldCwgRGF0YVNvdXJjZSwgRG9jdW1lbnQsIEltYWdlLCBTY3JpcHQsIFN0eWxlc2hlZXQsIFZlY3RvciB9ID0gQXNzZXRzXG5cbiAgcmV0dXJuIHtcbiAgICBhc3NldHM6IEFzc2V0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGRhdGFfc291cmNlczogRGF0YVNvdXJjZS5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBkb2N1bWVudHM6IERvY3VtZW50LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGltYWdlczogSW1hZ2UuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgc2NyaXB0czogU2NyaXB0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIHN0eWxlc2hlZXRzOiBTdHlsZXNoZWV0LmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIHZlY3RvcnM6IFZlY3Rvci5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHN0b3JlcyAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xufVxuXG5mdW5jdGlvbiByZWdpc3RyaWVzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCByb290ID0gcHJvamVjdC5yb290XG5cbiAgbGV0IHJlZ2lzdHJpZXMgPSBSZWdpc3RyeS5idWlsZEFsbChwcm9qZWN0LCBIZWxwZXJzLCB7cm9vdH0pXG5cbiAgcHJvamVjdC5fX3J1bkhvb2soJ3JlZ2lzdHJpZXNEaWRMb2FkJywgcmVnaXN0cmllcylcblxuICByZXR1cm4gcmVnaXN0cmllc1xufVxuXG5mdW5jdGlvbiBlbnRpdGllcygpIHtcbiAgcmV0dXJuIHRoaXMubW9kZWxzLmF2YWlsYWJsZS5yZWR1Y2UoKG1lbW8saWQpID0+IHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLm1vZGVscy5sb29rdXAoaWQpXG4gICAgbGV0IGVudGl0aWVzID0gbW9kZWwuZW50aXRpZXMgPSBtb2RlbC5lbnRpdGllcyB8fCB7fVxuXG4gICAgT2JqZWN0LmFzc2lnbihtZW1vLCB7XG4gICAgICBnZXQgW3V0aWwudGFiZWxpemUodXRpbC51bmRlcnNjb3JlKG1vZGVsLm5hbWUpKV0oKXtcbiAgICAgICAgcmV0dXJuIGVudGl0aWVzXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBtZW1vXG4gIH0sIHt9KVxufVxuXG5mdW5jdGlvbiBzZXR1cEhvb2tzKGhvb2tzID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGhvb2tzKS5yZWR1Y2UoKG1lbW8sIGhvb2spID0+IHtcbiAgICBsZXQgZm4gPSBob29rc1tob29rXVxuXG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbWVtb1tob29rXSA9IGZuLmJpbmQocHJvamVjdClcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtb1xuICB9LCB7fSlcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplT3B0aW9ucyAob3B0aW9ucyA9IHt9KSB7XG4gIGlmIChvcHRpb25zLm1hbmlmZXN0ICYmIG9wdGlvbnMubWFuaWZlc3Quc2t5cGFnZXIpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihvcHRpb25zLCBvcHRpb25zLm1hbmlmZXN0LnNreXBhZ2VyKVxuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnNcbn1cbiJdfQ==