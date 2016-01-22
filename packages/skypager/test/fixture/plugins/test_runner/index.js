plugin("Test Runner")

modify(function(options){
  var host = options.project || options.host || this
  host.models.load(require.resolve('./models/example_plugin_model'),'example_plugin_model')
})
