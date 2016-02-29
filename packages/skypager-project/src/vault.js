/**
 * Generates settings to be used to protect files and content from
 * being published to a public website, service, or API.
*/
export function vault (project) {

  checkGitIgnore(project)
  checkNpmIgnore(project)

  const templates = {
    get accessibleEnvVars () {
      let allowAccessToEnvVars = [
        'NODE_ENV',
        'PWD'
      ].concat(
        Object.keys(process.env).filter(key => key.match(/SKYPAGER_^/))
      )

      if (project.settings.security) {
        if (project.settings.security.environment) {
          allowAccessToEnvVars.push(
            ...(project.settings.security.environment.accessibleVars)
          )
        }
      }

      return allowAccessToEnvVars
    }
  }

  return {
    templates
  }
}

export default vault

function checkGitIgnore(project) {

}

function checkNpmIgnore(project) {

}

