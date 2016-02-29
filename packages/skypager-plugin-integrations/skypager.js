var skypager = require('../skypager-project/src/index.js')

module.exports = skypager.load(__filename, {
  manifest: require('./package.json')
})
