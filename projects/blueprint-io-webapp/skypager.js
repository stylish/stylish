var skypager = require('skypager')

module.exports = skypager.load(__filename, {
  manifest: require('./package.json'),
  paths: {
    models: 'project/models',
    exporters: 'project/exporters'
  }
});
