var join = require('path').join,
    exists = require('fs').existsSync

var Skypager = require('skypager')

var project = Skypager.load(__filename, {
  name: 'Skypager App Builder',
  autoImport: true
})

project.exporters.load(require.resolve('./exporters/prepare_snapshot'))

module.exports = project
