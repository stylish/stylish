'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _path = require('path');

var _fs = require('fs');

var _util = require('./util');

var _convict = require('convict');

var _convict2 = _interopRequireDefault(_convict);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SkypagerFolder = '.skypager';

module.exports = (function () {
  function Configuration(host) {
    _classCallCheck(this, Configuration);

    _util.hide.getter(this, 'host', host);
  }

  _createClass(Configuration, [{
    key: 'get',
    value: function get(value) {
      return this.convict.get(value);
    }
  }, {
    key: 'convict',
    get: function get() {
      return (0, _convict2.default)(this.schema);
    }
  }, {
    key: 'schema',
    get: function get() {
      var _this = this;

      var schema = {
        env: {
          doc: 'The application environment',
          format: ['development', 'production', 'test'],
          default: 'development',
          env: 'NODE_ENV',
          arg: 'env'
        },
        plugins_path: {
          doc: 'Path to plugins',
          default: (0, _path.join)(this.homeDir, SkypagerFolder, 'plugins'),
          env: 'SKYPAGER_PLUGINS_PATH',
          arg: 'plugins-path'
        }
      };

      this.host.enabledPlugins.forEach(function (pluginName) {
        var pluginHelper = _this.host.plugins.lookup(pluginName);

        if (pluginHelper.api.provides('configuration')) {}
      });

      return schema;
    }
  }, {
    key: 'homeDir',
    get: function get() {
      return process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME;
    }
  }]);

  return Configuration;
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWd1cmF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BLElBQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQTs7QUFFbEMsTUFBTSxDQUFDLE9BQU87QUFHWixXQURJLGFBQWEsQ0FDSixJQUFJLEVBQUU7MEJBRGYsYUFBYTs7QUFFZixVQVZhLElBQUksQ0FVWixNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtHQUNoQzs7ZUFIRyxhQUFhOzt3QkFLWixLQUFLLEVBQUU7QUFDVixhQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQy9COzs7d0JBRWM7QUFDYixhQUFPLHVCQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUM1Qjs7O3dCQUVhOzs7QUFDWixVQUFJLE1BQU0sR0FBRztBQUNYLFdBQUcsRUFBRTtBQUNILGFBQUcsRUFBRSw2QkFBNkI7QUFDbEMsZ0JBQU0sRUFBRSxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxDQUFDO0FBQzdDLGlCQUFPLEVBQUUsYUFBYTtBQUN0QixhQUFHLEVBQUUsVUFBVTtBQUNmLGFBQUcsRUFBRSxLQUFLO1NBQ1g7QUFDRCxvQkFBWSxFQUFFO0FBQ1osYUFBRyxFQUFFLGlCQUFpQjtBQUN0QixpQkFBTyxFQUFFLFVBbENDLElBQUksRUFrQ0EsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDO0FBQ3RELGFBQUcsRUFBRSx1QkFBdUI7QUFDNUIsYUFBRyxFQUFFLGNBQWM7U0FDcEI7T0FDRixDQUFBOztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVUsRUFBSTtBQUM3QyxZQUFJLFlBQVksR0FBRyxNQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFBOztBQUV2RCxZQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBRS9DO09BQ0YsQ0FBQyxDQUFBOztBQUVGLGFBQU8sTUFBTSxDQUFBO0tBQ2Q7Ozt3QkFFYztBQUNiLGFBQU8sT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUE7S0FDakY7OztTQTNDRyxhQUFhO0lBNENsQixDQUFBIiwiZmlsZSI6ImNvbmZpZ3VyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZXNvbHZlLCBqb2luLCBkaXJuYW1lIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IG1rZGlycFN5bmMsIHJlYWRGaWxlU3luYywgZXhpc3RzU3luYyB9IGZyb20gJ2ZzJ1xuaW1wb3J0IHsgYXNzaWduLCBoaWRlLCBjbG9uZSB9IGZyb20gJy4vdXRpbCdcblxuaW1wb3J0IGNvbnZpY3QgZnJvbSAnY29udmljdCdcblxuY29uc3QgU2t5cGFnZXJGb2xkZXIgPSAnLnNreXBhZ2VyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5cbmNsYXNzIENvbmZpZ3VyYXRpb24ge1xuICBjb25zdHJ1Y3RvciAoaG9zdCkge1xuICAgIGhpZGUuZ2V0dGVyKHRoaXMsICdob3N0JywgaG9zdClcbiAgfVxuXG4gIGdldCAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5jb252aWN0LmdldCh2YWx1ZSlcbiAgfVxuXG4gIGdldCBjb252aWN0ICgpIHtcbiAgICByZXR1cm4gY29udmljdCh0aGlzLnNjaGVtYSlcbiAgfVxuXG4gIGdldCBzY2hlbWEgKCkge1xuICAgIGxldCBzY2hlbWEgPSB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgZG9jOiAnVGhlIGFwcGxpY2F0aW9uIGVudmlyb25tZW50JyxcbiAgICAgICAgZm9ybWF0OiBbJ2RldmVsb3BtZW50JywgJ3Byb2R1Y3Rpb24nLCAndGVzdCddLFxuICAgICAgICBkZWZhdWx0OiAnZGV2ZWxvcG1lbnQnLFxuICAgICAgICBlbnY6ICdOT0RFX0VOVicsXG4gICAgICAgIGFyZzogJ2VudidcbiAgICAgIH0sXG4gICAgICBwbHVnaW5zX3BhdGg6IHtcbiAgICAgICAgZG9jOiAnUGF0aCB0byBwbHVnaW5zJyxcbiAgICAgICAgZGVmYXVsdDogam9pbih0aGlzLmhvbWVEaXIsIFNreXBhZ2VyRm9sZGVyLCAncGx1Z2lucycpLFxuICAgICAgICBlbnY6ICdTS1lQQUdFUl9QTFVHSU5TX1BBVEgnLFxuICAgICAgICBhcmc6ICdwbHVnaW5zLXBhdGgnXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5ob3N0LmVuYWJsZWRQbHVnaW5zLmZvckVhY2gocGx1Z2luTmFtZSA9PiB7XG4gICAgICBsZXQgcGx1Z2luSGVscGVyID0gdGhpcy5ob3N0LnBsdWdpbnMubG9va3VwKHBsdWdpbk5hbWUpXG5cbiAgICAgIGlmIChwbHVnaW5IZWxwZXIuYXBpLnByb3ZpZGVzKCdjb25maWd1cmF0aW9uJykpIHtcblxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gc2NoZW1hXG4gIH1cblxuICBnZXQgaG9tZURpciAoKSB7XG4gICAgcmV0dXJuIHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicgPyBwcm9jZXNzLmVudi5VU0VSUFJPRklMRSA6IHByb2Nlc3MuZW52LkhPTUVcbiAgfVxufVxuIl19