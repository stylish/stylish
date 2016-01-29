var skypager = require('skypager')

skypager.loadPlugin('skypager-plugin-blueprints')

module.exports = skypager.load(__filename, {
  manifest: require('./package.json')
});
