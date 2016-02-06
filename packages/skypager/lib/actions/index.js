'use strict';

module.exports = function ActionsLoader(actions) {
  actions.load(require('./projects/create_folders'), { uri: require.resolve('./projects/create_folders') });
};