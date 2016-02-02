plugin('Integrations')

modify((options = {}, context = {}) => {
  var host = options.project || options.host || require('skypager');

  host.models.runLoader(require('./models'))
  host.actions.runLoader(require('./actions'))
})
