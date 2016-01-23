import { join, dirname } from 'path'

import shell from 'shelljs'
import util from '../util'

export function develop (program, dispatch) {
  program
    .command('develop [entry]')
    .description('run a development server for this project')
    .option('--entry <path>', 'relative path to the entry point', './src')
    .option('--entry-name <name>', 'what to name the entry point script', 'app')
    .option('--platform <name>', 'which platform are we building for? electron or web', 'web')
    .option('--theme <name>', 'the name of the theme to use', 'dashboard')
    .option('--html-template-path <path>', 'path to the html template to use')
    .option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc')
    .option('--expose', 'when enabled, will attempt to use ngrok to expose a public API endpoint for this server')
    .option('--expose-config <path>', 'path to a configuration file for the expose service')
    .action(dispatch(handle))
}

export default develop

export function handle (entry, options = {}, context = {}) {
  let entryPoint = entry || options.entry
  let binPath = join(pathToDevpack(), 'bin', 'cli.js')
  let cmd = `${ binPath } start ${ process.argv.slice(3).join(' ') } --entry ${ entryPoint }`

  shell.exec(cmd)
}

function pathToDevpack () {
  return dirname(
    require.resolve('skypager-devpack')
  )
}

function isDepackInstalled () {
  try {
    return pathToDevpack()
  } catch (error) {
    return false
  }
}
