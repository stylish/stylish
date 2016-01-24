export function create (program, dispatch) {
  program
    .command('create <type> [name]')
    .option('--type <type>', 'which type of helper or entity')
    .action(dispatch(handle))
}

export default create

function handle (type, name, options = {}, context = {}) {
  console.log('todo implement create')
}
