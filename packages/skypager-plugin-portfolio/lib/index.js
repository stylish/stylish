'use strict';

module.exports = function LoadsPlugin(plugins) {
  plugins.load(require('./plugin'), {
    uri: require.resolve('./plugin'),
    id: 'portfolio'
  });
};