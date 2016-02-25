import { findPackageSync } from '../util'

/**
 * Publish the project to a service such as Surge, or AWS
*/
export function publish (program, dispatch) {
  program
    .command('publish [domain]')
    .description('publish a website for this project to cloud hosting platforms')
    .option('--domain <domain>', 'which domain to publish this to?')
    .option('--public', 'which folder should we publish? defaults to the projects public path')
    .option('--build', 'run the build process first')
    .option('--build-command', 'which build command')
    .option('--service <domain>', 'which service should we publish to? aws, surge.sh, some other domain', 'surge.sh')
    .action(dispatch(handle))
}

export default publish

export function handle(domain, options = {}, context = {}) {
  let { project } = context

  domain = domain || options.domain || project.options.domain || project.get('settings.publishing.domain')
  options.public = options.public || project.paths.public

  options.service = options.service || project.get('settings.publishing.service')

  if (options.service === 'skypager') { options.service = 'skypager.io' }
  if (options.service === 'blueprint') { options.service = 'blueprint.io' }

  if (options.service === 'blueprint.io' || options.service === 'skypager.io') {
    options.endpoint = `surge.${ options.service }`
    surgePlatformHandler(domain, options, context)
  } else if (options.service.match(/surge/i)) {
    surgeHandler(domain, options, context)
  }
}

function surgePlatformHandler(domain, options = {}, context = {}) {
  let cmd = `deploy --project ${ options.public } --domain ${ domain } --endpoint ${ options.endpoint }`

  let proc = require('child_process').spawn('surge', cmd.split(' '))

  process.stdin.pipe(proc.stdin)
  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)
}

function surgeHandler(domain, options = {}, context = {}) {
  let cmd = (`deploy --project ${ options.public } --domain ${ options.domain }`)

  let proc = require('child_process').spawn('surge', cmd.split(' '))

  process.stdin.pipe(proc.stdin)
  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)
}

function awsHandler(domain, options = {}) {
  console.log('TODO: Implement this internally')
}

function abort(msg) {
   console.log(msg.red)
   process.exit(1)
}
