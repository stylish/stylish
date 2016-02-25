import { join, resolve, dirname } from 'path'
import pick from 'lodash/pick'
import mapValues from 'lodash/mapValues'
import uniq from 'lodash/uniq'

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
    .option('--host <hostname>', 'which hostname should this server listen on?', 'localhost')
    .option('--output-folder <path>', 'relative path to the output folder', 'public')
    .option('--platform <name>', 'which platform are we building for? electron or web', 'web')
    .option('--port <port>', 'which port should this server listen on?', 3000)
    .option('--preset <name>', 'use a preset instead of all of this configuration')
    .option('--theme <name>', 'the name of the theme to use', 'dashboard')
    .action(dispatch(handle))
}

export default develop

export function handle (preset, options = {}, context = {}) {
  let project = context.project

  preset = preset || options.preset || 'web'
  options.preset = preset

  launchServer(
    preset,
    pick(options, 'host', 'port', 'preset'),
    context
  )
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

  if (!preset) {
    console.log('Must specify a config preset.'.yellow)
    console.log('Available options:')
    console.log(
      available(project,
        'settings.webpack',
        'settings.servers'
      )
    )
    process.exit(1)
  }

  let opts = checkForSettings(project,
    `settings.webpack.${ preset }`,
    `settings.servers.${ preset }.webpack`,
    `settings.servers.${ preset }`
  )

  const devpack = require(
    ($skypager && $skypager['skypager-devpack']) ||
    process.env.SKYPAGER_DEVPACK_ROOT ||
    'skypager-devpack'
  )

 if (!opts) {
    console.log('Missing config. Creating default config in: ' + `settings/build/${ preset }`.green)
    project.content.settings_files.createFile(
      `settings/webpack/${ preset }.yml`,
      yaml(
        devpack.argsFor(preset, process.env.NODE_ENV || 'development')
      )
    )
  }


  options.devpack_api = 'v2'
  options = Object.assign(options, opts)

  devpack.webpack('develop', options, {beforeCompile, onCompile})
}

function yaml(obj) {
   return require('js-yaml').dump(obj)
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
  let tryPath = ($skypager && $skypager.devPack) ||
    ($skypager && $skypager['skypager-devpack']) ||
    process.env.SKYPAGER_DEVPACK_ROOT ||
    attempt('skypager-devpack')

  if (!tryPath) {
    return false
  }

  try {
    if (tryPath) {
      require(tryPath)
    }
    return true
  } catch (error) {
    return false
  }
}


const { assign } = Object

function attempt(packageRequire) {
  try {
   return require.resolve(packageRequire)
  } catch(e){ return false }
}

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

function available(project, ...keys) {
  return uniq(
    keys.reduce((memo,test) => {
      return memo.concat(
        Object.keys(
          project.get(test) || {}
        )
      )
    },[])
  ).sort().join(',')
}
