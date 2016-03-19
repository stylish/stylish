'use strict';

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
module.exports = function GithubExporter(_ref, _ref2) {
  var _ref$type = _ref.type;
  var type = _ref$type === undefined ? 'all' : _ref$type;
  var _ref$params = _ref.params;
  var params = _ref$params === undefined ? {} : _ref$params;
  var project = _ref2.project;
};