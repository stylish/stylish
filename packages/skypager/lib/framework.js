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
    value: function use(plugins) {
      var _this2 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (typeof plugins === 'string') {
        plugins = [plugins];
      }

      plugins.forEach(function (plugin) {
        var pluginConfig = _this2.plugins.lookup(plugin);

        if (pluginConfig && pluginConfig.api && pluginConfig.api.modify) {
          pluginConfig.api.modify(_this2);
        } else {
          if (typeof pluginConfig.api === 'function') {
            pluginConfig.api.call(_this2, _this2, pluginConfig);
          }
        }

        _this2.enabledPlugins.push(plugin);
      });
    }
  }, {
    key: 'loadPlugin',
    value: function loadPlugin(requirePath) {
      this.plugins.runLoader(require(requirePath));
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

module.exports = Framework;
//# sourceMappingURL=data:application/json;base64,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QUE7S0FDSDs7OytCQUVVLFdBQVcsRUFBRTtBQUN0QixVQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtLQUM3Qzs7O3dCQUVjO0FBQ2IsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQTtLQUMvQjs7O3dCQUVlO0FBQ2QsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQTtLQUNoQzs7O3dCQUVnQjtBQUNmLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUE7S0FDakM7Ozt3QkFFZ0I7QUFDZixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFBO0tBQ2pDOzs7d0JBRWE7QUFDWixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFBO0tBQzlCOzs7d0JBRWM7QUFDYixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFBO0tBQy9COzs7d0JBRWdCO0FBQ2YsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQTtLQUNqQzs7O3dCQUVXO0FBQ1YsYUFBTyxJQUFJLENBQUE7S0FDWjs7O1NBckhHLFNBQVM7OztBQXdIZixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQSIsImZpbGUiOiJmcmFtZXdvcmsuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL2lmICghcHJvY2Vzcy5lbnYuU0tZUEFHRVJfRElTVCkgeyByZXF1aXJlKCcuL2Vudmlyb25tZW50JykoKSB9XG5cbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vY29sbGVjdGlvbidcbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuL3JlZ2lzdHJ5J1xuaW1wb3J0IFByb2plY3QgZnJvbSAnLi9wcm9qZWN0J1xuXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcbmltcG9ydCAqIGFzIEFzc2V0cyBmcm9tICcuL2Fzc2V0cydcbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuXG5pbXBvcnQgeyBkaXJuYW1lLCByZXNvbHZlLCBqb2luLCBiYXNlbmFtZSwgZXh0bmFtZSB9IGZyb20gJ3BhdGgnXG5cbnJlcXVpcmUoJy4vcG9seWZpbGwnKVxucmVxdWlyZSgnc2hvdWxkJylcblxuLy8gdGVtcFxuZGVsZXRlIChBc3NldHMuZGVmYXVsdClcbmRlbGV0ZSAoSGVscGVycy5kZWZhdWx0KVxuZGVsZXRlIChQcm9qZWN0LmRlZmF1bHQpXG5cbmNvbnN0IFByb2plY3RDYWNoZSA9IHtcbiAgcHJvamVjdHM6IHsgIH1cbn1cblxuY2xhc3MgRnJhbWV3b3JrIHtcbiAgY29uc3RydWN0b3IgKHJvb3QsIGluaXRpYWxpemVyKSB7XG4gICAgdGhpcy50eXBlID0gJ2ZyYW1ld29yaydcbiAgICB0aGlzLnJvb3QgPSBfX2Rpcm5hbWVcblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ21hbmlmZXN0JywgKCkgPT4gYXNzaWduKHJlcXVpcmUodGhpcy5yb290ICsgJy8uLi9wYWNrYWdlLmpzb24nKSwge3Jvb3R9KSlcblxuICAgIGNvbnN0IHBsdWdpbnMgPSBbIF1cblxuICAgIHRoaXMucmVnaXN0cmllcyA9IFJlZ2lzdHJ5LmJ1aWxkQWxsKHRoaXMsIEhlbHBlcnMsIHtyb290fSlcblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2VuYWJsZWRQbHVnaW5zJywgKCkgPT4gcGx1Z2lucylcblxuICAgIGlmICh0eXBlb2YgKGluaXRpYWxpemVyKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaW5pdGlhbGl6ZXIodGhpcylcbiAgICB9XG5cbiAgICByZXF1aXJlKCcuL2Vudmlyb25tZW50JykodGhpcy5yb290KVxuICB9XG5cbiAgLyoqXG4gICogQ3JlYXRlIGEgcHJvamVjdCBsb2FkZXIgZm9yIHRoZSBzcGVjaWZpZWQgcGF0aC5cbiAgKiBSZXR1cm5zIGEgZnVuY3Rpb24geW91IGNhbiBleGVjdXRlIHdoZW4geW91IHdhbnQgdGhlIHByb2plY3QgbG9hZGVkLlxuICAqL1xuICBjcmVhdGUgKHBhdGhUb1Byb2plY3QsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBza3lwYWdlciA9IHRoaXNcblxuICAgIHJldHVybiBmdW5jdGlvbihvcHRzID0ge30pIHtcbiAgICAgIHJldHVybiBuZXcgc2t5cGFnZXIubG9hZChwYXRoVG9Qcm9qZWN0LCBPYmplY3QuYXNzaWduKG9wdGlvbnMsIG9wdHMpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIExvYWQgYSBwcm9qZWN0IGluIHRoZSBzcGVjaWZpZWQgcGF0aCBpbW1lZGlhdGVseS5cbiAgKlxuICAqL1xuICBsb2FkIChwcm9qZWN0RmlsZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHNreXBhZ2VyID0gdGhpc1xuXG4gICAgaWYgKFByb2plY3RDYWNoZS5wcm9qZWN0c1twcm9qZWN0RmlsZV0pIHtcbiAgICAgICByZXR1cm4gUHJvamVjdENhY2hlLnByb2plY3RzW3Byb2plY3RGaWxlXVxuICAgIH1cblxuICAgIGxldCByb290ID0gcHJvamVjdEZpbGUubWF0Y2goLy5qcy9pKSA/IGRpcm5hbWUocHJvamVjdEZpbGUpIDogcHJvamVjdEZpbGVcblxuICAgIG9wdGlvbnMubWFuaWZlc3QgPSBvcHRpb25zLm1hbmlmZXN0IHx8IHt9XG4gICAgb3B0aW9ucy5tYW5pZmVzdC5za3lwYWdlciA9IG9wdGlvbnMubWFuaWZlc3Quc2t5cGFnZXIgfHwge31cblxuICAgIC8vIGdldCB0aGUgcHJvamVjdCBtYW5pZmVzdCwgd2hpY2ggc2hvdWxkIGluY2x1ZGUgYSBza3lwYWdlciBrZXlcbiAgICB0cnkgeyBPYmplY3QuYXNzaWduKG9wdGlvbnMubWFuaWZlc3QsIHJlcXVpcmUocm9vdCArICcvcGFja2FnZS5qc29uJykpIH0gY2F0Y2ggKGVycm9yKSB7IH1cblxuICAgIC8vIGFsbG93IGZvciBza3lwYWdlci5qc29uIGZpbGVzXG4gICAgdHJ5IHsgT2JqZWN0LmFzc2lnbihvcHRpb25zLm1hbmlmZXN0LnNreXBhZ2VyLCByZXF1aXJlKHJvb3QgKyAnL3NreXBhZ2VyLmpzb24nKSkgfSBjYXRjaCAoZXJyb3IpIHsgfVxuXG4gICAgaWYgKHByb2Nlc3MuZW52LlNLWVBBR0VSX0RFQlVHKSB7XG4gICAgICBjb25zb2xlLmxvZygnTG9hZGluZyBza3lwYWdlciBwcm9qZWN0IGZpbGUnLCBwcm9qZWN0RmlsZSwgb3B0aW9ucylcbiAgICB9XG5cbiAgICBsZXQgcHJvamVjdCA9IChuZXcgdGhpcy5Qcm9qZWN0KHByb2plY3RGaWxlLCBvcHRpb25zKSlcblxuICAgIHJldHVybiBQcm9qZWN0Q2FjaGUucHJvamVjdHNbcHJvamVjdEZpbGVdID0gcHJvamVjdFxuICB9XG5cbiAgdXNlIChwbHVnaW5zLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAodHlwZW9mIHBsdWdpbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwbHVnaW5zID0gW3BsdWdpbnNdXG4gICAgfVxuXG4gICAgcGx1Z2lucy5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgICBsZXQgcGx1Z2luQ29uZmlnID0gdGhpcy5wbHVnaW5zLmxvb2t1cChwbHVnaW4pXG5cbiAgICAgIGlmIChwbHVnaW5Db25maWcgJiYgcGx1Z2luQ29uZmlnLmFwaSAmJiBwbHVnaW5Db25maWcuYXBpLm1vZGlmeSkge1xuICAgICAgICBwbHVnaW5Db25maWcuYXBpLm1vZGlmeSh0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwbHVnaW5Db25maWcuYXBpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcGx1Z2luQ29uZmlnLmFwaS5jYWxsKHRoaXMsIHRoaXMsIHBsdWdpbkNvbmZpZylcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmVuYWJsZWRQbHVnaW5zLnB1c2gocGx1Z2luKVxuICAgIH0pXG4gIH1cblxuICBsb2FkUGx1Z2luKHJlcXVpcmVQYXRoKSB7XG4gICAgdGhpcy5wbHVnaW5zLnJ1bkxvYWRlcihyZXF1aXJlKHJlcXVpcmVQYXRoKSlcbiAgfVxuXG4gIGdldCBhY3Rpb25zICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmFjdGlvbnNcbiAgfVxuXG4gIGdldCBjb250ZXh0cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5jb250ZXh0c1xuICB9XG5cbiAgZ2V0IGV4cG9ydGVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5leHBvcnRlcnNcbiAgfVxuXG4gIGdldCBpbXBvcnRlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuaW1wb3J0ZXJzXG4gIH1cblxuICBnZXQgbW9kZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLm1vZGVsc1xuICB9XG5cbiAgZ2V0IHBsdWdpbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMucGx1Z2luc1xuICB9XG5cbiAgZ2V0IHJlbmRlcmVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5yZW5kZXJlcnNcbiAgfVxuXG4gIGdldCB1dGlsICgpIHtcbiAgICByZXR1cm4gdXRpbFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRnJhbWV3b3JrXG4iXX0=