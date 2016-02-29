'use strict';

module.exports = LoadsActions;

var resolve = require.resolve;

function LoadsActions(actions) {
  var load = actions.load.bind(actions);

  load(require('./packages/each.js'), { uri: resolve('./packages/each.js'), id: 'packages/each' });
}