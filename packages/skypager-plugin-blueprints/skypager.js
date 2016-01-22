var skypager = require('skypager')

skypager.loadPlugin(require.resolve('./index.js'))

module.exports = skypager.load(__filename, {
  manifest: require('./package.json')
})
