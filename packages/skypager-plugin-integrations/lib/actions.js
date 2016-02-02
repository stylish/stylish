'use strict';

module.exports = function LoadsActions(actions) {
  actions.load(require('./actions/fetch_segment_db'), {
    uri: require.resolve('./actions/fetch_segment_db'),
    id: 'segment/fetch'
  });
};