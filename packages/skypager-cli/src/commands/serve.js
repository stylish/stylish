import yargs from 'yargs'
import get from 'lodash/get'

const { assign } = Object

export function serve (program, dispatch) {
  program
    .command('serve [profile]')
    .allowUnknownOption(true)
    .description('start the project server')
    .option('--dashboard', 'display a dashboard view of the server processes')
    .option('--profile', 'which configuration profile to use?', 'web')
    .option('--port <port>', 'which port to listen on?')
    .action(dispatch(handle))
}

export default serve

export function handle(arg, options = {}, context = {}) {
  let { project } = context

  if (!project) {
    throw('project must be run within a skyager project')
  }

  if (!isServerInstalled()) {
     console.log('This command requires the skypager-server package'.red)
     process.exit(1)
  }

  const { server, deepstream, defaultSettings } = require(
    ($skypager && $skypager['skypager-server']) ||
    ($skypager && $skypager.server) ||
    process.env.SKYPAGER_SERVER_ROOT ||
    'skypager-server'
  )

  const { availableProfiles, devpack } = require(
    ($skypager && $skypager['skypager-devpack']) ||
    ($skypager && $skypager.devPack) ||
    process.env.SKYPAGER_DEVPACK_ROOT ||
    'skypager-devpack'
  )

  let settings = project.settings

  let serverSettings = settings.server || defaultSettings
  let profile = arg || options.profile || Object.keys(serverSettings)[0] || 'web'
  let env = options.env || process.env.NODE_ENV || 'development'
  let dashboard = options.dashboard || false
  let rawArg = yargs.argv._[1]

  let opts = {}
  context.argv = yargs.argv

  if (rawArg === 'deepstream') {
    opts = get(project, `settings.servers.deepstream.${ profile }`) ||
           get(project, `settings.servers.${ profile }.deepstream`) ||
           get(project, `settings.deepstream.${ profile }`) ||
           get(project, 'settings.deepstream')

    deepstream(opts, context)
  } else {
    server({profile, env, dashboard}, context)
  }
}

function isServerInstalled () {
  let tryPath = ($skypager && $skypager.server) ||
    ($skypager && $skypager['skypager-server']) ||
    process.env.SKYPAGER_SERVER_ROOT ||
    attempt('skypager-server')

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


function attempt(packageRequire) {
  try {
   return require.resolve(packageRequire)
  } catch(e){ return false }
}

