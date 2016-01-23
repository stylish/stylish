export function run (program, dispatch) {
  program
    .command('run <helper> [type]')
    .option('--type', 'what type of helper is it? app, action, importer, exporter', 'action')
    .action(dispatch(handle))
}

export default run

export function handle (helper, helperType, options = {}, context = {}) {
  console.log('todo handle run cli')
}
