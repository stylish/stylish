module.exports = LoadsImporters

const resolve = require.resolve

function LoadsImporters (importers) {
  const load = importers.load.bind(importers)

  /*
  load(
    require('./create_root_portfolio.js'),
    { uri: resolve('./create_root_portfolio.js'), id: 'portfolios/root' }
  )
  */
}
