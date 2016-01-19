#!/usr/bin/env node

process.env.NODE_ENV = 'production'

const program = require('commander')
const path = require('path')
const webpack = require('webpack')

program
  //.version()
  .parse(process.argv)

const directory = path.resolve('.')
const config = require('../index').resolve()

const compiler = webpack(config)

// compiler.apply(new webpack.ProgressPlugin())
compiler.run((err, stats) => {
  if (err) {
    console.log(err)
    process.exit(1)
  } else {
    process.exit(0)
  }
})
