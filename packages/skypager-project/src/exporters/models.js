module.exports = function run_model_definitions_exporter (options = {}) {
  let project = options.project || this
  let definitions = project.modelDefinitions || {}

  return definitions
}

