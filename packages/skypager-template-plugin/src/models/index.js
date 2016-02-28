module.exports = LoadsModels

const resolve = require.resolve

function LoadsModels (models) {
  const load = models.load.bind(models)

  /*
  load(
    require('./create_root_portfolio.js'),
    { uri: resolve('./create_root_portfolio.js'), id: 'portfolios/root' }
  )
  */
}
