plugin('Portfolio')

modify(function (options = {}, context = {}) {
  let host = options.host || options.project

  host.actions.runLoader(
    require('./actions')
  )
})
