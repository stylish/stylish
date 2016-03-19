'use strict';

module.exports = function LoadsPlugin(plugins) {
  plugins.load(require('./definition'), {
    uri: require.resolve('./definition'),
    id: 'blueprints'
  });
};