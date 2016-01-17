export function BlueprintPlugin (project, options = {}) {
  project.models.runLoader(require('./src/models'))
}
