'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); //if (!process.env.SKYPAGER_DIST) { require('./environment')() }

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    var _this = this;

    _classCallCheck(this, Framework);

    this.type = 'framework';
    this.root = __dirname;

    util.hide.getter(this, 'manifest', function () {
      return assign(require(_this.root + '/../package.json'), { root: root });
    });

    var plugins = [];

    this.registries = _registry2.default.buildAll(this, Helpers, { root: root });

    util.hide.getter(this, 'enabledPlugins', function () {
      return plugins;
    });

    if (typeof initializer === 'function') {
      initializer(this);
    }

    require('./environment')(this.root);
  }

  /**
  * Create a project loader for the specified path.
  * Returns a function you can execute when you want the project loaded.
  */

  _createClass(Framework, [{
    key: 'create',
    value: function create(pathToProject) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var skypager = this;

      return function () {
        var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        return new skypager.load(pathToProject, Object.assign(options, opts));
      };
    }

    /**
    * Load a project in the specified path immediately.
    *
    */

  }, {
    key: 'load',
    value: function load(projectFile) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var skypager = this;

      if (ProjectCache.projects[projectFile]) {
        return ProjectCache.projects[projectFile];
      }

      var root = projectFile.match(/.js/i) ? (0, _path.dirname)(projectFile) : projectFile;

      options.manifest = options.manifest || {};
      options.manifest.skypager = options.manifest.skypager || {};

      // get the project manifest, which should include a skypager key
      try {
        Object.assign(options.manifest, require(root + '/package.json'));
      } catch (error) {}

      // allow for skypager.json files
      try {
        Object.assign(options.manifest.skypager, require(root + '/skypager.json'));
      } catch (error) {}

      if (process.env.SKYPAGER_DEBUG) {
        console.log('Loading skypager project file', projectFile, options);
      }

      var project = new this.Project(projectFile, options);

      return ProjectCache.projects[projectFile] = project;
    }
  }, {
    key: 'use',
    value: function use() {
      var _this2 = this;

      for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
        plugins[_key] = arguments[_key];
      }

      this.enabledPlugins.concat(plugins.map(function (plugin) {
        var pluginConfig = _this2.plugins.lookup(plugin);
        pluginConfig.modify(_this2, pluginConfig);
      }));
    }
  }, {
    key: 'additionalPluginConfig',
    get: function get() {}
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

module.exports = Framework;
//# sourceMappingURL=data:application/json;base64,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QzlCOzs7d0JBRWM7QUFDYixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFBO0tBQy9COzs7d0JBRWdCO0FBQ2YsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQTtLQUNqQzs7O3dCQUVXO0FBQ1YsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBeEdHLFNBQVM7OztBQTJHZixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQSIsImZpbGUiOiJmcmFtZXdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL2lmICghcHJvY2Vzcy5lbnYuU0tZUEFHRVJfRElTVCkgeyByZXF1aXJlKCcuL2Vudmlyb25tZW50JykoKSB9XG5cbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vY29sbGVjdGlvbidcbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuL3JlZ2lzdHJ5J1xuaW1wb3J0IFByb2plY3QgZnJvbSAnLi9wcm9qZWN0J1xuXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcbmltcG9ydCAqIGFzIEFzc2V0cyBmcm9tICcuL2Fzc2V0cydcbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuXG5pbXBvcnQgeyBkaXJuYW1lLCByZXNvbHZlLCBqb2luLCBiYXNlbmFtZSwgZXh0bmFtZSB9IGZyb20gJ3BhdGgnXG5cbnJlcXVpcmUoJy4vcG9seWZpbGwnKVxucmVxdWlyZSgnc2hvdWxkJylcblxuLy8gdGVtcFxuZGVsZXRlIChBc3NldHMuZGVmYXVsdClcbmRlbGV0ZSAoSGVscGVycy5kZWZhdWx0KVxuZGVsZXRlIChQcm9qZWN0LmRlZmF1bHQpXG5cbmNvbnN0IFByb2plY3RDYWNoZSA9IHtcbiAgcHJvamVjdHM6IHsgIH1cbn1cblxuY2xhc3MgRnJhbWV3b3JrIHtcbiAgY29uc3RydWN0b3IgKHJvb3QsIGluaXRpYWxpemVyKSB7XG4gICAgdGhpcy50eXBlID0gJ2ZyYW1ld29yaydcbiAgICB0aGlzLnJvb3QgPSBfX2Rpcm5hbWVcblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ21hbmlmZXN0JywgKCkgPT4gYXNzaWduKHJlcXVpcmUodGhpcy5yb290ICsgJy8uLi9wYWNrYWdlLmpzb24nKSwge3Jvb3R9KSlcblxuICAgIGNvbnN0IHBsdWdpbnMgPSBbIF1cblxuICAgIHRoaXMucmVnaXN0cmllcyA9IFJlZ2lzdHJ5LmJ1aWxkQWxsKHRoaXMsIEhlbHBlcnMsIHtyb290fSlcblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2VuYWJsZWRQbHVnaW5zJywgKCkgPT4gcGx1Z2lucylcblxuICAgIGlmICh0eXBlb2YgKGluaXRpYWxpemVyKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaW5pdGlhbGl6ZXIodGhpcylcbiAgICB9XG5cbiAgICByZXF1aXJlKCcuL2Vudmlyb25tZW50JykodGhpcy5yb290KVxuICB9XG5cbiAgLyoqXG4gICogQ3JlYXRlIGEgcHJvamVjdCBsb2FkZXIgZm9yIHRoZSBzcGVjaWZpZWQgcGF0aC5cbiAgKiBSZXR1cm5zIGEgZnVuY3Rpb24geW91IGNhbiBleGVjdXRlIHdoZW4geW91IHdhbnQgdGhlIHByb2plY3QgbG9hZGVkLlxuICAqL1xuICBjcmVhdGUgKHBhdGhUb1Byb2plY3QsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBza3lwYWdlciA9IHRoaXNcblxuICAgIHJldHVybiBmdW5jdGlvbihvcHRzID0ge30pIHtcbiAgICAgIHJldHVybiBuZXcgc2t5cGFnZXIubG9hZChwYXRoVG9Qcm9qZWN0LCBPYmplY3QuYXNzaWduKG9wdGlvbnMsIG9wdHMpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIExvYWQgYSBwcm9qZWN0IGluIHRoZSBzcGVjaWZpZWQgcGF0aCBpbW1lZGlhdGVseS5cbiAgKlxuICAqL1xuICBsb2FkIChwcm9qZWN0RmlsZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHNreXBhZ2VyID0gdGhpc1xuXG4gICAgaWYgKFByb2plY3RDYWNoZS5wcm9qZWN0c1twcm9qZWN0RmlsZV0pIHtcbiAgICAgICByZXR1cm4gUHJvamVjdENhY2hlLnByb2plY3RzW3Byb2plY3RGaWxlXVxuICAgIH1cblxuICAgIGxldCByb290ID0gcHJvamVjdEZpbGUubWF0Y2goLy5qcy9pKSA/IGRpcm5hbWUocHJvamVjdEZpbGUpIDogcHJvamVjdEZpbGVcblxuICAgIG9wdGlvbnMubWFuaWZlc3QgPSBvcHRpb25zLm1hbmlmZXN0IHx8IHt9XG4gICAgb3B0aW9ucy5tYW5pZmVzdC5za3lwYWdlciA9IG9wdGlvbnMubWFuaWZlc3Quc2t5cGFnZXIgfHwge31cblxuICAgIC8vIGdldCB0aGUgcHJvamVjdCBtYW5pZmVzdCwgd2hpY2ggc2hvdWxkIGluY2x1ZGUgYSBza3lwYWdlciBrZXlcbiAgICB0cnkgeyBPYmplY3QuYXNzaWduKG9wdGlvbnMubWFuaWZlc3QsIHJlcXVpcmUocm9vdCArICcvcGFja2FnZS5qc29uJykpIH0gY2F0Y2ggKGVycm9yKSB7IH1cblxuICAgIC8vIGFsbG93IGZvciBza3lwYWdlci5qc29uIGZpbGVzXG4gICAgdHJ5IHsgT2JqZWN0LmFzc2lnbihvcHRpb25zLm1hbmlmZXN0LnNreXBhZ2VyLCByZXF1aXJlKHJvb3QgKyAnL3NreXBhZ2VyLmpzb24nKSkgfSBjYXRjaCAoZXJyb3IpIHsgfVxuXG4gICAgaWYgKHByb2Nlc3MuZW52LlNLWVBBR0VSX0RFQlVHKSB7XG4gICAgICBjb25zb2xlLmxvZygnTG9hZGluZyBza3lwYWdlciBwcm9qZWN0IGZpbGUnLCBwcm9qZWN0RmlsZSwgb3B0aW9ucylcbiAgICB9XG5cbiAgICBsZXQgcHJvamVjdCA9IChuZXcgdGhpcy5Qcm9qZWN0KHByb2plY3RGaWxlLCBvcHRpb25zKSlcblxuICAgIHJldHVybiBQcm9qZWN0Q2FjaGUucHJvamVjdHNbcHJvamVjdEZpbGVdID0gcHJvamVjdFxuICB9XG5cbiAgdXNlICguLi5wbHVnaW5zKSB7XG4gICAgdGhpcy5lbmFibGVkUGx1Z2lucy5jb25jYXQocGx1Z2lucy5tYXAocGx1Z2luID0+IHtcbiAgICAgIGxldCBwbHVnaW5Db25maWcgPSB0aGlzLnBsdWdpbnMubG9va3VwKHBsdWdpbilcbiAgICAgIHBsdWdpbkNvbmZpZy5tb2RpZnkodGhpcywgcGx1Z2luQ29uZmlnKVxuICAgIH0pKVxuICB9XG5cbiAgZ2V0IGFkZGl0aW9uYWxQbHVnaW5Db25maWcgKCkge1xuXG4gIH1cblxuICBnZXQgYWN0aW9ucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5hY3Rpb25zXG4gIH1cblxuICBnZXQgY29udGV4dHMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuY29udGV4dHNcbiAgfVxuXG4gIGdldCBleHBvcnRlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuZXhwb3J0ZXJzXG4gIH1cblxuICBnZXQgaW1wb3J0ZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmltcG9ydGVyc1xuICB9XG5cbiAgZ2V0IG1vZGVscyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5tb2RlbHNcbiAgfVxuXG4gIGdldCBwbHVnaW5zICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnBsdWdpbnNcbiAgfVxuXG4gIGdldCByZW5kZXJlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMucmVuZGVyZXJzXG4gIH1cblxuICBnZXQgdXRpbCAoKSB7XG4gICAgcmV0dXJuIHV0aWxcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZyYW1ld29ya1xuIl19