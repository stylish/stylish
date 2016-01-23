import { join, dirname } from 'path'

import shell from 'shelljs'
import util from '../util'

export function develop (program, dispatch) {
  program
    .command('develop [entry]')
    .description('run a development server for this project')
    .option('--port <port>', 'which port should this server listen on?', 3000)
    .option('--entry <path>', 'relative path to the entry point', './src')
    .option('--entry-name <name>', 'what to name the entry point script', 'app')
    .option('--platform <name>', 'which platform are we building for? electron or web', 'web')
    .option('--theme <name>', 'the name of the theme to use', 'dashboard')
    .option('--html-template-path <path>', 'path to the html template to use')
    .option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc')
    .option('--expose', 'when enabled, will attempt to use ngrok to expose a public API endpoint for this server')
    .option('--expose-config <path>', 'path to a configuration file for the expose service')
    .option('--silent', 'suppress any server output')
    .option('--debug', 'show error info from the server')
    .action(dispatch(handle))
}

export default develop

export function handle (entry, options = {}, context = {}) {
  console.log('Launching dev server')
  launchServer(entry, options, context)

  if (options.expose) {
    console.log('Launching tunnel')
    launchTunnel(options, context)
  }
}

export function launchServer (entry, options = {}, context = {}) {
  let entryPoint = entry || options.entry
  let cmd = `skypager-devpack start ${ process.argv.slice(3).join(' ') } --entry ${ entryPoint }`

  var server = shell.exec(cmd, {async: true})

  server.stdout.on('data', (data) => {
    if(!options.silent) {
      console.log(data)
    }
  })

  server.stderr.on('data', (data) => {
    if(options.debug) {
      console.log(data)
    }
  })
}

export function launchTunnel(options, context) {
  var server = shell.exec(`ngrok http ${ options.port }`, {async: true})

  server.stdout.on('data', (data) => {
    if(!options.silent) {
      console.log(data)
    }
  })

  server.stderr.on('data', (data) => {
    if(options.debug) {
      console.log(data)
    }
  })
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
