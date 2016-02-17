'use strict';

var _lodash = require('lodash');

var description = 'multi-page React app built for Electron';

module.exports = {
  electron: react_electron,
  react_electron: react_electron,
  description: description
};

function react_electron(env, project) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  return env === 'production' ? production(project, options) : development(project, options);
}

function production(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _lodash.defaults)({
    contentHash: false,
    env: 'production',
    htmlFileName: 'index.html',
    publicPath: '',
    platform: 'electron',
    theme: (0, _lodash.get)(project, 'options.theme') || (0, _lodash.get)(project, 'settings.themes.theme') || (0, _lodash.get)(project, 'settings.themes.base') || options.theme
  }, project.get('settings.build.production'));
}

function development(project) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _lodash.defaults)({
    contentHash: false,
    env: 'development',
    htmlFileName: 'index.html',
    platform: 'electron',
    publicPath: '/',
    theme: (0, _lodash.get)(project, 'options.theme') || (0, _lodash.get)(project, 'settings.themes.theme') || (0, _lodash.get)(project, 'settings.themes.base') || options.theme
  }, project.get('settings.build.development'));
}