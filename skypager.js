var skypager = require('./packages/skypager')

module.exports = skypager.load(__filename, {
  manifest: require('./package.json')
})
