module.exports = LoadsExporters

const resolve = require.resolve

function LoadsExporters (exporters) {
  let load = exporters.load.bind(exporters)

  load(require('./all'), {uri: resolve('./all')})
  load(require('./assets'), {uri: resolve('./assets')})
  load(require('./bundle'), {id: 'bundle', uri: resolve('./bundle')})
  load(require('./copy'), {uri: resolve('./copy')})
  load(require('./content'), {uri: resolve('./content')})
  load(require('./entities'), {uri: resolve('./entities')})
  load(require('./models'), {uri: resolve('./models')})
  load(require('./project'), {uri: resolve('./project')})
  load(require('./settings'), {uri: resolve('./settings')})
  load(require('./snapshot'), {uri: resolve('./snapshot')})
}
