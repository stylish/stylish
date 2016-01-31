export function init (program, dispatch) {
  program
    .command('init <projectName>')
    .description('create a new skypager project')
    .option('--plugins <list>', 'a comma separated list of plugins to use', list)
    .action(dispatch(handle))
}

export function handle (projectName, options = {}) {

}

export default init

function list(val) {
  return `${ val }`.split(',').map(val => val.toLowerCase().replace(/^\s+|\s+$/,''))
}
