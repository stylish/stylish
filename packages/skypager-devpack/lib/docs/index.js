'use strict';

var _applications = require('ui/applications');

var _FluidLayout = require('ui/layouts/FluidLayout');

var _FluidLayout2 = _interopRequireDefault(_FluidLayout);

var _BrowseLayouts = require('./entries/BrowseLayouts');

var _BrowseLayouts2 = _interopRequireDefault(_BrowseLayouts);

var _BrowseComponents = require('./entries/BrowseComponents');

var _BrowseComponents2 = _interopRequireDefault(_BrowseComponents);

var _BrowseThemes = require('./entries/BrowseThemes');

var _BrowseThemes2 = _interopRequireDefault(_BrowseThemes);

var _HomePage = require('./entries/HomePage');

var _HomePage2 = _interopRequireDefault(_HomePage);

var _ViewComponent = require('./entries/ViewComponent');

var _ViewComponent2 = _interopRequireDefault(_ViewComponent);

var _ViewLayout = require('./entries/ViewLayout');

var _ViewLayout2 = _interopRequireDefault(_ViewLayout);

var _ViewTheme = require('./entries/ViewTheme');

var _ViewTheme2 = _interopRequireDefault(_ViewTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function () {
  return _applications.Application.create({
    root: 'app',
    layout: _FluidLayout2.default,
    entryPoints: {
      index: _HomePage2.default,
      themes: _BrowseThemes2.default,
      '/themes/:id': _ViewTheme2.default,
      components: _BrowseComponents2.default,
      '/components/:id': _ViewComponent2.default,
      layouts: _BrowseLayouts2.default,
      '/layouts/:id': _ViewLayout2.default
    }
  });
};