var skypager = require('skypager-project')

var project = skypager.load(__filename, {
  manifest: require('./package.json')
})

module.exports = project
