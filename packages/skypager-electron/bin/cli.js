#!/usr/bin/env node

const colors = require('colors')
const path = require('path')
const exists = require('fs').existsSync
const skypager = require(path.join(__dirname,'..','..','skypager','package.json'))
const pkg = path.join(process.env.PWD,'package.json')
const spawn = require('child_process').spawn
const appRoot = path.join(__dirname, '..')

if (!exists(pkg)) {
  abort('Must call this from within a project folder')
}

const program  = require('commander')

program
  .version(skypager.version)
  .usage(`skypager-electron COMMAND [OPTIONS]`)

program
  .command('develop [OPTIONS]')
  .action(function(cmd, options) {
    var electron = require('electron-prebuilt')

    var proc = spawn(electron, [appRoot].concat(process.argv.slice(2)), {
      cwd: process.env.PWD
    })

    proc.stdout.on('data', logOutput)
    proc.stderr.on('data', logError)

    proc.on('end', function(){
       process.exit(0)
    })
  })

program.parse(process.argv)

function logOutput (stream) {
   console.log(stream.toString())
}

function logError (stream) {
   console.log('Error'.red, stream.toString())
}

function abort (message) {
  console.log(message.red)
  process.exit(1)
}
