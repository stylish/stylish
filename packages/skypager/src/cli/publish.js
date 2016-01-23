/**
 * Publish the project to a service such as Surge, or AWS
*/
export function publish (program, dispatch) {
  program
    .command('publish [domain]')
    .option('--domain <domain>', 'which domain to publish this to?')
    .option('--public', 'which folder should we publish? defaults to the projects public path')
    .option('--build', 'run the build process first')
    .option('--service', 'which service should we publish to? the skypager platform or aws', 'skypager')
    .action(dispatch(handle))
}

export default publish

export function handle(options = {}, context = {}) {
  console.log('todo implement publish cli using surge')
}

function surgeHandler(options = {}) {

}

function awsHandler(options = {}) {

}
