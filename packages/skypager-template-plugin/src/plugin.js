plugin('MyPlugin')

modify(function (options = {}, context = {}) {
  let host = options.host || options.project

  host.actions.runLoader(require('./actions'))
  host.actions.runLoader(require('./exporters'))
  host.actions.runLoader(require('./importers'))
  host.actions.runLoader(require('./models'))
})
