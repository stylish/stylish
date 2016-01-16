plugin("Test Runner")

modify(function(host){
  host.models.load(require.resolve('./models/example_plugin_model'),'example_plugin_model')
})
