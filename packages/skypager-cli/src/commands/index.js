import colors from 'colors'

import { dirname, join, resolve } from 'path'
import { argv } from 'yargs'

import get from 'lodash/get'

const isDevMode = argv.devMode || process.env.SKYPAGER_ENV === 'development'

import electron from './electron'
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
   electron,
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
  if ($skypager && argv.debugPaths) {
    console.log(
      JSON.stringify($skypager, null, 2)
    )

    process.exit(0)
  }

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
  full:['electron', 'build', 'repl', 'develop', 'exporter', 'init', 'importer', 'serve'],
  setup:['available','repl','init']
}

export function configure (commander, options = {}) {
  let mode = options.mode || 'full'

  const dispatch = (handlerFn) => {
    return (...args) => {
      args.push(context)
      try {
        let report = handlerFn(...args)

        if (report && report.errors.length > 0) {
           console.log('Command threw an error'.red)

           console.log(JSON.stringify({
              errors: report.errors,
              warnings: report.warnings,
              suggestions: report.suggestions,
              success: report.success
           }, null, 2))
        }
      } catch(error) {
        console.log('Command Error:'.red)
        console.log(error.message)
        throw(error)
      }
    }
  }

  let project

  console.log('Attempting to resolve project...'.cyan)

  let projectFile = (
    argv.project ||
    findNearestPackageManifest() ||
    process.env.PWD
  )

  console.log('Using project file: ' + projectFile)

  if (mode === 'missing_dependencies') {
    mode = 'init'
  } else {
    try {
      project = loadProject(projectFile)
    } catch(error) {
      console.log('Error loading project:'.red, error.message)
      console.log(error.stack)
    }
  }

  if (!project) {
     console.log('Could not build a project object from this path: ' + projectFile.yellow)
  }

  let config = project && project.manifest && project.manifest.skypager

  if (config) {
    console.log('Skypager config found in manifest'.green)
    console.log(
       JSON.stringify(config)
    )
  }

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
    let cliActions = project.actions.filter(action => get(action, 'definition.interfaces.cli'))

    if (cliActions.length > 0) {
      console.log('Found ' + cliActions.length + ' actions which expose a CLI interface')
      cliActions.forEach(action => get(action, 'definition.interfaces.cli').call(action, commander, dispatch))
    }
  }

  return () =>
    commander.parse(argv)
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
      console.error(`Error loading skypager project.`.red)
      console.log(`Attempted to load from ${ fromPath.yellow }. Run this from within a project directory and make sure the ${ 'skypager-project'.magenta } is installed.`)
      console.log('The exact error thrown was '.yellow, "\n\n", error.message.red, "\n\n\n", error.stack)
    }
  }
}

function findNearestPackageManifest() {
  let loc = require('findup-sync')('package.json')

  if (!loc) { return }

  return dirname(loc)
}
