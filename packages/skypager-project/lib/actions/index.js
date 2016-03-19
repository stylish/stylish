'use strict';

module.exports = function ActionsLoader(actions) {
  actions.load(require('./specs/run_suite'), { uri: require.resolve('./specs/run_suite') });

  actions.load(require('./specs/generate'), { uri: require.resolve('./specs/generate') });
};