'use strict';

module.exports = function LoadsModels(models) {
  models.load(require('./models/integration'), {
    id: 'integration',
    uri: require.resolve('./models/integration')
  });
};