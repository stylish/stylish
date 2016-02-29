module.exports = exports = function run_settings_exporter (options = {}, context = {}) {
  let project = context.project || this

  return project.settings
}
