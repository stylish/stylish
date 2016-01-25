import { join, resolve, dirname } from 'path'

import shell from 'shelljs'
import util from '../util'

export function develop (program, dispatch) {
  program
    .command('develop [entry]')
    .description('run a development server for this project')
    .option('--port <port>', 'which port should this server listen on?', 3000)
    .option('--host <hostname>', 'which hostname should this server listen on?', 'localhost')
    .option('--entry <path>', 'relative path to the entry point', './src')
    .option('--entry-name <name>', 'what to name the entry point script', 'app')
    .option('--platform <name>', 'which platform are we building for? electron or web', 'web')
    .option('--theme <name>', 'the name of the theme to use')
    .option('--html-template-path <path>', 'path to the html template to use')
    .option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc')
    .option('--expose', 'when enabled, will attempt to use ngrok to expose a public API endpoint for this server')
    .option('--expose-config <path>', 'path to a configuration file for the expose service')
    .option('--silent', 'suppress any server output')
    .option('--debug', 'show error info from the server')
    .option('--dev-tools-path <path>', 'path to the skypager-devpack')
    .action(dispatch(handle))
}

export default develop

export function handle (entry, options = {}, context = {}) {
  launchServer(entry, options, context)

  if (options.expose) {
    launchTunnel(options, context)
  }
}

export function launchServer (entry, options = {}, context = {}) {
  let project = context.project

  options.entry = entry || options.entry || './src'
  options.theme = options.theme || project.options.theme || 'default'

  require(`${ pathToDevpack(options.devToolsPath) }/lib/server`)(options)
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

function pathToDevpack (opt) {
  return resolve(opt) || process.env.SKYPAGER_DEVPACK_PATH || dirname(
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
