#!/usr/bin/env node

const program = require('commander')

program
  .command('import', 'import a theme into your project')
  .command('list', 'list available themes')
  .parse(process.argv)
