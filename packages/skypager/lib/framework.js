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
  list.filter(function (item) {
    return item && typeof item === 'string';
  }).filter(function (item) {
    return !item.match(/skypager-plugin-/);
  }).forEach(function (plugin) {
    try {
      skypager.loadPlugin(require('skypager-plugin-' + plugin));
    } catch (error) {
      console.log('error', error.message);
    }
  });
}
module.exports = Framework;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9mcmFtZXdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBTVksSUFBSTs7OztJQUNKLE1BQU07Ozs7SUFDTixPQUFPOzs7Ozs7Ozs7O0FBSW5CLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtBQUNyQixPQUFPLENBQUMsUUFBUSxDQUFDOzs7QUFBQSxBQUdqQixPQUFRLE1BQU0sQ0FBQyxPQUFPLEFBQUMsQ0FBQTtBQUN2QixPQUFRLE9BQU8sQ0FBQyxPQUFPLEFBQUMsQ0FBQTtBQUN4QixPQUFRLGtCQUFRLE9BQU8sQUFBQyxDQUFBOztBQUV4QixJQUFNLFlBQVksR0FBRztBQUNuQixVQUFRLEVBQUUsRUFBSTtDQUNmLENBQUE7O0lBRUssU0FBUztBQUNiLFdBREksU0FBUyxDQUNBLElBQUksRUFBRSxXQUFXLEVBQUU7OzswQkFENUIsU0FBUzs7QUFFWCxRQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQTtBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQTs7QUFFckIsUUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTthQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBSyxJQUFJLEdBQUcsa0JBQWtCLENBQUMsRUFBRSxFQUFDLElBQUksRUFBSixJQUFJLEVBQUMsQ0FBQztLQUFBLENBQUMsQ0FBQTs7QUFFakcsUUFBTSxPQUFPLEdBQUcsRUFBRyxDQUFBOztBQUVuQixRQUFJLENBQUMsVUFBVSxHQUFHLG1CQUFTLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUMsSUFBSSxFQUFKLElBQUksRUFBQyxDQUFDLENBQUE7O0FBRTFELFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRTthQUFNLE9BQU87S0FBQSxDQUFDLENBQUE7O0FBRXZELFFBQUk7QUFDRixVQUFJLGVBQWUsQ0FBQTs7QUFF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SSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUE7S0FDakM7Ozt3QkFFYTtBQUNaLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUE7S0FDOUI7Ozt3QkFFYztBQUNiLGFBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUE7S0FDL0I7Ozt3QkFFZ0I7QUFDZixhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFBO0tBQ2pDOzs7d0JBRVc7QUFDVixhQUFPLElBQUksQ0FBQTtLQUNaOzs7U0EvSUcsU0FBUzs7O0FBa0pmLFNBQVMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRTtBQUMvQyxNQUFJLENBQ0gsTUFBTSxDQUFDLFVBQUEsSUFBSTtXQUFJLElBQUksSUFBSyxPQUFPLElBQUksS0FBSyxRQUFRLEFBQUM7R0FBQSxDQUFDLENBQ2xELE1BQU0sQ0FBQyxVQUFBLElBQUk7V0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUM7R0FBQSxDQUFDLENBQy9DLE9BQU8sQ0FBQyxVQUFBLE1BQU0sRUFBSTtBQUNqQixRQUFJO0FBQ0YsY0FBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLHNCQUFxQixNQUFNLENBQUksQ0FBQyxDQUFBO0tBQzVELENBQUMsT0FBTyxLQUFLLEVBQUU7QUFDZCxhQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUE7S0FDcEM7R0FDRixDQUFDLENBQUE7Q0FDSDtBQUNELE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFBIiwiZmlsZSI6ImZyYW1ld29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vaWYgKCFwcm9jZXNzLmVudi5TS1lQQUdFUl9ESVNUKSB7IHJlcXVpcmUoJy4vZW52aXJvbm1lbnQnKSgpIH1cblxuaW1wb3J0IENvbGxlY3Rpb24gZnJvbSAnLi9jb2xsZWN0aW9uJ1xuaW1wb3J0IFJlZ2lzdHJ5IGZyb20gJy4vcmVnaXN0cnknXG5pbXBvcnQgUHJvamVjdCBmcm9tICcuL3Byb2plY3QnXG5cbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi91dGlsJ1xuaW1wb3J0ICogYXMgQXNzZXRzIGZyb20gJy4vYXNzZXRzJ1xuaW1wb3J0ICogYXMgSGVscGVycyBmcm9tICcuL2hlbHBlcnMnXG5cbmltcG9ydCB7IGRpcm5hbWUsIHJlc29sdmUsIGpvaW4sIGJhc2VuYW1lLCBleHRuYW1lIH0gZnJvbSAncGF0aCdcblxucmVxdWlyZSgnLi9wb2x5ZmlsbCcpXG5yZXF1aXJlKCdzaG91bGQnKVxuXG4vLyB0ZW1wXG5kZWxldGUgKEFzc2V0cy5kZWZhdWx0KVxuZGVsZXRlIChIZWxwZXJzLmRlZmF1bHQpXG5kZWxldGUgKFByb2plY3QuZGVmYXVsdClcblxuY29uc3QgUHJvamVjdENhY2hlID0ge1xuICBwcm9qZWN0czogeyAgfVxufVxuXG5jbGFzcyBGcmFtZXdvcmsge1xuICBjb25zdHJ1Y3RvciAocm9vdCwgaW5pdGlhbGl6ZXIpIHtcbiAgICB0aGlzLnR5cGUgPSAnZnJhbWV3b3JrJ1xuICAgIHRoaXMucm9vdCA9IF9fZGlybmFtZVxuXG4gICAgdXRpbC5oaWRlLmdldHRlcih0aGlzLCAnbWFuaWZlc3QnLCAoKSA9PiBhc3NpZ24ocmVxdWlyZSh0aGlzLnJvb3QgKyAnLy4uL3BhY2thZ2UuanNvbicpLCB7cm9vdH0pKVxuXG4gICAgY29uc3QgcGx1Z2lucyA9IFsgXVxuXG4gICAgdGhpcy5yZWdpc3RyaWVzID0gUmVnaXN0cnkuYnVpbGRBbGwodGhpcywgSGVscGVycywge3Jvb3R9KVxuXG4gICAgdXRpbC5oaWRlLmdldHRlcih0aGlzLCAnZW5hYmxlZFBsdWdpbnMnLCAoKSA9PiBwbHVnaW5zKVxuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBwcm9qZWN0TWFuaWZlc3RcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvamVjdE1hbmlmZXN0ID0gcmVxdWlyZShqb2luKHByb2Nlc3MuZW52LlBXRCwgJ3BhY2thZ2UuanNvbicpKVxuICAgICAgfSBjYXRjaChlMikgeyAgfVxuXG4gICAgICBpZiAocHJvamVjdE1hbmlmZXN0ICYmIHByb2plY3RNYW5pZmVzdC5za3lwYWdlciAmJiBwcm9qZWN0TWFuaWZlc3Quc2t5cGFnZXIucGx1Z2lucykge1xuICAgICAgICBlYWdlckxvYWRQcm9qZWN0UGx1Z2lucyh0aGlzLCBwcm9qZWN0TWFuaWZlc3Quc2t5cGFnZXIucGx1Z2lucylcbiAgICAgIH1cbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdUcmllZCB0byBlYWdlciBsb2FkIHByb2plY3QgcGx1Z2lucyBhbmQgZmFpbGVkJywgcHJvamVjdE1hbmlmZXN0LnNreXBhZ2VyLnBsdWdpbnMpXG4gICAgICB0aHJvdyhlKVxuICAgIH1cblxuICAgIGlmICh0eXBlb2YgKGluaXRpYWxpemVyKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaW5pdGlhbGl6ZXIodGhpcylcbiAgICB9XG5cbiAgICByZXF1aXJlKCcuL2Vudmlyb25tZW50JykodGhpcy5yb290KVxuICB9XG5cbiAgLyoqXG4gICogQ3JlYXRlIGEgcHJvamVjdCBsb2FkZXIgZm9yIHRoZSBzcGVjaWZpZWQgcGF0aC5cbiAgKiBSZXR1cm5zIGEgZnVuY3Rpb24geW91IGNhbiBleGVjdXRlIHdoZW4geW91IHdhbnQgdGhlIHByb2plY3QgbG9hZGVkLlxuICAqL1xuICBjcmVhdGUgKHBhdGhUb1Byb2plY3QsIG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCBza3lwYWdlciA9IHRoaXNcblxuICAgIHJldHVybiBmdW5jdGlvbihvcHRzID0ge30pIHtcbiAgICAgIHJldHVybiBuZXcgc2t5cGFnZXIubG9hZChwYXRoVG9Qcm9qZWN0LCBPYmplY3QuYXNzaWduKG9wdGlvbnMsIG9wdHMpKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIExvYWQgYSBwcm9qZWN0IGluIHRoZSBzcGVjaWZpZWQgcGF0aCBpbW1lZGlhdGVseS5cbiAgKlxuICAqL1xuICBsb2FkIChwcm9qZWN0RmlsZSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgbGV0IHNreXBhZ2VyID0gdGhpc1xuXG4gICAgaWYgKFByb2plY3RDYWNoZS5wcm9qZWN0c1twcm9qZWN0RmlsZV0pIHtcbiAgICAgICByZXR1cm4gUHJvamVjdENhY2hlLnByb2plY3RzW3Byb2plY3RGaWxlXVxuICAgIH1cblxuICAgIGxldCByb290ID0gcHJvamVjdEZpbGUubWF0Y2goLy5qcy9pKSA/IGRpcm5hbWUocHJvamVjdEZpbGUpIDogcHJvamVjdEZpbGVcblxuICAgIC8vIGdldCB0aGUgcHJvamVjdCBtYW5pZmVzdCwgd2hpY2ggc2hvdWxkIGluY2x1ZGUgYSBza3lwYWdlciBrZXlcbiAgICB0cnkgeyBvcHRpb25zLm1hbmlmZXN0ID0gb3B0aW9ucy5tYW5pZmVzdCB8fCBPYmplY3QuYXNzaWduKG9wdGlvbnMubWFuaWZlc3QsIHJlcXVpcmUocm9vdCArICcvcGFja2FnZS5qc29uJykpIH0gY2F0Y2ggKGVycm9yKSB7IH1cblxuICAgIG9wdGlvbnMubWFuaWZlc3QgPSBvcHRpb25zLm1hbmlmZXN0IHx8IHt9XG4gICAgb3B0aW9ucy5tYW5pZmVzdC5za3lwYWdlciA9IG9wdGlvbnMubWFuaWZlc3Quc2t5cGFnZXIgfHwge31cblxuICAgIGxldCBwcm9qZWN0ID0gKG5ldyB0aGlzLlByb2plY3QocHJvamVjdEZpbGUsIG9wdGlvbnMpKVxuXG4gICAgcmV0dXJuIFByb2plY3RDYWNoZS5wcm9qZWN0c1twcm9qZWN0RmlsZV0gPSBwcm9qZWN0XG4gIH1cblxuICB1c2UgKHBsdWdpbnMsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlmICh0eXBlb2YgcGx1Z2lucyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHBsdWdpbnMgPSBbcGx1Z2luc11cbiAgICB9XG5cbiAgICBwbHVnaW5zLmZvckVhY2gocGx1Z2luID0+IHtcbiAgICAgIGxldCBwbHVnaW5Db25maWcgPSB0aGlzLnBsdWdpbnMubG9va3VwKHBsdWdpbilcblxuICAgICAgaWYgKHBsdWdpbkNvbmZpZyAmJiBwbHVnaW5Db25maWcuYXBpICYmIHBsdWdpbkNvbmZpZy5hcGkubW9kaWZ5KSB7XG4gICAgICAgIHBsdWdpbkNvbmZpZy5hcGkubW9kaWZ5KHRoaXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHBsdWdpbkNvbmZpZy5hcGkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBwbHVnaW5Db25maWcuYXBpLmNhbGwodGhpcywgdGhpcywgcGx1Z2luQ29uZmlnKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZW5hYmxlZFBsdWdpbnMucHVzaChwbHVnaW4pXG4gICAgfSlcbiAgfVxuXG4gIGxvYWRQbHVnaW4ocmVxdWVzdCkge1xuICAgIGxldCBsb2FkZXJcblxuICAgIGlmICh0eXBlb2YgcmVxdWVzdCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGxvYWRlciA9IHJlcXVpcmUocmVxdWVzdClcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGxvYWRpbmcgcGx1Z2luIGF0ICR7IHJlcXVlc3QgfTogJHsgZS5tZXNzYWdlIH1gKVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgbG9hZGVyID0gcmVxdWlyZShgc2t5cGFnZXItcGx1Z2luLSR7IHJlcXVlc3QgfWApXG4gICAgICAgIH0gY2F0Y2goZTIpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgUmV0cmllZCB1c2luZyBza3lwYWdlci1wbHVnaW4tJHsgcmVxdWVzdCB9OiAkeyBlMi5tZXNzYWdlIH1gKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChsb2FkZXIpIHsgcmVxdWVzdCA9IGxvYWRlciB9XG4gICAgfVxuXG4gICAgdGhpcy5wbHVnaW5zLnJ1bkxvYWRlcihyZXF1ZXN0KVxuICB9XG5cbiAgZ2V0IGFjdGlvbnMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMuYWN0aW9uc1xuICB9XG5cbiAgZ2V0IGNvbnRleHRzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmNvbnRleHRzXG4gIH1cblxuICBnZXQgZXhwb3J0ZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLmV4cG9ydGVyc1xuICB9XG5cbiAgZ2V0IGltcG9ydGVycyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5pbXBvcnRlcnNcbiAgfVxuXG4gIGdldCBtb2RlbHMgKCkge1xuICAgIHJldHVybiB0aGlzLnJlZ2lzdHJpZXMubW9kZWxzXG4gIH1cblxuICBnZXQgcGx1Z2lucyAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0cmllcy5wbHVnaW5zXG4gIH1cblxuICBnZXQgcmVuZGVyZXJzICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyaWVzLnJlbmRlcmVyc1xuICB9XG5cbiAgZ2V0IHV0aWwgKCkge1xuICAgIHJldHVybiB1dGlsXG4gIH1cbn1cblxuZnVuY3Rpb24gZWFnZXJMb2FkUHJvamVjdFBsdWdpbnMoc2t5cGFnZXIsIGxpc3QpIHtcbiAgbGlzdFxuICAuZmlsdGVyKGl0ZW0gPT4gaXRlbSAmJiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSlcbiAgLmZpbHRlcihpdGVtID0+ICFpdGVtLm1hdGNoKC9za3lwYWdlci1wbHVnaW4tLykpXG4gIC5mb3JFYWNoKHBsdWdpbiA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIHNreXBhZ2VyLmxvYWRQbHVnaW4ocmVxdWlyZShgc2t5cGFnZXItcGx1Z2luLSR7IHBsdWdpbiB9YCkpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicsIGVycm9yLm1lc3NhZ2UpXG4gICAgfVxuICB9KVxufVxubW9kdWxlLmV4cG9ydHMgPSBGcmFtZXdvcmtcbiJdfQ==