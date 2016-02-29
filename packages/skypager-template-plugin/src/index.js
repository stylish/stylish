module.exports = LoadsPlugins

const resolve = require.resolve

function LoadsPlugin (plugins) {
  const load = plugins.load.bind(plugins)

  load(
    require('./plugin.js'),
    {
      uri: resolve('./plugin.js'),
      id: require('../package.json').name.replace(/skypager-plugin-/,'')
    }
  )
}
