var skypager = require('skypager-project')

skypager.loadPlugin(
  require('../../src')
)

module.exports = skypager.load(__filename)

