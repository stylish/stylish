plugin('Integrations')

modify((options = {}, context = {}) => {
  var host = options.project || options.host || require('skypager-project');

  // useful for loading a lot of helpers
  host.models.runLoader(require('./models'))
  host.actions.runLoader(require('./actions'))

  // can load them one off too
  host.exporters.load(
    require('./exporters/github_exporter'), {
      id: 'github',
      uri: require.resolve('./exporters/github_exporter')
    }
  )

  host.importers.load(
    require('./importers/github_importer'), {
      id: 'github',
      uri: require.resolve('./importers/github_importer')
    }
  )

})
