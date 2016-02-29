'use strict';

module.exports = LoadsImporters;

var resolve = require.resolve;

function LoadsImporters(importers) {
  var load = importers.load.bind(importers);

  load(require('./disk'), { uri: resolve('./disk') });
}