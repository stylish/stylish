module.exports = LoadsImporters

const resolve = require.resolve

function LoadsImporters (importers) {
  const load = importers.load.bind(importers)

  load(require('./disk'), {uri: resolve('./disk')})
}
