module.exports = LoadsExporters

const resolve = require.resolve

function LoadsExporters (exporters) {
  const load = exporters.load.bind(exporters)

  /*
  load(
    require('./create_root_portfolio.js'),
    { uri: resolve('./create_root_portfolio.js'), id: 'portfolios/root' }
  )
  */
}
