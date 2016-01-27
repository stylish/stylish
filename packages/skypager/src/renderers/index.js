module.exports = LoadsRenderers

const resolve = require.resolve

function LoadsRenderers (renderers) {
  const load = renderers.load.bind(renderers)

  load(
     require('./html.js'),
     {uri: resolve('./html.js'), id: 'html'}
  )
}
