import colors from 'colors'

import { dirname, join, resolve } from 'path'
import { argv } from 'yargs'

import get from 'lodash/get'

const isDevMode = argv.devMode || process.env.SKYPAGER_ENV === 'development'

import author from './author'
import available from './available'
import build from './build'
import create from './create'
import develop from './develop'
import exporter from './exporter'
import init from './init'
import importer from './importer'
import listen from './listen'
import publish from './publish'
import repl from './repl'
import serve from './serve'

import { loadProjectFromDirectory, skypagerBabel } from '../util'

import pkg from '../../package.json'

const commands = {
   author,
   available,
   build,
   console: repl,
   develop,
   exporter,
   init,
   importer,
   listen,
   publish,
   repl,
   serve
}

const currentDirectory = process.env.PWD

let requestedCommand = argv._[0]

export function program (options = {}) {
  const commander = require('commander')

  commander
    .version(pkg.version)
    .option('--debug', 'enable debugging')
    .option('--env <env>', 'the application environment', process.env.NODE_ENV || 'development')
    .option('--project <path>', 'the folder contains the project you wish to work with')

  configure(commander, options.mode || 'full')

  if (!requestedCommand || commander.commands.map(c => c._name).indexOf(requestedCommand) < 0) {
    // dont duplicate the output
    if (!argv.help) {
     commander.outputHelp()
    }
  }

  return () => commander.parse(process.argv)
}

export default program

export const MODES = {
  full:['author', 'build', 'repl', 'develop', 'exporter', 'init', 'importer', 'serve'],
  setup:['available','repl','init']
}

export function configure (commander, options = {}) {
  let mode = options.mode || 'full'

  const dispatch = (handlerFn) => {
    return (...args) => {
      args.push(context)
      try {
        handlerFn(...args)
      } catch(error) {
        console.log('Command Error:'.red)
        console.log(error.message)
        throw(error)
      }
    }
  }

  let project

  if (mode === 'missing_dependencies') {
    mode = 'init'
  } else {
    project = loadProject(
      argv.project ||
      findNearestPackageManifest() ||
      process.env.PWD
    )
  }

  let config = project && project.manifest && project.manifest.skypager

  let context = {
    commander,
    project,
    config,
    isCLI: true
  }

  let enabled = MODES[mode] || ['repl', 'init']

  enabled.forEach(subcommand => {
    commands[subcommand](commander, dispatch)
  })

  // the project can dynamically add its own cli commands from certain actions
  if (project && project.actions) {
    project.actions
    .filter(action => get(action, 'definition.interfaces.cli'))
    .forEach(action => get(action, 'definition.interfaces.cli').call(action, commander, dispatch))
  }

  return () => commander.parse(argv)
}

function loadProject(fromPath, silent = false) {
  try {
    skypagerBabel()
  } catch(error) {
    console.log(
      'There was an error running the babel-register command. Make sure you have a .babelrc or that babel-preset-skypager is installed.'.red
    )
    process.exit(1)
  }

  try {
    return loadProjectFromDirectory(fromPath || process.env.PWD)
  } catch (error) {
    if (!silent && requestedCommand !== 'init' && requestedCommand !== 'help') {
      console.error(
        `Error loading skypager project. Run this from within a project directory.`.red
      )
      console.log(error)
    }
  }
}

function findNearestPackageManifest() {
  let loc = require('findup-sync')('package.json')

  if (!loc) { return }

  return dirname(loc)
}
