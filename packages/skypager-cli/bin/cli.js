#!/usr/bin/env node

var join = require('path').join

require('../lib/dependencies').checkAll()

$skypager['skypager-cli'] = $skypager.cli = require('../lib/util').findPackageSync('skypager-cli') || join(__dirname, '..')

if (process.env.SKYPAGER_ENV === 'development') {
  require('babel-register')

  require(
    join($skypager.cli, 'src')
  ).cli()
} else {
  require('babel-register')

  require(
    join($skypager.cli, 'lib')
  ).cli()
}
