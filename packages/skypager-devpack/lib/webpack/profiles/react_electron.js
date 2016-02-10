'use strict';

var _defaults = require('lodash/object/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _pick = require('lodash/object/pick');

var _pick2 = _interopRequireDefault(_pick);

var _result = require('lodash/object/result');

var _result2 = _interopRequireDefault(_result);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var description = 'multi-page React app built for Electron';

module.exports = {
  react_electron: react_electron,
  description: description
};

function react_electron(env, project) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  return env === 'production' ? production(project, options) : development(project, options);
}

function production(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _defaults2.default)({
    contentHash: false,
    env: 'production',
    htmlFileName: 'index.html',
    publicPath: '',
    platform: 'electron',
    theme: (0, _result2.default)(project, 'options.theme') || (0, _result2.default)(project, 'settings.themes.theme') || (0, _result2.default)(project, 'settings.themes.base') || options.theme
  }, project.get('settings.build.production'));
}

function development(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _defaults2.default)({
    contentHash: false,
    env: 'development',
    htmlFileName: 'index.html',
    platform: 'electron',
    publicPath: '/',
    theme: (0, _result2.default)(project, 'options.theme') || (0, _result2.default)(project, 'settings.themes.theme') || (0, _result2.default)(project, 'settings.themes.base') || options.theme
  }, project.get('settings.build.development'));
}