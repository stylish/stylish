module.exports = LoadsModels

const resolve = require.resolve

function LoadsModels (models) {
  const load = models.load.bind(models)

  load(require('./log'), {uri: resolve('./log')})
  load(require('./outline'), {uri: resolve('./outline')})
  load(require('./page'), {uri: resolve('./page')})
  load(require('./spec'), {uri: resolve('./spec')})
}

