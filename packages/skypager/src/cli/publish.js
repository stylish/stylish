/**
 * Publish the project to a service such as Surge, or AWS
*/
export function publish (program, dispatch) {
  program
    .command('publish [domain]')
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

  domain = domain || options.domain || project.options.domain
  options.public = options.public || project.paths.public

  if (options.service === 'blueprint.io' || options.service === 'skypager.io') {
    options.endpoint = `surge.${ options.service }`
    surgePlatformHandler(domain, options, context)
  } else if (options.service.match(/surge/i)) {
    surgeHandler(domain, options, context)
  }
}

function surgePlatformHandler(domain, options = {}, context = {}) {
  console.log('TODO: Implement this internally')
  console.log('Run this:')
  console.log()
  console.log(`surge deploy --project ${ options.public } --domain ${ domain } --endpoint ${ options.endpoint }`.yellow)
}

function surgeHandler(domain, options = {}, context = {}) {
  console.log('TODO: Implement this internally')
  console.log('Run this:')
  console.log()
  console.log(`surge deploy --project ${ options.public } --domain ${ options.domain }`)
}

function awsHandler(domain, options = {}) {
  console.log('TODO: Implement this internally')
}
