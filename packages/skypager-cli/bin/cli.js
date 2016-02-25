#!/usr/bin/env node

if (process.env.SKYPAGER_ENV === 'development') {
  require('babel-register')
  require('../src').cli()
} else {
  require('../lib').cli()
}
