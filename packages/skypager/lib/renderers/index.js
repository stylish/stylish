'use strict';

module.exports = LoadsRenderers;

var resolve = require.resolve;

function LoadsRenderers(renderers) {
  var load = renderers.load.bind(renderers);

  load(require('./html.js'), { uri: resolve('./html.js'), id: 'html' });
}