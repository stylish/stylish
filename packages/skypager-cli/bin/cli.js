#!/usr/bin/env node

var join = require('path').join
var findPackage = require('../lib/util').findPackageSync

if (process.env.SKYPAGER_ENV === 'development') {
  require('babel-register')({
    presets:[
      findPackage('babel-preset-skypager')
    ]
  })

  require('../src/index').cli()
} else {
  require('../lib/index').cli()
}
