import yargs from 'yargs'
import { server, defaultSettings as defaultServerSettings } from 'skypager-server'
import { availableProfiles, devpack } from 'skypager-devpack'
import { get } from 'lodash'

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
  let { project, argv } = context

  if (!project) {
    throw('project must be run within a skyager project')
  }

  let settings = project.settings

  let serverSettings = settings.server || defaultServerSettings
  let profile = arg || options.profile || Object.keys(serverSettings)[0] || 'web'
  let env = options.env || process.env.NODE_ENV || 'development'
  let dashboard = options.dashboard || false
  let rawArg = yargs.argv._[1]

  if (rawArg === 'deepstream') {
    require('skypager-server').deepstream({ profile, env }, {project, argv})
  } else if (rawArg === 'webpack') {
    devpack('develop', profile, env, project, get(serverSettings, `${profile}.${env}.webpack`) || {})
  } else {
    server({profile, env, dashboard}, {project, argv})
  }
}

