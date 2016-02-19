'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appSettings = undefined;
exports.setup = setup;

var _Application = require('../containers/Application');

var _Application2 = _interopRequireDefault(_Application);

var _IconNavLayout = require('ui/layouts/IconNavLayout');

var _IconNavLayout2 = _interopRequireDefault(_IconNavLayout);

var _SetupApp = require('ui/applications/setup/SetupApp');

var _SetupApp2 = _interopRequireDefault(_SetupApp);

var _SetupStyles = require('ui/applications/setup/SetupStyles');

var _SetupStyles2 = _interopRequireDefault(_SetupStyles);

var _SetupDeployment = require('ui/applications/setup/SetupDeployment');

var _SetupDeployment2 = _interopRequireDefault(_SetupDeployment);

var _SetupHome = require('ui/applications/setup/SetupHome');

var _SetupHome2 = _interopRequireDefault(_SetupHome);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _Object = Object;
var assign = _Object.assign;
function setup(project) {

  project.settings = assign(project.settings || {}, appSettings);

  _Application2.default.create({
    setup: true,
    project: project,
    entryPoints: {
      index: _SetupHome2.default,
      app: { component: _SetupApp2.default },
      styles: { component: _SetupStyles2.default },
      deployment: { component: _SetupDeployment2.default }
    }
  });
}

exports.default = setup;
var appSettings = exports.appSettings = {
  branding: {
    icon: 'flask',
    brand: 'Skypager',
    theme: 'dashboard-dark'
  },
  navigation: {
    links: [{
      link: '/',
      label: 'Setup',
      icon: 'cog'
    }, {
      link: '/app',
      label: 'App',
      icon: 'browser'
    }, {
      link: '/styles',
      label: 'Style',
      icon: 'colours'
    }, {
      link: '/deployment',
      label: 'Deploy',
      icon: 'upload-to-cloud'
    }]
  }
};