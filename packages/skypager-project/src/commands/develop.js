import { join, resolve, dirname } from 'path'
import pick from 'lodash/pick'
import mapValues from 'lodash/mapValues'

/**
 * This is a low level wrapper around webpack dev server and how we use it to build react / bootstrap / redux
 * apps for web, electron, and react-native platforms.
 *
 * Eventually I would rather have several presets which compose these different options together.
*/
export function develop (program, dispatch) {
  program
    .command('dev [preset]')
    .allowUnknownOption(true)
    .description('run server for this project')
    .option('--preset <name>', 'use a preset instead of all of this configuration')
    .option('--port <port>', 'which port should this server listen on?', 3000)
    .option('--host <hostname>', 'which hostname should this server listen on?', 'localhost')
    .action(dispatch(handle))
}

export default develop

export function handle (preset, options = {}, context = {}) {
  let project = context.project

  preset = preset || options.preset
  options.preset = preset

  launchServer(
    preset,
    pick(options, 'host', 'port', 'preset'),
    context
  )

  if (options.ngrok) {
    launchTunnel(options, context)
  }
}


export function launchServer (preset, options = {}, context = {}) {
  let project = context.project

  if (!project) {
    console.log('Can not launch the dev server outside of a skypager project directory. run skypager init first.'.red)
    process.exit(1)
  }

  if (!isDevpackInstalled()) {
    console.log('The skypager-devpack package is required to use the webpack integration.'.red)
    process.exit(1)
  }

  function onCompile(err, stats) {
    project.debug('skypager:afterDevCompile', {
      stats: (stats && Object.keys(stats.toJson()))
    })
  }

  function beforeCompile(err, data) {
    project.debug('skypager:beforeDevCompile', {
      ...data
    })
  }

  if (preset) {
    console.log('Checking for config presets: ' + preset.green)

    let opts = checkForSettings(project,
      `settings.servers.${ preset }.webpack`,
      `settings.servers.${ preset }`,
      `settings.webpack.${ preset }`,
    )

    if (opts) {
     options.devpack_api = 'v2'
     options = Object.assign(options, opts)
    }
  }

  require('skypager-devpack').webpack('develop', options, {beforeCompile, onCompile})
}


export function launchTunnel(options, context) {
  var server = shell.exec(`ngrok http ${ options.port || 3000 }`, {async: true})

  server.stdout.on('data', (data) => {
    console.log(data)
  })

  server.stderr.on('data', (data) => {
    console.log(data)
  })

  server.on('end', () => {
     console.log('Ngrok tunnel ended')
  })
}

function isDevpackInstalled () {
  try {
    require('skypager-devpack')
    return true
  } catch (error) {
    return false
  }
}

const { assign } = Object

function checkForSettings(project, ...keys) {
  let key = keys.find((key) => {
    console.log('Checking for settings in: ' + key.cyan)
    let value = project.get(key)

    if (value) {
      return true
    }
  })

  if(key) {
     console.log('Found ' + key.green)
  }

  return project.get(key)
}
