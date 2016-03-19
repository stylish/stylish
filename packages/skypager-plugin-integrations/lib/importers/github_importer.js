'use strict';

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
module.exports = function GithubImporter(_ref, _ref2) {
  var _ref$type = _ref.type;
  var type = _ref$type === undefined ? 'all' : _ref$type;
  var _ref$params = _ref.params;
  var params = _ref$params === undefined ? {} : _ref$params;
  var project = _ref2.project;
  var settings = project.settings;

  if (params.repositories || params.repository) {
    // search in the project settings maybe theyre declared there
    if (!project.get('settings.integrations.github')) {
      throw 'Specify which repositories you are importing in the project settings, or in the options you pass to this function';
    }
  }
};