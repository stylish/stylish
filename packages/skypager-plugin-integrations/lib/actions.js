'use strict';

module.exports = function LoadsActions(actions) {
  actions.load(require('./actions/settings/generate.js'), {
    uri: require.resolve('./actions/settings/generate.js'),
    id: 'settings/generate'
  });

  actions.load(require('./actions/github/sync.js'), {
    uri: require.resolve('./actions/github/sync.js'),
    id: 'github/sync'
  });
};