module.exports = function run_entities_exporter (options = {}) {
  let project = options.project || this;
  let entities = project.entities || {}

  let { format, filename } = options

  if (options.output) {
    project.exporters.run('disk', {
      type: 'entities',
      format,
      filename,
      project,
      payload: {
        entities
      }
    })
  }

  return entities
}

