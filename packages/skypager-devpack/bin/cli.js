#!/usr/bin/env node

const program = require('commander')

program
  //.version()
  .command('start', 'Start development server')
  .command('build', 'Production build')
  .command('publish', 'Publish to the web')
  .parse(process.argv)
