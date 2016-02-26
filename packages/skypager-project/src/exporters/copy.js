module.exports = exports = function run_copy_exporter (options = {}, context = {}) {
  let project = context.project || this

  return project.copy
}
