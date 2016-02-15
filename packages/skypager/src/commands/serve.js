import { argv } from 'yargs'
import { start as server } from 'skypager-server'
import { availableProfiles, devpack } from 'skypager-devpack'

export function serve (program, dispatch) {
  program
    .command('serve [profile]')
    .description('start the project server')
    .option('--dashboard', 'display a dashboard view of the server processes')
    .option('--profile', 'which configuration profile to use?', 'web')
    .option('--env', 'which environment should the server run in?', process.env.NODE_ENV || 'development')
    .action(dispatch(handle))
}

export default serve

export function handle(arg, options = {}, context = {}) {
  let { project } = context

  let profile = arg || options.profile || 'web'
  let env = options.env || 'development'
  let dashboard = options.dashboard || false

  server({profile, env, dashboard}, {project, options: argv})
}
