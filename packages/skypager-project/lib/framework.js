'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _collection = require('./collection');

var _collection2 = _interopRequireDefault(_collection);

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

var _project = require('./project');

var _project2 = _interopRequireDefault(_project);

var _util = require('./util');

var util = _interopRequireWildcard(_util);

var _assets = require('./assets');

var Assets = _interopRequireWildcard(_assets);

var _helpers = require('./helpers');

var Helpers = _interopRequireWildcard(_helpers);

var _path = require('path');

var _defaultsDeep = require('lodash/defaultsDeep');

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//if (!process.env.SKYPAGER_DIST) { require('./environment')() }

require('./polyfill');
require('should');

// temp
delete Assets.default;
delete Helpers.default;
delete _project2.default.default;

var ProjectCache = {
  projects: {}
};

var Framework = (function () {
  function Framework(root, initializer) {
    (0, _classCallCheck3.default)(this, Framework);

    this.type = 'framework';
    this.root = __dirname;

    util.hide.getter(this, 'manifest', require('../package.json'));

    var plugins = [];

    this.registries = _registry2.default.buildAll(this, Helpers, { root: root });

    util.hide.getter(this, 'enabledPlugins', function () {
      return plugins;
    });

    try {
      var projectManifest;

      try {
        projectManifest = require((0, _path.join)(process.env.PWD, 'package.json'));
      } catch (e2) {}

      if (projectManifest && projectManifest.skypager && projectManifest.skypager.plugins) {
        eagerLoadProjectPlugins(this, projectManifest.skypager.plugins);
      }
    } catch (e) {
      console.log('Tried to eager load project plugins and failed', projectManifest.skypager.plugins);
    }

    if (typeof initializer === 'function') {
      initializer(this);
    }

    //require('./environment')(this.root)
  }

  /**
  * Create a project loader for the specified path.
  * Returns a function you can execute when you want the project loaded.
  */

  (0, _createClass3.default)(Framework, [{
    key: 'create',
    value: function create(pathToProject) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var skypager = this;

      return function () {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        return new skypager.load(pathToProject, (0, _assign2.default)(options, opts));
      };
    }

    /**
    * Load a project in the specified path immediately.
    *
    */

  }, {
    key: 'load',
    value: function load() {
      var projectFile = arguments.length <= 0 || arguments[0] === undefined ? process.env.PWD : arguments[0];
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var skypager = this;

      if ((typeof projectFile === 'undefined' ? 'undefined' : (0, _typeof3.default)(projectFile)) === 'object') {
        if (isEmpty(options)) {
          options = projectFile;
        }

        projectFile = options.root || process.env.PWD;
      }

      if (ProjectCache.projects[projectFile]) {
        return ProjectCache.projects[projectFile];
      }

      var root = projectFile;

      if (projectFile.match(/\.(js|json)$/i)) {
        root = (0, _path.dirname)(projectFile);
      }

      if (!options.manifest) {
        try {
          options.manifest = require((0, _path.join)(root, 'package.json'));
        } catch (error) {
          console.log('Error loading manifest', error.message, (0, _path.join)(root, 'package.json'));
        }
      }

      (0, _defaultsDeep2.default)(options, {
        manifest: {
          skypager: {
            plugins: []
          }
        }
      });

      var project = new this.Project(projectFile, options);

      return ProjectCache.projects[projectFile] = project;
    }
  }, {
    key: 'use',
    value: function use(plugins) {
      var _this = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (typeof plugins === 'string') {
        plugins = [plugins];
      }

      plugins.forEach(function (plugin) {
        var pluginConfig = _this.plugins.lookup(plugin);

        if (pluginConfig && pluginConfig.api && pluginConfig.api.modify) {
          pluginConfig.api.modify(_this);
        } else {
          if (typeof pluginConfig.api === 'function') {
            pluginConfig.api.call(_this, _this, pluginConfig);
          }
        }

        _this.enabledPlugins.push(plugin);
      });
    }
  }, {
    key: 'loadPlugin',
    value: function loadPlugin(request) {
      var loader = undefined;

      if (typeof request === 'string') {
        try {
          loader = require(request);
        } catch (e) {
          console.log('Error loading plugin at ' + request + ': ' + e.message);

          try {
            loader = require('skypager-plugin-' + request);
          } catch (e2) {
            console.log('Retried using skypager-plugin-' + request + ': ' + e2.message);
          }
        }

        if (loader) {
          request = loader;
        }
      }

      this.plugins.runLoader(request);
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
    key: 'models',
    get: function get() {
      return this.registries.models;
    }
  }, {
    key: 'plugins',
    get: function get() {
      return this.registries.plugins;
    }
  }, {
    key: 'renderers',
    get: function get() {
      return this.registries.renderers;
    }
  }, {
    key: 'util',
    get: function get() {
      return util;
    }
  }]);
  return Framework;
})();

function eagerLoadProjectPlugins(skypager, list) {
  list.filter(function (item) {
    return item && typeof item === 'string';
  }).filter(function (item) {
    return !item.match(/skypager-plugin-/);
  }).forEach(function (plugin) {
    try {
      skypager.loadPlugin(require('skypager-plugin-' + plugin));
    } catch (error) {}
  });
}
module.exports = Framework;