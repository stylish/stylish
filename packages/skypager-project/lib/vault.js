'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.vault = vault;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Generates settings to be used to protect files and content from
 * being published to a public website, service, or API.
*/
function vault(project) {

  checkGitIgnore(project);
  checkNpmIgnore(project);

  var templates = {
    get accessibleEnvVars() {
      var allowAccessToEnvVars = ['NODE_ENV', 'PWD'].concat((0, _keys2.default)(process.env).filter(function (key) {
        return key.match(/SKYPAGER_^/);
      }));

      if (project.settings.security) {
        if (project.settings.security.environment) {
          var e = project.settings.security.environment;

          allowAccessToEnvVars.push.apply(allowAccessToEnvVars, (0, _toConsumableArray3.default)(e.whitelist || e.accessibleVars || {}));
        }
      }

      return allowAccessToEnvVars;
    }
  };

  return {
    templates: templates
  };
}

exports.default = vault;

function checkGitIgnore(project) {}

function checkNpmIgnore(project) {}