module.exports = LoadsActions

const resolve = require.resolve

function LoadsActions (actions) {
  const load = actions.load.bind(actions)

  load(
    require('./packages/each.js'),
    { uri: resolve('./packages/each.js'), id: 'packages/each' }
  )

  load(
    require('./settings/generate.js'),
    { uri: resolve('./settings/generate.js'), id: 'settings/generate' }
  )

}
