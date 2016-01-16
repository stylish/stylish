var manifest = require('./package.json'), skypager = require('skypager');

var project = skypager.load(__filename, {
  manifest: manifest
})

module.exports = project
