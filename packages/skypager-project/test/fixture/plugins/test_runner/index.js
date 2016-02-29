plugin("Test Runner")

modify(function(options){
  var host = options.project || options.host || this

  host.models.runLoader(function() {
    load(
      require.resolve('./models/example_plugin_model'),
      'example_plugin_model'
    )
  })

})
