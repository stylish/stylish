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

    try {
      var projectManifest;

      try {
        projectManifest = require((0, _path.join)(process.env.PWD, 'package.json'));
      } catch (e2) {}

      if (projectManifest && projectManifest.skypager && projectManifest.skypager.plugins) {
        console.log('Eager loading project plugins');
        eagerLoadProjectPlugins(this, projectManifest.skypager.plugins);
      }
    } catch (e) {
      console.log('Tried to eager load project plugins and failed', projectManifest.skypager.plugins);
      throw e;
    }

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
  console.log('list', list);
  list.filter(function (item) {
    return item && typeof item === 'string';
  }).filter(function (item) {
    return !item.match(/skypager-plugin-/);
  }).forEach(function (plugin) {
    console.log('plugin', plugin);
    try {
      skypager.loadPlugin(require('skypager-plugin-' + plugin));
    } catch (error) {
      console.log('error', error.message);
    }
  });
}
module.exports = Framework;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mcmFtZXdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBTVksSUFBSTs7OztJQUNKLE1BQU07Ozs7SUFDTixPQUFPOzs7Ozs7Ozs7O0FBSW5CLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNyQixPQUFPLENBQUMsUUFBUSxDQUFDOzs7QUFBQSxBQUdqQixPQUFRLE1BQU0sQ0FBQyxPQUFPLEFBQUMsQ0FBQTtBQUN2QixPQUFRLE9BQU8sQ0FBQyxPQUFPLEFBQUMsQ0FBQTtBQUN4QixPQUFRLGtCQUFRLE9BQU8sQUFBQyxDQUFBOztBQUV4QixJQUFNLFlBQVksR0FBRztBQUNuQixVQUFRLEVBQUUsRUFBSTtDQUNmLENBQUE7O0lBRUssU0FBUztBQUNiLFdBREksU0FBUyxDQUNBLElBQUksRUFBRSxXQUFXLEVBQUU7OzswQkFENUIsU0FBUzs7QUFFWCxRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQTtBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQTs7QUFFckIsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTthQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBSyxJQUFJLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxFQUFDLElBQUksRUFBSixJQUFJLEVBQUMsQ0FBQztLQUFBLENBQUMsQ0FBQTs7QUFFakcsUUFBTSxPQUFPLEdBQUcsRUFBRyxDQUFBOztBQUVuQixRQUFJLENBQUMsVUFBVSxHQUFHLG1CQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFKLElBQUksRUFBQyxDQUFDLENBQUE7O0FBRTFELFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTthQUFNLE9BQU87S0FBQSxDQUFDLENBQUE7O0FBRXZELFFBQUk7QUFDRixVQUFJLGVBQWUsQ0FBQTs7QUFF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bnYuU0tZUEFHRVJfRElTVCkgeyByZXF1aXJlKCcuL2Vudmlyb25tZW50JykoKSB9XG5cbmltcG9ydCBDb2xsZWN0aW9uIGZyb20gJy4vY29sbGVjdGlvbidcbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuL3JlZ2lzdHJ5J1xuaW1wb3J0IFByb2plY3QgZnJvbSAnLi9wcm9qZWN0J1xuXG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4vdXRpbCdcbmltcG9ydCAqIGFzIEFzc2V0cyBmcm9tICcuL2Fzc2V0cydcbmltcG9ydCAqIGFzIEhlbHBlcnMgZnJvbSAnLi9oZWxwZXJzJ1xuXG5pbXBvcnQgeyBkaXJuYW1lLCByZXNvbHZlLCBqb2luLCBiYXNlbmFtZSwgZXh0bmFtZSB9IGZyb20gJ3BhdGgnXG5cbnJlcXVpcmUoJy4vcG9seWZpbGwnKVxucmVxdWlyZSgnc2hvdWxkJylcblxuLy8gdGVtcFxuZGVsZXRlIChBc3NldHMuZGVmYXVsdClcbmRlbGV0ZSAoSGVscGVycy5kZWZhdWx0KVxuZGVsZXRlIChQcm9qZWN0LmRlZmF1bHQpXG5cbmNvbnN0IFByb2plY3RDYWNoZSA9IHtcbiAgcHJvamVjdHM6IHsgIH1cbn1cblxuY2xhc3MgRnJhbWV3b3JrIHtcbiAgY29uc3RydWN0b3IgKHJvb3QsIGluaXRpYWxpemVyKSB7XG4gICAgdGhpcy50eXBlID0gJ2ZyYW1ld29yaydcbiAgICB0aGlzLnJvb3QgPSBfX2Rpcm5hbWVcblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ21hbmlmZXN0JywgKCkgPT4gYXNzaWduKHJlcXVpcmUodGhpcy5yb290ICsgJy8uLi9wYWNrYWdlLmpzb24nKSwge3Jvb3R9KSlcblxuICAgIGNvbnN0IHBsdWdpbnMgPSBbIF1cblxuICAgIHRoaXMucmVnaXN0cmllcyA9IFJlZ2lzdHJ5LmJ1aWxkQWxsKHRoaXMsIEhlbHBlcnMsIHtyb290fSlcblxuICAgIHV0aWwuaGlkZS5nZXR0ZXIodGhpcywgJ2VuYWJsZWRQbHVnaW5zJywgKCkgPT4gcGx1Z2lucylcblxuICAgIHRyeSB7XG4gICAgICB2YXIgcHJvamVjdE1hbmlmZXN0XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHByb2plY3RNYW5pZmVzdCA9IHJlcXVpcmUoam9pbihwcm9jZXNzLmVudi5QV0QsICdwYWNrYWdlLmpzb24nKSlcbiAgICAgIH0gY2F0Y2goZTIpIHsgIH1cblxuICAgICAgaWYgKHByb2plY3RNYW5pZmVzdCAmJiBwcm9qZWN0TWFuaWZlc3Quc2t5cGFnZXIgJiYgcHJvamVjdE1hbmlmZXN0LnNreXBhZ2VyLnBsdWdpbnMpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ0VhZ2VyIGxvYWRpbmcgcHJvamVjdCBwbHVnaW5zJylcbiAgICAgICAgZWFnZXJMb2FkUHJvamVjdFBsdWdpbnModGhpcywgcHJvamVjdE1hbmlmZXN0LnNreXBhZ2VyLnBsdWdpbnMpXG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnVHJpZWQgdG8gZWFnZXIgbG9hZCBwcm9qZWN0IHBsdWdpbnMgYW5kIGZhaWxlZCcsIHByb2plY3RNYW5pZmVzdC5za3lwYWdlci5wbHVnaW5zKVxuICAgICAgdGhyb3coZSlcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIChpbml0aWFsaXplcikgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGluaXRpYWxpemVyKHRoaXMpXG4gICAgfVxuXG4gICAgcmVxdWlyZSgnLi9lbnZpcm9ubWVudCcpKHRoaXMucm9vdClcbiAgfVxuXG4gIC8qKlxuICAqIENyZWF0ZSBhIHByb2plY3QgbG9hZGVyIGZvciB0aGUgc3BlY2lmaWVkIHBhdGguXG4gICogUmV0dXJucyBhIGZ1bmN0aW9uIHlvdSBjYW4gZXhlY3V0ZSB3aGVuIHlvdSB3YW50IHRoZSBwcm9qZWN0IGxvYWRlZC5cbiAgKi9cbiAgY3JlYXRlIChwYXRoVG9Qcm9qZWN0LCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgc2t5cGFnZXIgPSB0aGlzXG5cbiAgICByZXR1cm4gZnVuY3Rpb24ob3B0cyA9IHt9KSB7XG4gICAgICByZXR1cm4gbmV3IHNreXBhZ2VyLmxvYWQocGF0aFRvUHJvamVjdCwgT2JqZWN0LmFzc2lnbihvcHRpb25zLCBvcHRzKSlcbiAgICB9XG4gIH1cblxuICAvKipcbiAgKiBMb2FkIGEgcHJvamVjdCBpbiB0aGUgc3BlY2lmaWVkIHBhdGggaW1tZWRpYXRlbHkuXG4gICpcbiAgKi9cbiAgbG9hZCAocHJvamVjdEZpbGUsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBza3lwYWdlciA9IHRoaXNcblxuICAgIGlmIChQcm9qZWN0Q2FjaGUucHJvamVjdHNbcHJvamVjdEZpbGVdKSB7XG4gICAgICAgcmV0dXJuIFByb2plY3RDYWNoZS5wcm9qZWN0c1twcm9qZWN0RmlsZV1cbiAgICB9XG5cbiAgICBsZXQgcm9vdCA9IHByb2plY3RGaWxlLm1hdGNoKC8uanMvaSkgPyBkaXJuYW1lKHByb2plY3RGaWxlKSA6IHByb2plY3RGaWxlXG5cbiAgICAvLyBnZXQgdGhlIHByb2plY3QgbWFuaWZlc3QsIHdoaWNoIHNob3VsZCBpbmNsdWRlIGEgc2t5cGFnZXIga2V5XG4gICAgdHJ5IHsgb3B0aW9ucy5tYW5pZmVzdCA9IG9wdGlvbnMubWFuaWZlc3QgfHwgT2JqZWN0LmFzc2lnbihvcHRpb25zLm1hbmlmZXN0LCByZXF1aXJlKHJvb3QgKyAnL3BhY2thZ2UuanNvbicpKSB9IGNhdGNoIChlcnJvcikgeyB9XG5cbiAgICBvcHRpb25zLm1hbmlmZXN0ID0gb3B0aW9ucy5tYW5pZmVzdCB8fCB7fVxuICAgIG9wdGlvbnMubWFuaWZlc3Quc2t5cGFnZXIgPSBvcHRpb25zLm1hbmlmZXN0LnNreXBhZ2VyIHx8IHt9XG5cbiAgICBsZXQgcHJvamVjdCA9IChuZXcgdGhpcy5Qcm9qZWN0KHByb2plY3RGaWxlLCBvcHRpb25zKSlcblxuICAgIHJldHVybiBQcm9qZWN0Q2FjaGUucHJvamVjdHNbcHJvamVjdEZpbGVdID0gcHJvamVjdFxuICB9XG5cbiAgdXNlIChwbHVnaW5zLCBvcHRpb25zID0ge30pIHtcbiAgICBpZiAodHlwZW9mIHBsdWdpbnMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBwbHVnaW5zID0gW3BsdWdpbnNdXG4gICAgfVxuXG4gICAgcGx1Z2lucy5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgICBsZXQgcGx1Z2luQ29uZmlnID0gdGhpcy5wbHVnaW5zLmxvb2t1cChwbHVnaW4pXG5cbiAgICAgIGlmIChwbHVnaW5Db25maWcgJiYgcGx1Z2luQ29uZmlnLmFwaSAmJiBwbHVnaW5Db25maWcuYXBpLm1vZGlmeSkge1xuICAgICAgICBwbHVnaW5Db25maWcuYXBpLm1vZGlmeSh0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBwbHVnaW5Db25maWcuYXBpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcGx1Z2luQ29uZmlnLmFwaS5jYWxsKHRoaXMsIHRoaXMsIHBsdWdpbkNvbmZpZylcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLmVuYWJsZWRQbHVnaW5zLnB1c2gocGx1Z2luKVxuICAgIH0pXG4gIH1cblxuICBsb2FkUGx1Z2luKHJlcXVlc3QpIHtcbiAgICBsZXQgbG9hZGVyXG5cbiAgICBpZiAodHlwZW9mIHJlcXVlc3QgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBsb2FkZXIgPSByZXF1aXJlKHJlcXVlc3QpXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBFcnJvciBsb2FkaW5nIHBsdWdpbiBhdCAkeyByZXF1ZXN0IH06ICR7IGUubWVzc2FnZSB9YClcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGxvYWRlciA9IHJlcXVpcmUoYHNreXBhZ2VyLXBsdWdpbi0keyByZXF1ZXN0IH1gKVxuICAgICAgICB9IGNhdGNoKGUyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYFJldHJpZWQgdXNpbmcgc2t5cGFnZXItcGx1Z2luLSR7IHJlcXVlc3QgfTogJHsgZTIubWVzc2FnZSB9YClcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAobG9hZGVyKSB7IHJlcXVlc3QgPSBsb2FkZXIgfVxuICAgIH1cblxuICAgIHRoaXMucGx1Z2lucy5ydW5Mb2FkZXIocmVxdWVzdClcbiAgfVxuXG4gIGdldCBhY3Rpb25zICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmFjdGlvbnNcbiAgfVxuXG4gIGdldCBjb250ZXh0cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5jb250ZXh0c1xuICB9XG5cbiAgZ2V0IGV4cG9ydGVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5leHBvcnRlcnNcbiAgfVxuXG4gIGdldCBpbXBvcnRlcnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuaW1wb3J0ZXJzXG4gIH1cblxuICBnZXQgbW9kZWxzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLm1vZGVsc1xuICB9XG5cbiAgZ2V0IHBsdWdpbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMucGx1Z2luc1xuICB9XG5cbiAgZ2V0IHJlbmRlcmVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5yZW5kZXJlcnNcbiAgfVxuXG4gIGdldCB1dGlsICgpIHtcbiAgICByZXR1cm4gdXRpbFxuICB9XG59XG5cbmZ1bmN0aW9uIGVhZ2VyTG9hZFByb2plY3RQbHVnaW5zKHNreXBhZ2VyLCBsaXN0KSB7XG4gIGNvbnNvbGUubG9nKCdsaXN0JywgbGlzdClcbiAgbGlzdFxuICAuZmlsdGVyKGl0ZW0gPT4gaXRlbSAmJiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSlcbiAgLmZpbHRlcihpdGVtID0+ICFpdGVtLm1hdGNoKC9za3lwYWdlci1wbHVnaW4tLykpXG4gIC5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgY29uc29sZS5sb2coJ3BsdWdpbicsIHBsdWdpbilcbiAgICB0cnkge1xuICAgICAgc2t5cGFnZXIubG9hZFBsdWdpbihyZXF1aXJlKGBza3lwYWdlci1wbHVnaW4tJHsgcGx1Z2luIH1gKSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ2Vycm9yJywgZXJyb3IubWVzc2FnZSlcbiAgICB9XG4gIH0pXG59XG5tb2R1bGUuZXhwb3J0cyA9IEZyYW1ld29ya1xuIl19