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

      // get the project manifest, which should include a skypager key
      try {
        options.manifest = options.manifest || Object.assign(options.manifest, require(root + '/package.json'));
      } catch (error) {}

      options.manifest = options.manifest || {};
      options.manifest.skypager = options.manifest.skypager || {};

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
//# sourceMappingURL=data:application/json;base64,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QUFDZixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFBO0tBQ2pDOzs7d0JBRWdCO0FBQ2YsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQTtLQUNqQzs7O3dCQUVhO0FBQ1osYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQTtLQUM5Qjs7O3dCQUVjO0FBQ2IsYUFBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQTtLQUMvQjs7O3dCQUVnQjtBQUNmLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUE7S0FDakM7Ozt3QkFFVztBQUNWLGFBQU8sSUFBSSxDQUFBO0tBQ1o7OztTQTlHRyxTQUFTOzs7QUFpSGYsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUEiLCJmaWxlIjoiZnJhbWV3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9pZiAoIXByb2Nlc3MuZW52LlNLWVBBR0VSX0RJU1QpIHsgcmVxdWlyZSgnLi9lbnZpcm9ubWVudCcpKCkgfVxuXG5pbXBvcnQgQ29sbGVjdGlvbiBmcm9tICcuL2NvbGxlY3Rpb24nXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi9yZWdpc3RyeSdcbmltcG9ydCBQcm9qZWN0IGZyb20gJy4vcHJvamVjdCdcblxuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuL3V0aWwnXG5pbXBvcnQgKiBhcyBBc3NldHMgZnJvbSAnLi9hc3NldHMnXG5pbXBvcnQgKiBhcyBIZWxwZXJzIGZyb20gJy4vaGVscGVycydcblxuaW1wb3J0IHsgZGlybmFtZSwgcmVzb2x2ZSwgam9pbiwgYmFzZW5hbWUsIGV4dG5hbWUgfSBmcm9tICdwYXRoJ1xuXG5yZXF1aXJlKCcuL3BvbHlmaWxsJylcbnJlcXVpcmUoJ3Nob3VsZCcpXG5cbi8vIHRlbXBcbmRlbGV0ZSAoQXNzZXRzLmRlZmF1bHQpXG5kZWxldGUgKEhlbHBlcnMuZGVmYXVsdClcbmRlbGV0ZSAoUHJvamVjdC5kZWZhdWx0KVxuXG5jb25zdCBQcm9qZWN0Q2FjaGUgPSB7XG4gIHByb2plY3RzOiB7ICB9XG59XG5cbmNsYXNzIEZyYW1ld29yayB7XG4gIGNvbnN0cnVjdG9yIChyb290LCBpbml0aWFsaXplcikge1xuICAgIHRoaXMudHlwZSA9ICdmcmFtZXdvcmsnXG4gICAgdGhpcy5yb290ID0gX19kaXJuYW1lXG5cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdtYW5pZmVzdCcsICgpID0+IGFzc2lnbihyZXF1aXJlKHRoaXMucm9vdCArICcvLi4vcGFja2FnZS5qc29uJyksIHtyb290fSkpXG5cbiAgICBjb25zdCBwbHVnaW5zID0gWyBdXG5cbiAgICB0aGlzLnJlZ2lzdHJpZXMgPSBSZWdpc3RyeS5idWlsZEFsbCh0aGlzLCBIZWxwZXJzLCB7cm9vdH0pXG5cbiAgICB1dGlsLmhpZGUuZ2V0dGVyKHRoaXMsICdlbmFibGVkUGx1Z2lucycsICgpID0+IHBsdWdpbnMpXG5cbiAgICBpZiAodHlwZW9mIChpbml0aWFsaXplcikgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGluaXRpYWxpemVyKHRoaXMpXG4gICAgfVxuXG4gICAgcmVxdWlyZSgnLi9lbnZpcm9ubWVudCcpKHRoaXMucm9vdClcbiAgfVxuXG4gIC8qKlxuICAqIENyZWF0ZSBhIHByb2plY3QgbG9hZGVyIGZvciB0aGUgc3BlY2lmaWVkIHBhdGguXG4gICogUmV0dXJucyBhIGZ1bmN0aW9uIHlvdSBjYW4gZXhlY3V0ZSB3aGVuIHlvdSB3YW50IHRoZSBwcm9qZWN0IGxvYWRlZC5cbiAgKi9cbiAgY3JlYXRlIChwYXRoVG9Qcm9qZWN0LCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgc2t5cGFnZXIgPSB0aGlzXG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob3B0cyA9IHt9KSB7XG4gICAgICByZXR1cm4gbmV3IHNreXBhZ2VyLmxvYWQocGF0aFRvUHJvamVjdCwgT2JqZWN0LmFzc2lnbihvcHRpb25zLCBvcHRzKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBMb2FkIGEgcHJvamVjdCBpbiB0aGUgc3BlY2lmaWVkIHBhdGggaW1tZWRpYXRlbHkuXG4gICpcbiAgKi9cbiAgbG9hZCAocHJvamVjdEZpbGUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBza3lwYWdlciA9IHRoaXNcblxuICAgIGlmIChQcm9qZWN0Q2FjaGUucHJvamVjdHNbcHJvamVjdEZpbGVdKSB7XG4gICAgICAgcmV0dXJuIFByb2plY3RDYWNoZS5wcm9qZWN0c1twcm9qZWN0RmlsZV1cbiAgICB9XG5cbiAgICBsZXQgcm9vdCA9IHByb2plY3RGaWxlLm1hdGNoKC8uanMvaSkgPyBkaXJuYW1lKHByb2plY3RGaWxlKSA6IHByb2plY3RGaWxlXG5cbiAgICAvLyBnZXQgdGhlIHByb2plY3QgbWFuaWZlc3QsIHdoaWNoIHNob3VsZCBpbmNsdWRlIGEgc2t5cGFnZXIga2V5XG4gICAgdHJ5IHsgb3B0aW9ucy5tYW5pZmVzdCA9IG9wdGlvbnMubWFuaWZlc3QgfHwgT2JqZWN0LmFzc2lnbihvcHRpb25zLm1hbmlmZXN0LCByZXF1aXJlKHJvb3QgKyAnL3BhY2thZ2UuanNvbicpKSB9IGNhdGNoIChlcnJvcikgeyB9XG5cbiAgICBvcHRpb25zLm1hbmlmZXN0ID0gb3B0aW9ucy5tYW5pZmVzdCB8fCB7fVxuICAgIG9wdGlvbnMubWFuaWZlc3Quc2t5cGFnZXIgPSBvcHRpb25zLm1hbmlmZXN0LnNreXBhZ2VyIHx8IHt9XG5cbiAgICBsZXQgcHJvamVjdCA9IChuZXcgdGhpcy5Qcm9qZWN0KHByb2plY3RGaWxlLCBvcHRpb25zKSlcblxuICAgIHJldHVybiBQcm9qZWN0Q2FjaGUucHJvamVjdHNbcHJvamVjdEZpbGVdID0gcHJvamVjdFxuICB9XG5cbiAgdXNlIChwbHVnaW5zLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAodHlwZW9mIHBsdWdpbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwbHVnaW5zID0gW3BsdWdpbnNdXG4gICAgfVxuXG4gICAgcGx1Z2lucy5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgICBsZXQgcGx1Z2luQ29uZmlnID0gdGhpcy5wbHVnaW5zLmxvb2t1cChwbHVnaW4pXG5cbiAgICAgIGlmIChwbHVnaW5Db25maWcgJiYgcGx1Z2luQ29uZmlnLmFwaSAmJiBwbHVnaW5Db25maWcuYXBpLm1vZGlmeSkge1xuICAgICAgICBwbHVnaW5Db25maWcuYXBpLm1vZGlmeSh0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwbHVnaW5Db25maWcuYXBpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcGx1Z2luQ29uZmlnLmFwaS5jYWxsKHRoaXMsIHRoaXMsIHBsdWdpbkNvbmZpZylcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmVuYWJsZWRQbHVnaW5zLnB1c2gocGx1Z2luKVxuICAgIH0pXG4gIH1cblxuICBsb2FkUGx1Z2luKHJlcXVpcmVQYXRoKSB7XG4gICAgdGhpcy5wbHVnaW5zLnJ1bkxvYWRlcihyZXF1aXJlKHJlcXVpcmVQYXRoKSlcbiAgfVxuXG4gIGdldCBhY3Rpb25zICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmFjdGlvbnNcbiAgfVxuXG4gIGdldCBjb250ZXh0cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5jb250ZXh0c1xuICB9XG5cbiAgZ2V0IGV4cG9ydGVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5leHBvcnRlcnNcbiAgfVxuXG4gIGdldCBpbXBvcnRlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuaW1wb3J0ZXJzXG4gIH1cblxuICBnZXQgbW9kZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLm1vZGVsc1xuICB9XG5cbiAgZ2V0IHBsdWdpbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMucGx1Z2luc1xuICB9XG5cbiAgZ2V0IHJlbmRlcmVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5yZW5kZXJlcnNcbiAgfVxuXG4gIGdldCB1dGlsICgpIHtcbiAgICByZXR1cm4gdXRpbFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRnJhbWV3b3JrXG4iXX0=