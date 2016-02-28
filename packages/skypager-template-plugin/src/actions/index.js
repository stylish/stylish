module.exports = LoadsActions

const resolve = require.resolve

function LoadsActions (actions) {
  const load = actions.load.bind(actions)

  /*
  load(
    require('./create_root_portfolio.js'),
    { uri: resolve('./create_root_portfolio.js'), id: 'portfolios/root' }
  )
  */
}
