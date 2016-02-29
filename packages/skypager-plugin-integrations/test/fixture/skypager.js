var skypager = require('../../../skypager-project')
var plugin = require('../../lib/index')
var join = require('path').join

skypager.loadPlugin(plugin)

module.exports = skypager.load(__filename)
