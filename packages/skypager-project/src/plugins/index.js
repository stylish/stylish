module.exports = LoadsPlugins

const resolve = require.resolve

function LoadsPlugins (plugins) {
  const load = plugins.load.bind(plugins)

  load(require('./example'), {uri: resolve('./example'), id: 'example'})
}
