'use strict';

module.exports = LoadsPlugins;

var resolve = require.resolve;

function LoadsPlugins(plugins) {
  var load = plugins.load.bind(plugins);

  load(require('./example'), { uri: resolve('./example'), id: 'example' });
}