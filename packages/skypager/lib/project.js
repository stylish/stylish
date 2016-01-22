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

  project.runHook('registriesDidLoad');

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
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxTQUFTLEVBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7O0FBRWpFLFNBQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxVQUFDLElBQUksRUFBQyxFQUFFLEVBQUs7OztBQUNwQyxRQUFJLEtBQUssR0FBRyxPQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDbEMsUUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQTs7QUFFcEQsVUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLHlDQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsbUlBQUc7QUFDaEQsYUFBTyxRQUFRLENBQUE7S0FDaEIsNEVBQ0QsQ0FBQTs7QUFFRixXQUFPLElBQUksQ0FBQTtHQUNaLEVBQUUsRUFBRSxDQUFDLENBQUE7Q0FDUDs7QUFFRCxTQUFTLFVBQVUsR0FBYTtNQUFaLEtBQUsseURBQUcsRUFBRTs7QUFDNUIsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFBOztBQUVsQixTQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBSSxFQUFFLElBQUksRUFBSztBQUMvQyxRQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7O0FBRXBCLFFBQUksT0FBTyxFQUFFLEtBQUssVUFBVSxFQUFFO0FBQzVCLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQzlCOztBQUVELFdBQU8sSUFBSSxDQUFBO0dBQ1osRUFBRSxFQUFFLENBQUMsQ0FBQTtDQUNQIiwiZmlsZSI6InByb2plY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2t5cGFnZXIgZnJvbSAnLi9pbmRleCdcbmltcG9ydCBtZDUgZnJvbSAnbWQ1J1xuXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi9yZWdpc3RyeSdcbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vY29sbGVjdGlvbidcbmltcG9ydCByZXNvbHZlciBmcm9tICcuL3Jlc29sdmVyJ1xuXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCAqIGFzIEFzc2V0cyBmcm9tICcuL2Fzc2V0cydcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsJ1xuXG5pbXBvcnQgeyByZXNvbHZlLCBkaXJuYW1lLCBqb2luLCBiYXNlbmFtZSwgZXh0bmFtZSB9IGZyb20gJ3BhdGgnXG5cbmltcG9ydCBfZGVidWcgZnJvbSAnZGVidWcnXG5cbmNvbnN0IGRlYnVnID0gX2RlYnVnKCdza3lwYWdlcjpwcm9qZWN0JylcbmNvbnN0IGhpZGUgPSB1dGlsLmhpZGUuZ2V0dGVyXG5jb25zdCBsYXp5ID0gdXRpbC5sYXp5XG5cbmNvbnN0IEhPT0tTID0gW1xuICAnY29udGVudFdpbGxJbml0aWFsaXplJyxcbiAgJ2NvbnRlbnREaWRJbml0aWFsaXplJyxcbiAgJ3Byb2plY3RXaWxsQXV0b0ltcG9ydCcsXG4gICdwcm9qZWN0RGlkQXV0b0ltcG9ydCcsXG4gICd3aWxsQnVpbGRFbnRpdGllcycsXG4gICdkaWRCdWlsZEVudGl0aWVzJyxcbiAgJ3JlZ2lzdHJpZXNEaWRMb2FkJ1xuXVxuXG5jbGFzcyBQcm9qZWN0IHtcbiAgY29uc3RydWN0b3IgKHVyaSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgZGVidWcoJ3Byb2plY3QgY3JlYXRlZCBhdDogJyArIHVyaSlcbiAgICBkZWJ1ZygnT3B0aW9uIGtleXM6ICcgKyBPYmplY3Qua2V5cyhvcHRpb25zKSlcblxuICAgIHVyaS5zaG91bGQuYmUuYS5TdHJpbmcoKVxuICAgIHVyaS5zaG91bGQubm90LmJlLmVtcHR5KClcblxuICAgIGxldCBwcm9qZWN0ID0gdGhpc1xuXG4gICAgcHJvamVjdC51cmkgPSB1cmlcbiAgICBwcm9qZWN0LnJvb3QgPSBkaXJuYW1lKHVyaSlcbiAgICBwcm9qZWN0LnR5cGUgPSBvcHRpb25zLnR5cGUgfHwgJ3Byb2plY3QnXG5cbiAgICBwcm9qZWN0LmhpZGRlbignb3B0aW9ucycsICgpID0+IG9wdGlvbnMpXG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvamVjdCwgJ21hbmlmZXN0Jywge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB2YWx1ZTogb3B0aW9ucy5tYW5pZmVzdCB8fCB7fVxuICAgIH0pXG5cbiAgICAvLyBhdXRvYmluZCBob29rcyBmdW5jdGlvbnMgcGFzc2VkIGluIGFzIG9wdGlvbnNcbiAgICBwcm9qZWN0LmhpZGRlbignaG9va3MnLCBzZXR1cEhvb2tzLmNhbGwocHJvamVjdCwgb3B0aW9ucy5ob29rcykpXG5cbiAgICBwcm9qZWN0LmhpZGRlbigncGF0aHMnLCBwYXRocy5iaW5kKHByb2plY3QpKVxuXG4gICAgY29uc3QgcGx1Z2lucyA9IFsgXVxuICAgIHV0aWwuaGlkZS5nZXR0ZXIocHJvamVjdCwgJ2VuYWJsZWRQbHVnaW5zJywgKCkgPT4gcGx1Z2lucylcblxuICAgIHByb2plY3QubGF6eSgncmVnaXN0cmllcycsIHJlZ2lzdHJpZXMuYmluZChwcm9qZWN0KSwgZmFsc2UpXG5cbiAgICBwcm9qZWN0Lm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgYmFzZW5hbWUocHJvamVjdC5yb290KVxuXG4gICAgcHJvamVjdC5ydW5Ib29rKCdjb250ZW50V2lsbEluaXRpYWxpemUnKVxuICAgIC8vIHdyYXAgdGhlIGNvbnRlbnQgaW50ZXJmYWNlIGluIGEgZ2V0dGVyIGJ1dCBtYWtlIHN1cmVcbiAgICAvLyB0aGUgZG9jdW1lbnRzIGNvbGxlY3Rpb24gaXMgbG9hZGVkIGFuZCBhdmFpbGFibGUgcmlnaHQgYXdheVxuICAgIHByb2plY3QuaGlkZGVuKCdjb250ZW50JywgY29udGVudC5jYWxsKHByb2plY3QpKVxuXG4gICAgcHJvamVjdC5ydW5Ib29rKCdjb250ZW50RGlkSW5pdGlhbGl6ZScpXG5cbiAgICBpZiAob3B0aW9ucy5hdXRvSW1wb3J0ICE9PSBmYWxzZSkge1xuICAgICAgZGVidWcoJ3J1bm5pbmcgYXV0b2ltcG9ydCcsIG9wdGlvbnMuYXV0b0xvYWQpXG5cbiAgICAgIHByb2plY3QucnVuSG9vaygncHJvamVjdFdpbGxBdXRvSW1wb3J0JylcblxuICAgICAgcnVuSW1wb3J0ZXIuY2FsbChwcm9qZWN0LCB7XG4gICAgICAgIHR5cGU6IChvcHRpb25zLmltcG9ydGVyVHlwZSB8fCAnZGlzaycpLFxuICAgICAgICBhdXRvTG9hZDogb3B0aW9ucy5hdXRvTG9hZCB8fCB7XG4gICAgICAgICAgZG9jdW1lbnRzOiB0cnVlLFxuICAgICAgICAgIGFzc2V0czogdHJ1ZSxcbiAgICAgICAgICB2ZWN0b3JzOiB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIHByb2plY3QucnVuSG9vaygncHJvamVjdERpZEF1dG9JbXBvcnQnKVxuICAgIH1cblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIocHJvamVjdCwgJ3N1cHBvcnRlZEFzc2V0RXh0ZW5zaW9ucycsICgpID0+IEFzc2V0cy5Bc3NldC5TdXBwb3J0ZWRFeHRlbnNpb25zIClcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm9qZWN0LCAnZW50aXRpZXMnLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZGVsZXRlIHByb2plY3QuZW50aXRpZXNcbiAgICAgICAgZGVidWcoJ2J1aWxkaW5nIGVudGl0aWVzJylcblxuICAgICAgICBwcm9qZWN0LnJ1bkhvb2soJ3dpbGxCdWlsZEVudGl0aWVzJylcbiAgICAgICAgcHJvamVjdC5lbnRpdGllcyA9IGVudGl0aWVzLmNhbGwocHJvamVjdClcbiAgICAgICAgcHJvamVjdC5ydW5Ib29rKCdkaWRCdWlsZEVudGl0aWVzJywgcHJvamVjdCwgcHJvamVjdC5lbnRpdGllcylcblxuICAgICAgICByZXR1cm4gcHJvamVjdC5lbnRpdGllc1xuICAgICAgfVxuICAgIH0pXG5cbiAgfVxuXG4gIHJ1bkhvb2sobmFtZSwgLi4uYXJncykge1xuICAgIGxldCBwcm9qZWN0ID0gdGhpc1xuICAgIGxldCBmbiA9IHByb2plY3QuaG9va3NbbmFtZV0gfHwgcHJvamVjdFtuYW1lXVxuICAgIGlmIChmbikgeyBmbi5jYWxsKHByb2plY3QsIC4uLmFyZ3MpIH1cbiAgfVxuICAvKipcbiAgICogQSBwcm94eSBvYmplY3QgdGhhdCBsZXRzIHlvdSBydW4gb25lIG9mIHRoZSBwcm9qZWN0IGhlbHBlcnMuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqIHByb2plY3QucnVuLmltcG9ydGVyKCdkaXNrJylcbiAgICogcHJvamVjdC5ydW4uYWN0aW9uKCdzbmFwc2hvdHMvc2F2ZScsICcvcGF0aC90by9zbmFwc2hvdC5qc29uJylcbiAgICpcbiAgICovXG4gIGdldCBydW4oKXtcbiAgICBsZXQgcHJvamVjdCA9IHRoaXNcblxuICAgIHJldHVybiB7XG4gICAgICBhY3Rpb246IGZ1bmN0aW9uIGFjdGlvbiguLi5hcmdzKSB7IHJldHVybiBwcm9qZWN0LmFjdGlvbnMucnVuKC4uLmFyZ3MpIH0sXG4gICAgICBjb250ZXh0OiBmdW5jdGlvbiBjb250ZXh0KC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QuY29udGV4dHMucnVuKC4uLmFyZ3MpIH0sXG4gICAgICBpbXBvcnRlcjogZnVuY3Rpb24gaW1wb3J0ZXIodHlwZSwgLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5pbXBvcnRlcnMucnVuKCh0eXBlIHx8IHByb2plY3Qub3B0aW9ucy5pbXBvcnRlciB8fCAnZGlzaycpLCAuLi5hcmdzKSB9LFxuICAgICAgZXhwb3J0ZXI6IGZ1bmN0aW9uIGV4cG9ydGVyKHR5cGUsIC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3QuZXhwb3J0ZXJzLnJ1bigodHlwZSB8fCBwcm9qZWN0Lm9wdGlvbnMuZXhwb3J0ZXIgfHwgJ3NuYXBzaG90JyksIC4uLmFyZ3MpIH0sXG4gICAgICBtb2RlbDogZnVuY3Rpb24gbW9kZWwoLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5tb2RlbHMucnVuKC4uLmFyZ3MpIH0sXG4gICAgICByZW5kZXJlcjogZnVuY3Rpb24gcmVuZGVyZXIoLi4uYXJncykgeyByZXR1cm4gcHJvamVjdC5yZW5kZXJlcnMucnVuKC4uLmFyZ3MpIH0sXG4gICAgICB2aWV3OiBmdW5jdGlvbiB2aWV3KC4uLmFyZ3MpIHsgcmV0dXJuIHByb2plY3Qudmlld3MucnVuKC4uLmFyZ3MpIH1cbiAgICB9XG4gIH1cblxuICBnZXQgYXNzZXRNYW5pZmVzdCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwb3J0ZXJzLnJ1bignYXNzZXRfbWFuaWZlc3QnLCB7XG4gICAgICBwcm9qZWN0OiB0aGlzXG4gICAgfSlcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2YgYWxsIG9mIHRoaXMgcHJvamVjdCdzIGNvbnRlbnQgY29sbGVjdGlvbnMuXG4gICAqL1xuICBnZXQgY29sbGVjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHV0aWwudmFsdWVzKHRoaXMuY29udGVudClcbiAgfVxuXG4gIGdldCBhbGxBc3NldHMgKCkge1xuICAgIHJldHVybiB1dGlsLmZsYXR0ZW4odGhpcy5jb2xsZWN0aW9ucy5tYXAoYyA9PiBjLmFsbCkpXG4gIH1cblxuICBnZXQgYXNzZXRQYXRocyAoKXtcbiAgICByZXR1cm4gdGhpcy5hbGxBc3NldHMubWFwKGEgPT4gYS5wYXRocy5wcm9qZWN0KVxuICB9XG5cbiAgLyoqXG4gICogQWNjZXNzIGEgZG9jdW1lbnQgYnkgdGhlIGRvY3VtZW50IGlkIHNob3J0IGhhbmRcbiAgKlxuICAqIERvY3VtZW50cyBhcmUgdGhlIG1vc3QgaW1wb3J0YW50IHBhcnQgb2YgYSBTa3lwYWdlciBwcm9qZWN0LCBzbyBtYWtlIGl0IGVhc3kgdG8gYWNjZXNzIHRoZW1cbiAgKlxuICAqL1xuICAgYXQgKGRvY3VtZW50SWQpIHtcbiAgICAgcmV0dXJuIHRoaXMuZG9jdW1lbnRzLmF0KGRvY3VtZW50SWQpXG4gICB9XG5cbiAgLyoqXG4gICogVGhpcyBpcyBhIHN5c3RlbSBmb3IgcmVzb2x2aW5nIHBhdGhzIGluIHRoZSBwcm9qZWN0IHRyZWUgdG8gdGhlXG4gICogYXBwcm9wcmlhdGUgaGVscGVyLCBvciByZXNvbHZpbmcgcGF0aHMgdG8gdGhlIGxpbmtzIHRvIHRoZXNlIHBhdGhzXG4gICogaW4gc29tZSBvdGhlciBzeXN0ZW0gKGxpa2UgYSB3ZWIgc2l0ZSlcbiAgKi9cbiAgZ2V0IHJlc29sdmUgKCkge1xuICAgIHJldHVybiB0aGlzLnJlc29sdmVyXG4gIH1cblxuICAvKipcbiAgKiBAYWxpYXMgUHJvamVjdCNyZXNvbHZlXG4gICovXG4gIGdldCByZXNvbHZlciAoKSB7XG4gICAgcmV0dXJuIHJlc29sdmVyLmNhbGwodGhpcylcbiAgfVxuXG4gIC8qKlxuICAqIFVzZSBhIHBsdWdpbiBmcm9tIHRoZSBwbHVnaW5zIHJlZ2lzdHJ5XG4gICpcbiAgKi9cbiAgdXNlICguLi5wbHVnaW5zKSB7XG4gICAgdGhpcy5lbmFibGVkUGx1Z2lucy5jb25jYXQocGx1Z2lucy5tYXAocGx1Z2luID0+IHtcbiAgICAgIGxldCBwbHVnaW5Db25maWcgPSB0aGlzLnBsdWdpbnMubG9va3VwKHBsdWdpbilcblxuICAgICAgaWYgKHBsdWdpbkNvbmZpZyAmJiBwbHVnaW5Db25maWcuYXBpICYmIHBsdWdpbkNvbmZpZy5hcGkubW9kaWZ5KSB7XG4gICAgICAgIHBsdWdpbkNvbmZpZy5hcGkubW9kaWZ5KHRoaXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHBsdWdpbkNvbmZpZy5hcGkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBwbHVnaW5Db25maWcuYXBpLmNhbGwodGhpcywgdGhpcywgcGx1Z2luQ29uZmlnKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwbHVnaW5cbiAgICB9KSlcbiAgfVxuXG4gIC8qXG4gICogQWxpYXNlcyB0byBjcmVhdGUgaGlkZGVuIGFuZCBsYXp5IGdldHRlcnMgb24gdGhlIHByb2plY3RcbiAgKi9cbiAgaGlkZGVuICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmhpZGRlbi5nZXR0ZXIodGhpcywgLi4uYXJncykgfVxuICBsYXp5ICguLi5hcmdzKSB7IHJldHVybiB1dGlsLmxhenkodGhpcywgLi4uYXJncykgfVxuXG4gIC8qKlxuICAgKiBidWlsZCBhIHBhdGggZnJvbSBhIGJhc2UgKGUuZy4gZG9jdW1lbnRzLCBtb2RlbHMsIGJ1aWxkKVxuICAgKiB1c2luZyBwYXRoLmpvaW5cbiAgICovXG4gIHBhdGggKGJhc2UsIC4uLnJlc3QpIHtcbiAgICByZXR1cm4gam9pbih0aGlzLnBhdGhzW2Jhc2VdLCAuLi5yZXN0KVxuICB9XG5cbiAgLyoqXG4gICogQ29sbGVjdGlvbiBBY2Nlc3NvciBNZXRob2RzXG4gICpcbiAgKiBUaGVzZSBjYW4gYmUgdXNlZCB0byBhY2Nlc3MgZG9jdW1lbnQgY29sbGVjdGlvbnMgd2l0aGluIHRoZSBwcm9qZWN0XG4gICovXG4gIGdldCBkb2NzICgpIHtcbiAgICByZXR1cm4gdGhpcy5kb2N1bWVudHNcbiAgfVxuXG4gIGdldCBkb2N1bWVudHMgKCkge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQuZG9jdW1lbnRzXG4gIH1cblxuICBnZXQgZGF0YV9zb3VyY2VzICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZW50LmRhdGFfc291cmNlc1xuICB9XG5cbiAgZ2V0IGRhdGFfc291cmNlcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudC5kYXRhX3NvdXJjZXNcbiAgfVxuXG4gIGdldCBjb2xsZWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHV0aWwudmFsdWVzKHRoaXMuY29udGVudClcbiAgfVxuXG4gIGdldCBhY3Rpb25zICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmFjdGlvbnNcbiAgfVxuXG4gIGdldCBjb250ZXh0cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5jb250ZXh0c1xuICB9XG5cbiAgZ2V0IGV4cG9ydGVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5leHBvcnRlcnNcbiAgfVxuXG4gIGdldCBpbXBvcnRlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuaW1wb3J0ZXJzXG4gIH1cblxuICBnZXQgcGx1Z2lucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5wbHVnaW5zXG4gIH1cblxuICBnZXQgbW9kZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLm1vZGVsc1xuICB9XG5cbiAgZ2V0IHN0b3JlcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5zdG9yZXNcbiAgfVxuXG4gIGdldCByZW5kZXJlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMucmVuZGVyZXJzXG4gIH1cblxuICBnZXQgdmlld3MgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMudmlld3NcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2plY3RcblxuZnVuY3Rpb24gcGF0aHMgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcblxuICBsZXQgY29udmVudGlvbmFsID0ge1xuICAgIGFzc2V0czogam9pbih0aGlzLnJvb3QsICdhc3NldHMnKSxcbiAgICBhY3Rpb25zOiBqb2luKHRoaXMucm9vdCwgJ2FjdGlvbnMnKSxcbiAgICBjb250ZXh0czogam9pbih0aGlzLnJvb3QsICdjb250ZXh0cycpLFxuICAgIGRhdGFfc291cmNlczogam9pbih0aGlzLnJvb3QsICdkYXRhJyksXG4gICAgZG9jdW1lbnRzOiBqb2luKHRoaXMucm9vdCwgJ2RvY3MnKSxcbiAgICBleHBvcnRlcnM6IGpvaW4odGhpcy5yb290LCAnZXhwb3J0ZXJzJyksXG4gICAgaW1wb3J0ZXJzOiBqb2luKHRoaXMucm9vdCwgJ2ltcG9ydGVycycpLFxuICAgIG1vZGVsczogam9pbih0aGlzLnJvb3QsICdtb2RlbHMnKSxcbiAgICBwbHVnaW5zOiBqb2luKHRoaXMucm9vdCwgJ3BsdWdpbnMnKSxcbiAgICByZW5kZXJlcnM6IGpvaW4odGhpcy5yb290LCAncmVuZGVyZXJzJyksXG4gICAgdmVjdG9yczogam9pbih0aGlzLnJvb3QsICdhc3NldHMnKSxcbiAgICBpbWFnZXM6IGpvaW4odGhpcy5yb290LCAnYXNzZXRzJyksXG4gICAgc2NyaXB0czogam9pbih0aGlzLnJvb3QsICdhc3NldHMnKSxcbiAgICBzdHlsZXNoZWV0czogam9pbih0aGlzLnJvb3QsICdhc3NldHMnKSxcbiAgICBtYW5pZmVzdDogam9pbih0aGlzLnJvb3QsICdwYWNrYWdlLmpzb24nKSxcbiAgICBjYWNoZTogam9pbih0aGlzLnJvb3QsICd0bXAnLCAnY2FjaGUnKSxcbiAgICBsb2dzOiBqb2luKHRoaXMucm9vdCwgJ2xvZycpLFxuICAgIGJ1aWxkOiBqb2luKHRoaXMucm9vdCwgJ2Rpc3QnKVxuICB9XG5cbiAgbGV0IGN1c3RvbSA9IHByb2plY3Qub3B0aW9ucy5wYXRocyB8fCBwcm9qZWN0Lm1hbmlmZXN0LnBhdGhzIHx8IHt9XG5cbiAgcmV0dXJuIHV0aWwuYXNzaWduKGNvbnZlbnRpb25hbCwgY3VzdG9tKVxufVxuXG5mdW5jdGlvbiBjb250ZW50ICgpIHtcbiAgbGV0IHByb2plY3QgPSB0aGlzXG4gIGxldCBjb2xsZWN0aW9ucyA9IGJ1aWxkQ29udGVudENvbGxlY3Rpb25zTWFudWFsbHkuY2FsbChwcm9qZWN0KVxuXG4gIHJldHVybiBjb2xsZWN0aW9uc1xufVxuXG5mdW5jdGlvbiBydW5JbXBvcnRlciAob3B0aW9ucyA9IHt9KSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuICBsZXQgY29sbGVjdGlvbnMgPSBwcm9qZWN0LmNvbGxlY3Rpb25zXG4gIGxldCB7IGF1dG9Mb2FkLCBpbXBvcnRlciB9ID0gb3B0aW9uc1xuXG4gIGRlYnVnKCdpbXBvcnQgc3RhcnRpbmcnKVxuICBsZXQgcmVzdWx0ID0gcHJvamVjdC5pbXBvcnRlcnMucnVuKGltcG9ydGVyIHx8ICdkaXNrJywgeyBwcm9qZWN0OiB0aGlzLCBjb2xsZWN0aW9uczogdGhpcy5jb250ZW50LCBhdXRvTG9hZCB9KVxuICBkZWJ1ZygnaW1wb3J0IGZpbmlzaGluZycpXG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiBidWlsZENvbnRlbnRDb2xsZWN0aW9uc01hbnVhbGx5ICgpIHtcbiAgY29uc3QgcHJvamVjdCA9IHRoaXNcbiAgY29uc3QgcGF0aHMgPSBwcm9qZWN0LnBhdGhzXG5cbiAgbGV0IHsgQXNzZXQsIERhdGFTb3VyY2UsIERvY3VtZW50LCBJbWFnZSwgU2NyaXB0LCBTdHlsZXNoZWV0LCBWZWN0b3IgfSA9IEFzc2V0c1xuXG4gIHJldHVybiB7XG4gICAgYXNzZXRzOiBBc3NldC5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBkYXRhX3NvdXJjZXM6IERhdGFTb3VyY2UuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSksXG4gICAgZG9jdW1lbnRzOiBEb2N1bWVudC5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBpbWFnZXM6IEltYWdlLmNyZWF0ZUNvbGxlY3Rpb24odGhpcywgZmFsc2UpLFxuICAgIHNjcmlwdHM6IFNjcmlwdC5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICBzdHlsZXNoZWV0czogU3R5bGVzaGVldC5jcmVhdGVDb2xsZWN0aW9uKHRoaXMsIGZhbHNlKSxcbiAgICB2ZWN0b3JzOiBWZWN0b3IuY3JlYXRlQ29sbGVjdGlvbih0aGlzLCBmYWxzZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBzdG9yZXMgKCkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcbn1cblxuZnVuY3Rpb24gcmVnaXN0cmllcyAoKSB7XG4gIGxldCBwcm9qZWN0ID0gdGhpc1xuICBsZXQgcm9vdCA9IHByb2plY3Qucm9vdFxuXG4gIGxldCByZWdpc3RyaWVzID0gUmVnaXN0cnkuYnVpbGRBbGwocHJvamVjdCwgSGVscGVycywge3Jvb3R9KVxuXG4gIHByb2plY3QucnVuSG9vaygncmVnaXN0cmllc0RpZExvYWQnKVxuXG4gIHJldHVybiByZWdpc3RyaWVzXG59XG5cbmZ1bmN0aW9uIGVudGl0aWVzKCkge1xuICBsZXQgbW9kZWxOYW1lcyA9IFsnb3V0bGluZScsJ3BhZ2UnXS5jb25jYXQodGhpcy5tb2RlbHMuYXZhaWxhYmxlKVxuXG4gIHJldHVybiBtb2RlbE5hbWVzLnJlZHVjZSgobWVtbyxpZCkgPT4ge1xuICAgIGxldCBtb2RlbCA9IHRoaXMubW9kZWxzLmxvb2t1cChpZClcbiAgICBsZXQgZW50aXRpZXMgPSBtb2RlbC5lbnRpdGllcyA9IG1vZGVsLmVudGl0aWVzIHx8IHt9XG5cbiAgICBPYmplY3QuYXNzaWduKG1lbW8sIHtcbiAgICAgIGdldCBbdXRpbC50YWJlbGl6ZSh1dGlsLnVuZGVyc2NvcmUobW9kZWwubmFtZSkpXSgpe1xuICAgICAgICByZXR1cm4gZW50aXRpZXNcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIG1lbW9cbiAgfSwge30pXG59XG5cbmZ1bmN0aW9uIHNldHVwSG9va3MoaG9va3MgPSB7fSkge1xuICBsZXQgcHJvamVjdCA9IHRoaXNcblxuICByZXR1cm4gT2JqZWN0LmtleXMoaG9va3MpLnJlZHVjZSgobWVtbywgaG9vaykgPT4ge1xuICAgIGxldCBmbiA9IGhvb2tzW2hvb2tdXG5cbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtZW1vW2hvb2tdID0gZm4uYmluZChwcm9qZWN0KVxuICAgIH1cblxuICAgIHJldHVybiBtZW1vXG4gIH0sIHt9KVxufVxuIl19