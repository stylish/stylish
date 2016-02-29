/**
 * This exporter can be run by the project using something like:
 *
 * @example
 *
 *  project.importers.run('github', {
 *    type: 'SYNC_ISSUES',
 *    params: {
 *      repositories:['architects/skypager-central','architects/blueprint-app']
 *    }
 *  })
 *
 * @param Symbol type what type of github API call are we making
 * @param Object params:
 * @param String repository the name of the github repository
 * @param Array repositories the names of github repositories to sync issues from
 * @param String source where to pull content from for the issues
*/
module.exports = function GithubImporter({type = 'all', params = {}}, {project}) {
  const { settings } = project

  if (params.repositories || params.repository) {
    // search in the project settings maybe theyre declared there
    if (!project.get('settings.integrations.github')) {
      throw('Specify which repositories you are importing in the project settings, or in the options you pass to this function')
    }
  }

}
