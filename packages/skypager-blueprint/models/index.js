const resolve = require.resolve

module.exports = function LoadProjectModels(models) {
  const load = models.load.bind(models)

  load(
    require('./component'), {
      id: 'component',
      uri: resolve('./component')
    }
  )

  load(
    require('./entry'), {
      id: 'entry',
      uri: resolve('./entry')
    }
  )

  load(
    require('./layout'), {
      id: 'layout',
      uri: resolve('./layout')
    }
  )

}

