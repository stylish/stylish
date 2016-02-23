plugin("Blueprints")

modify(function(options = {}, context = {}){
  var host = options.project || options.host || require('skypager-project');

  //host.importers.runLoader(require('./importers'))
  //host.exporters.runLoader(require('./exporters'))
  host.models.runLoader(require('./models'))
})
