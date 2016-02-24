import yargs from 'yargs'
import get from 'lodash/get'

export function serve (program, dispatch) {
  program
    .command('serve [profile]')
    .description('start the project server')
    .option('--dashboard', 'display a dashboard view of the server processes')
    .option('--profile', 'which configuration profile to use?', 'web')
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

  const { server, defaultSettings } = require('skypager-server')
  const { availableProfiles, devpack } = require('skypager-devpack')

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

    require('skypager-server').deepstream(opts, context)
  } else {
    server({profile, env, dashboard}, context)
  }
}

function isDevpackInstalled () {
  try {
    require('skypager-devpack')
    return true
  } catch (error) {
    return false
  }
}

function isServerInstalled () {
  try {
    require('skypager-server')
    return true
  } catch (error) {
    console.log('Error requiring skypager-server', error.message)
    return false
  }

}
