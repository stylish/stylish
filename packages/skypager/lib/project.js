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
//# sourceMappingURL=data:application/json;base64,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YTtNQUFaLEtBQUsseURBQUcsRUFBRTs7QUFDNUIsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBOztBQUVsQixTQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLElBQUksRUFBSztBQUMvQyxRQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRXBCLFFBQUksT0FBTyxFQUFFLEtBQUssVUFBVSxFQUFFO0FBQzVCLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQzlCOztBQUVELFdBQU8sSUFBSSxDQUFBO0dBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQTtDQUNQOztBQUVELFNBQVMsZ0JBQWdCLEdBQWdCO01BQWQsT0FBTyx5REFBRyxFQUFFOztBQUNyQyxNQUFJLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUU7QUFDakQsV0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7R0FDNUQ7O0FBRUQsU0FBTyxPQUFPLENBQUE7Q0FDZiIsImZpbGUiOiJwcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNreXBhZ2VyIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgbWQ1IGZyb20gJ21kNSdcblxuaW1wb3J0IFJlZ2lzdHJ5IGZyb20gJy4vcmVnaXN0cnknXG5pbXBvcnQgQ29sbGVjdGlvbiBmcm9tICcuL2NvbGxlY3Rpb24nXG5pbXBvcnQgcmVzb2x2ZXIgZnJvbSAnLi9yZXNvbHZlcidcblxuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5pbXBvcnQgKiBhcyBBc3NldHMgZnJvbSAnLi9hc3NldHMnXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcblxuaW1wb3J0IHsgcmVzb2x2ZSwgZGlybmFtZSwgam9pbiwgYmFzZW5hbWUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgX2RlYnVnIGZyb20gJ2RlYnVnJ1xuXG5jb25zdCBkZWJ1ZyA9IF9kZWJ1Zygnc2t5cGFnZXI6cHJvamVjdCcpXG5jb25zdCBoaWRlID0gdXRpbC5oaWRlLmdldHRlclxuY29uc3QgbGF6eSA9IHV0aWwubGF6eVxuXG5jb25zdCBIT09LUyA9IFtcbiAgJ2NvbnRlbnRXaWxsSW5pdGlhbGl6ZScsXG4gICdjb250ZW50RGlkSW5pdGlhbGl6ZScsXG4gICdwcm9qZWN0V2lsbEF1dG9JbXBvcnQnLFxuICAncHJvamVjdERpZEF1dG9JbXBvcnQnLFxuICAnd2lsbEJ1aWxkRW50aXRpZXMnLFxuICAnZGlkQnVpbGRFbnRpdGllcycsXG4gICdyZWdpc3RyaWVzRGlkTG9hZCdcbl1cblxuY2xhc3MgUHJvamVjdCB7XG4gIGNvbnN0cnVjdG9yICh1cmksIG9wdGlvbnMgPSB7fSkge1xuICAgIGRlYnVnKCdwcm9qZWN0IGNyZWF0ZWQgYXQ6ICcgKyB1cmkpXG4gICAgZGVidWcoJ09wdGlvbiBrZXlzOiAnICsgT2JqZWN0LmtleXMob3B0aW9ucykpXG5cbiAgICB1cmkuc2hvdWxkLmJlLmEuU3RyaW5nKClcbiAgICB1cmkuc2hvdWxkLm5vdC5iZS5lbXB0eSgpXG5cbiAgICBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMpXG5cbiAgICBsZXQgcHJvamVjdCA9IHRoaXNcblxuICAgIHByb2plY3QudXJpID0gdXJpXG4gICAgcHJvamVjdC5yb290ID0gZGlybmFtZSh1cmkpXG4gICAgcHJvamVjdC50eXBlID0gb3B0aW9ucy50eXBlIHx8ICdwcm9qZWN0J1xuXG4gICAgcHJvamVjdC5oaWRkZW4oJ29wdGlvbnMnLCAoKSA9PiBvcHRpb25zKVxuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb2plY3QsICdtYW5pZmVzdCcsIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IG9wdGlvbnMubWFuaWZlc3QgfHwge31cbiAgICB9KVxuXG4gICAgLy8gYXV0b2JpbmQgaG9va3MgZnVuY3Rpb25zIHBhc3NlZCBpbiBhcyBvcHRpb25zXG4gICAgcHJvamVjdC5oaWRkZW4oJ2hvb2tzJywgc2V0dXBIb29rcy5jYWxsKHByb2plY3QsIG9wdGlvbnMuaG9va3MpKVxuXG4gICAgcHJvamVjdC5oaWRkZW4oJ3BhdGhzJywgcGF0aHMuYmluZChwcm9qZWN0KSlcblxuICAgIHByb2plY3QuaGlkZGVuKCdyZWdpc3RyaWVzJywgcmVnaXN0cmllcy5jYWxsKHByb2plY3QpLCBmYWxzZSlcblxuICAgIHByb2plY3QubmFtZSA9IG9wdGlvbnMubmFtZSB8fCBiYXNlbmFtZShwcm9qZWN0LnJvb3QpXG5cbiAgICBjb25zdCBwbHVnaW5zID0gWyBdXG4gICAgdXRpbC5oaWRlLmdldHRlcihwcm9qZWN0LCAnZW5hYmxlZFBsdWdpbnMnLCAoKSA9PiBwbHVnaW5zKVxuXG4gICAgaWYgKG9wdGlvbnMucGx1Z2lucykge1xuICAgICAgb3B0aW9ucy5wbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZihwbHVnaW4pID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcGx1Z2luLmNhbGwodGhpcywgdGhpcylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVzZShwbHVnaW4pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgcHJvamVjdC5ydW5Ib29rKCdjb250ZW50V2lsbEluaXRpYWxpemUnKVxuICAgIC8vIHdyYXAgdGhlIGNvbnRlbnQgaW50ZXJmYWNlIGluIGEgZ2V0dGVyIGJ1dCBtYWtlIHN1cmVcbiAgICAvLyB0aGUgZG9jdW1lbnRzIGNvbGxlY3Rpb24gaXMgbG9hZGVkIGFuZCBhdmFpbGFibGUgcmlnaHQgYXdheVxuICAgIHByb2plY3QuaGlkZGVuKCdjb250ZW50JywgY29udGVudC5jYWxsKHByb2plY3QpKVxuXG4gICAgcHJvamVjdC5ydW5Ib29rKCdjb250ZW50RGlkSW5pdGlhbGl6ZScpXG5cbiAgICBpZiAob3B0aW9ucy5hdXRvSW1wb3J0ICE9PSBmYWxzZSkge1xuICAgICAgZGVidWcoJ3J1bm5pbmcgYXV0b2ltcG9ydCcsIG9wdGlvbnMuYXV0b0xvYWQpXG5cbiAgICAgIHByb2plY3QucnVuSG9vaygncHJvamVjdFdpbGxBdXRvSW1wb3J0JylcblxuICAgICAgcnVuSW1wb3J0ZXIuY2FsbChwcm9qZWN0LCB7XG4gICAgICAgIHR5cGU6IChvcHRpb25zLmltcG9ydGVyVHlwZSB8fCAnZGlzaycpLFxuICAgICAgICBhdXRvTG9hZDogb3B0aW9ucy5hdXRvTG9hZCB8fCB7XG4gICAgICAgICAgZG9jdW1lbnRzOiB0cnVlLFxuICAgICAgICAgIGFzc2V0czogdHJ1ZSxcbiAgICAgICAgICB2ZWN0b3JzOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHByb2plY3QucnVuSG9vaygncHJvamVjdERpZEF1dG9JbXBvcnQnKVxuICAgIH1cblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIocHJvamVjdCwgJ3N1cHBvcnRlZEFzc2V0RXh0ZW5zaW9ucycsICgpID0+IEFzc2V0cy5Bc3NldC5TdXBwb3J0ZWRFeHRlbnNpb25zIClcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9qZWN0LCAnZW50aXRpZXMnLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVsZXRlIHByb2plY3QuZW50aXRpZXNcbiAgICAgICAgZGVidWcoJ2J1aWxkaW5nIGVudGl0aWVzJylcblxuICAgICAgICBwcm9qZWN0LnJ1bkhvb2soJ3dpbGxCdWlsZEVudGl0aWVzJylcbiAgICAgICAgcHJvamVjdC5lbnRpdGllcyA9IGVudGl0aWVzLmNhbGwocHJvamVjdClcbiAgICAgICAgcHJvamVjdC5ydW5Ib29rKCdkaWRCdWlsZEVudGl0aWVzJywgcHJvamVjdCwgcHJvamVjdC5lbnRpdGllcylcblxuICAgICAgICByZXR1cm4gcHJvamVjdC5lbnRpdGllc1xuICAgICAgfVxuICAgIH0pXG5cbiAgfVxuXG4gIHJ1bkhvb2sobmFtZSwgLi4uYXJncykge1xuICAgIGxldCBwcm9qZWN0ID0gdGhpc1xuICAgIGxldCBmbiA9IHByb2plY3QuaG9va3NbbmFtZV0gfHwgcHJvamVjdFtuYW1lXVxuICAgIGlmIChmbikgeyBmbi5jYWxsKHByb2plY3QsIC4uLmFyZ3MpIH1cbiAgfVxuICAvKipcbiAgICogQSBwcm94eSBvYmplY3QgdGhhdCBsZXRzIHlvdSBydW4gb25lIG9mIHRoZSBwcm9qZWN0IGhlbHBlcnMuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHByb2plY3QucnVuLmltcG9ydGVyKCdkaXNrJylcbiAgICogcHJvamVjdC5ydW4uYWN0aW9uKCdzbmFwc2hvdHMvc2F2ZScsICcvcGF0aC90by9zbmFwc2hvdC5qc29uJylcbiAgICpcbiAgICovXG4gIGdldCBydW4oKXtcbiAgICBsZXQgcHJvamVjdCA9IHRoaXNcblxuICAgIHJldHVybiB7XG4gICAgICBhY3Rpb246IGZ1bmN0aW9uIGFjdGlvbiguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LmFjdGlvbnMucnVuKC4uLmFyZ3MpIH0sXG4gICAgICBjb250ZXh0OiBmdW5jdGlvbiBjb250ZXh0KC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QuY29udGV4dHMucnVuKC4uLmFyZ3MpIH0sXG4gICAgICBpbXBvcnRlcjogZnVuY3Rpb24gaW1wb3J0ZXIodHlwZSwgLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5pbXBvcnRlcnMucnVuKCh0eXBlIHx8IHByb2plY3Qub3B0aW9ucy5pbXBvcnRlciB8fCAnZGlzaycpLCAuLi5hcmdzKSB9LFxuICAgICAgZXhwb3J0ZXI6IGZ1bmN0aW9uIGV4cG9ydGVyKHR5cGUsIC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QuZXhwb3J0ZXJzLnJ1bigodHlwZSB8fCBwcm9qZWN0Lm9wdGlvbnMuZXhwb3J0ZXIgfHwgJ3NuYXBzaG90JyksIC4uLmFyZ3MpIH0sXG4gICAgICBtb2RlbDogZnVuY3Rpb24gbW9kZWwoLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5tb2RlbHMucnVuKC4uLmFyZ3MpIH0sXG4gICAgICByZW5kZXJlcjogZnVuY3Rpb24gcmVuZGVyZXIoLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5yZW5kZXJlcnMucnVuKC4uLmFyZ3MpIH0sXG4gICAgICB2aWV3OiBmdW5jdGlvbiB2aWV3KC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3Qudmlld3MucnVuKC4uLmFyZ3MpIH1cbiAgICB9XG4gIH1cblxuICBnZXQgYXNzZXRNYW5pZmVzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwb3J0ZXJzLnJ1bignYXNzZXRfbWFuaWZlc3QnLCB7XG4gICAgICBwcm9qZWN0OiB0aGlzXG4gICAgfSlcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIG9mIHRoaXMgcHJvamVjdCdzIGNvbnRlbnQgY29sbGVjdGlvbnMuXG4gICAqL1xuICBnZXQgY29sbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHV0aWwudmFsdWVzKHRoaXMuY29udGVudClcbiAgfVxuXG4gIGdldCBhbGxBc3NldHMgKCkge1xuICAgIHJldHVybiB1dGlsLmZsYXR0ZW4odGhpcy5jb2xsZWN0aW9ucy5tYXAoYyA9PiBjLmFsbCkpXG4gIH1cblxuICBnZXQgYXNzZXRQYXRocyAoKXtcbiAgICByZXR1cm4gdGhpcy5hbGxBc3NldHMubWFwKGEgPT4gYS5wYXRocy5wcm9qZWN0KVxuICB9XG5cbiAgLyoqXG4gICogQWNjZXNzIGEgZG9jdW1lbnQgYnkgdGhlIGRvY3VtZW50IGlkIHNob3J0IGhhbmRcbiAgKlxuICAqIERvY3VtZW50cyBhcmUgdGhlIG1vc3QgaW1wb3J0YW50IHBhcnQgb2YgYSBTa3lwYWdlciBwcm9qZWN0LCBzbyBtYWtlIGl0IGVhc3kgdG8gYWNjZXNzIHRoZW1cbiAgKlxuICAqL1xuICAgYXQgKGRvY3VtZW50SWQpIHtcbiAgICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRzLmF0KGRvY3VtZW50SWQpXG4gICB9XG5cbiAgLyoqXG4gICogVGhpcyBpcyBhIHN5c3RlbSBmb3IgcmVzb2x2aW5nIHBhdGhzIGluIHRoZSBwcm9qZWN0IHRyZWUgdG8gdGhlXG4gICogYXBwcm9wcmlhdGUgaGVscGVyLCBvciByZXNvbHZpbmcgcGF0aHMgdG8gdGhlIGxpbmtzIHRvIHRoZXNlIHBhdGhzXG4gICogaW4gc29tZSBvdGhlciBzeXN0ZW0gKGxpa2UgYSB3ZWIgc2l0ZSlcbiAgKi9cbiAgZ2V0IHJlc29sdmUgKCkge1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVyXG4gIH1cblxuICAvKipcbiAgKiBAYWxpYXMgUHJvamVjdCNyZXNvbHZlXG4gICovXG4gIGdldCByZXNvbHZlciAoKSB7XG4gICAgcmV0dXJuIHJlc29sdmVyLmNhbGwodGhpcylcbiAgfVxuXG4gIC8qKlxuICAqIFVzZSBhIHBsdWdpbiBmcm9tIHRoZSBwbHVnaW5zIHJlZ2lzdHJ5XG4gICpcbiAgKi9cbiAgdXNlIChwbHVnaW5zLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAodHlwZW9mIHBsdWdpbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwbHVnaW5zID0gW3BsdWdpbnNdXG4gICAgfVxuXG4gICAgcGx1Z2lucy5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgICBsZXQgcGx1Z2luQ29uZmlnID0gdGhpcy5wbHVnaW5zLmxvb2t1cChwbHVnaW4pXG5cbiAgICAgIGlmIChwbHVnaW5Db25maWcgJiYgcGx1Z2luQ29uZmlnLmFwaSAmJiBwbHVnaW5Db25maWcuYXBpLm1vZGlmeSkge1xuICAgICAgICBvcHRpb25zLnByb2plY3QgPSBvcHRpb25zLnByb2plY3QgfHwgdGhpc1xuICAgICAgICBwbHVnaW5Db25maWcuYXBpLm1vZGlmeShvcHRpb25zKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwbHVnaW5Db25maWcuYXBpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcGx1Z2luQ29uZmlnLmFwaS5jYWxsKHRoaXMsIHRoaXMsIHBsdWdpbkNvbmZpZylcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmVuYWJsZWRQbHVnaW5zLnB1c2gocGx1Z2luKVxuICAgIH0pXG4gIH1cblxuICAvKlxuICAqIEFsaWFzZXMgdG8gY3JlYXRlIGhpZGRlbiBhbmQgbGF6eSBnZXR0ZXJzIG9uIHRoZSBwcm9qZWN0XG4gICovXG4gIGhpZGRlbiAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5oaWRkZW4uZ2V0dGVyKHRoaXMsIC4uLmFyZ3MpIH1cbiAgbGF6eSAoLi4uYXJncykgeyByZXR1cm4gdXRpbC5sYXp5KHRoaXMsIC4uLmFyZ3MpIH1cblxuICAvKipcbiAgICogYnVpbGQgYSBwYXRoIGZyb20gYSBiYXNlIChlLmcuIGRvY3VtZW50cywgbW9kZWxzLCBidWlsZClcbiAgICogdXNpbmcgcGF0aC5qb2luXG4gICAqL1xuICBwYXRoIChiYXNlLCAuLi5yZXN0KSB7XG4gICAgcmV0dXJuIGpvaW4odGhpcy5wYXRoc1tiYXNlXSwgLi4ucmVzdClcbiAgfVxuXG4gIC8qKlxuICAqIENvbGxlY3Rpb24gQWNjZXNzb3IgTWV0aG9kc1xuICAqXG4gICogVGhlc2UgY2FuIGJlIHVzZWQgdG8gYWNjZXNzIGRvY3VtZW50IGNvbGxlY3Rpb25zIHdpdGhpbiB0aGUgcHJvamVjdFxuICAqL1xuICBnZXQgZG9jcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRzXG4gIH1cblxuICBnZXQgZG9jdW1lbnRzICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50LmRvY3VtZW50c1xuICB9XG5cbiAgZ2V0IGRhdGFfc291cmNlcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudC5kYXRhX3NvdXJjZXNcbiAgfVxuXG4gIGdldCBkYXRhX3NvdXJjZXMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZGF0YV9zb3VyY2VzXG4gIH1cblxuICBnZXQgY29sbGVjdGlvbnMgKCkge1xuICAgIHJldHVybiB1dGlsLnZhbHVlcyh0aGlzLmNvbnRlbnQpXG4gIH1cblxuICBnZXQgYWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5hY3Rpb25zXG4gIH1cblxuICBnZXQgY29udGV4dHMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuY29udGV4dHNcbiAgfVxuXG4gIGdldCBleHBvcnRlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuZXhwb3J0ZXJzXG4gIH1cblxuICBnZXQgaW1wb3J0ZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmltcG9ydGVyc1xuICB9XG5cbiAgZ2V0IHBsdWdpbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMucGx1Z2luc1xuICB9XG5cbiAgZ2V0IG1vZGVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5tb2RlbHNcbiAgfVxuXG4gIGdldCBzdG9yZXMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuc3RvcmVzXG4gIH1cblxuICBnZXQgcmVuZGVyZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnJlbmRlcmVyc1xuICB9XG5cbiAgZ2V0IHZpZXdzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnZpZXdzXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBQcm9qZWN0XG5cbmZ1bmN0aW9uIHBhdGhzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgbGV0IGNvbnZlbnRpb25hbCA9IHtcbiAgICBhc3NldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgYWN0aW9uczogam9pbih0aGlzLnJvb3QsICdhY3Rpb25zJyksXG4gICAgY29udGV4dHM6IGpvaW4odGhpcy5yb290LCAnY29udGV4dHMnKSxcbiAgICBkYXRhX3NvdXJjZXM6IGpvaW4odGhpcy5yb290LCAnZGF0YScpLFxuICAgIGRvY3VtZW50czogam9pbih0aGlzLnJvb3QsICdkb2NzJyksXG4gICAgZXhwb3J0ZXJzOiBqb2luKHRoaXMucm9vdCwgJ2V4cG9ydGVycycpLFxuICAgIGltcG9ydGVyczogam9pbih0aGlzLnJvb3QsICdpbXBvcnRlcnMnKSxcbiAgICBtb2RlbHM6IGpvaW4odGhpcy5yb290LCAnbW9kZWxzJyksXG4gICAgcGx1Z2luczogam9pbih0aGlzLnJvb3QsICdwbHVnaW5zJyksXG4gICAgcmVuZGVyZXJzOiBqb2luKHRoaXMucm9vdCwgJ3JlbmRlcmVycycpLFxuICAgIHZlY3RvcnM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgaW1hZ2VzOiBqb2luKHRoaXMucm9vdCwgJ2Fzc2V0cycpLFxuICAgIHNjcmlwdHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgc3R5bGVzaGVldHM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgbWFuaWZlc3Q6IGpvaW4odGhpcy5yb290LCAncGFja2FnZS5qc29uJyksXG4gICAgY2FjaGU6IGpvaW4odGhpcy5yb290LCAndG1wJywgJ2NhY2hlJyksXG4gICAgbG9nczogam9pbih0aGlzLnJvb3QsICdsb2cnKSxcbiAgICBidWlsZDogam9pbih0aGlzLnJvb3QsICdkaXN0JylcbiAgfVxuXG4gIGxldCBjdXN0b20gPSBwcm9qZWN0Lm9wdGlvbnMucGF0aHMgfHwgcHJvamVjdC5tYW5pZmVzdC5wYXRocyB8fCB7fVxuXG4gIHJldHVybiB1dGlsLmFzc2lnbihjb252ZW50aW9uYWwsIGN1c3RvbSlcbn1cblxuZnVuY3Rpb24gY29udGVudCAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuICBsZXQgY29sbGVjdGlvbnMgPSBidWlsZENvbnRlbnRDb2xsZWN0aW9uc01hbnVhbGx5LmNhbGwocHJvamVjdClcblxuICByZXR1cm4gY29sbGVjdGlvbnNcbn1cblxuZnVuY3Rpb24gcnVuSW1wb3J0ZXIgKG9wdGlvbnMgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IGNvbGxlY3Rpb25zID0gcHJvamVjdC5jb2xsZWN0aW9uc1xuICBsZXQgeyBhdXRvTG9hZCwgaW1wb3J0ZXIgfSA9IG9wdGlvbnNcblxuICBkZWJ1ZygnaW1wb3J0IHN0YXJ0aW5nJylcbiAgbGV0IHJlc3VsdCA9IHByb2plY3QuaW1wb3J0ZXJzLnJ1bihpbXBvcnRlciB8fCAnZGlzaycsIHsgcHJvamVjdDogdGhpcywgY29sbGVjdGlvbnM6IHRoaXMuY29udGVudCwgYXV0b0xvYWQgfSlcbiAgZGVidWcoJ2ltcG9ydCBmaW5pc2hpbmcnKVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gYnVpbGRDb250ZW50Q29sbGVjdGlvbnNNYW51YWxseSAoKSB7XG4gIGNvbnN0IHByb2plY3QgPSB0aGlzXG4gIGNvbnN0IHBhdGhzID0gcHJvamVjdC5wYXRoc1xuXG4gIGxldCB7IEFzc2V0LCBEYXRhU291cmNlLCBEb2N1bWVudCwgSW1hZ2UsIFNjcmlwdCwgU3R5bGVzaGVldCwgVmVjdG9yIH0gPSBBc3NldHNcblxuICByZXR1cm4ge1xuICAgIGFzc2V0czogQXNzZXQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgZGF0YV9zb3VyY2VzOiBEYXRhU291cmNlLmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIGRvY3VtZW50czogRG9jdW1lbnQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgaW1hZ2VzOiBJbWFnZS5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBzY3JpcHRzOiBTY3JpcHQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgc3R5bGVzaGVldHM6IFN0eWxlc2hlZXQuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgdmVjdG9yczogVmVjdG9yLmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpXG4gIH1cbn1cblxuZnVuY3Rpb24gc3RvcmVzICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG59XG5cbmZ1bmN0aW9uIHJlZ2lzdHJpZXMgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbiAgbGV0IHJvb3QgPSBwcm9qZWN0LnJvb3RcblxuICBsZXQgcmVnaXN0cmllcyA9IFJlZ2lzdHJ5LmJ1aWxkQWxsKHByb2plY3QsIEhlbHBlcnMsIHtyb290fSlcblxuICBwcm9qZWN0LnJ1bkhvb2soJ3JlZ2lzdHJpZXNEaWRMb2FkJywgcmVnaXN0cmllcylcblxuICByZXR1cm4gcmVnaXN0cmllc1xufVxuXG5mdW5jdGlvbiBlbnRpdGllcygpIHtcbiAgbGV0IG1vZGVsTmFtZXMgPSBbJ291dGxpbmUnLCdwYWdlJ10uY29uY2F0KHRoaXMubW9kZWxzLmF2YWlsYWJsZSlcblxuICByZXR1cm4gbW9kZWxOYW1lcy5yZWR1Y2UoKG1lbW8saWQpID0+IHtcbiAgICBsZXQgbW9kZWwgPSB0aGlzLm1vZGVscy5sb29rdXAoaWQpXG4gICAgbGV0IGVudGl0aWVzID0gbW9kZWwuZW50aXRpZXMgPSBtb2RlbC5lbnRpdGllcyB8fCB7fVxuXG4gICAgT2JqZWN0LmFzc2lnbihtZW1vLCB7XG4gICAgICBnZXQgW3V0aWwudGFiZWxpemUodXRpbC51bmRlcnNjb3JlKG1vZGVsLm5hbWUpKV0oKXtcbiAgICAgICAgcmV0dXJuIGVudGl0aWVzXG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBtZW1vXG4gIH0sIHt9KVxufVxuXG5mdW5jdGlvbiBzZXR1cEhvb2tzKGhvb2tzID0ge30pIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGhvb2tzKS5yZWR1Y2UoKG1lbW8sIGhvb2spID0+IHtcbiAgICBsZXQgZm4gPSBob29rc1tob29rXVxuXG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbWVtb1tob29rXSA9IGZuLmJpbmQocHJvamVjdClcbiAgICB9XG5cbiAgICByZXR1cm4gbWVtb1xuICB9LCB7fSlcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplT3B0aW9ucyAob3B0aW9ucyA9IHt9KSB7XG4gIGlmIChvcHRpb25zLm1hbmlmZXN0ICYmIG9wdGlvbnMubWFuaWZlc3Quc2t5cGFnZXIpIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbihvcHRpb25zLCBvcHRpb25zLm1hbmlmZXN0LnNreXBhZ2VyKVxuICB9XG5cbiAgcmV0dXJuIG9wdGlvbnNcbn1cbiJdfQ==