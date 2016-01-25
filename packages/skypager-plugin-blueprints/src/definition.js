plugin("Blueprints")

provides('models', [
  'backlog', 'concept', 'environment', 'epic',
  'feature', 'metric', 'package', 'persona',
  'platform', 'project', 'release', 'repository',
  'service', 'ui_component', 'ui_layout',
  'ui_screen', 'ui_theme'
])

provides('importers', ['github', 'npm'])

provides('exporters', ['github'])

modify(function(options){
  var host = options.project || options.host || require('skypager');

  host.run.importer('loader', require('./importers'))
  host.run.exporter('loader', require('./exporters'))
  host.run.model('loader', require('./models'))
})
