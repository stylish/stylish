/**
 * This exporter can be run by the project using something like:
 *
 * @example
 *
 *  project.exporters.run('github', {
 *    type: 'CREATE_GITHUB_ISSUES',
 *    params: {
 *      repository: 'architects/skypager-central',
 *      source: project.query('features', {github_issue_id: null})
 *    }
 *  })
 *
 * @param Symbol type what type of github API call are we making
 * @param Object params:
 * @param String repository the name of the github repository
 * @param String source where to pull content from for the issues
*/
module.exports = function GithubExporter({type = 'all', params = {}}, {project}) {

}
