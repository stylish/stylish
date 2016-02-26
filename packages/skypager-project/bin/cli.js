#!/usr/bin/env node

var join = require('path').join
var cliPath = require('../lib/util').findPackageSync('skypager-cli')

require(
  join(cliPath, 'bin', 'cli.js')
)
