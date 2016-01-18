#!/usr/bin/env babel-node

const path = require('path')
const pkg = require('../package.json')
const dependencies = Object.keys(pkg.dependencies)
const skypagers = dependencies.filter(dep => dep.match(/^skypager/))
const spawn = require('child_process').spawnSync

skypagers.forEach(p => {
  console.log('Linking ' + p)

  // go into the project and make sure it is setup to be linkable
  spawn('npm', ['link'], {
    cwd: path.join(__dirname, '../packages/' + p)
  })

  // link to the above
  spawn('npm', ['link', p], {
    cwd: path.join(__dirname, '..')
  })
})
