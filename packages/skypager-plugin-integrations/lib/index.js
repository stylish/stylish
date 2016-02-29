'use strict';

module.exports = function LoadsPlugin(plugins) {
  plugins.load(require('./integrations'), {
    id: 'integrations',
    uri: require.resolve('./integrations')
  });
};