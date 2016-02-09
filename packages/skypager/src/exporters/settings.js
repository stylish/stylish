module.exports = function run_settings_exporter (options = {}) {
  let project = options.project || this

  return project.settings
}

