import colors from 'colors'
import { argv } from 'yargs'

export function run (program, dispatch) {
  program
    .command('run <action> [files...]')
    .description('Run a project action')
    .option('--debug', 'debug the action output')
    .action(dispatch(handle))
}

export default run

export function handle (actionId, files = [], options = {}, context = {}) {
  const { project } = context
  const action = project.actions.lookup(actionId, false)

  if (!action) {
    abort(`could not find and action named ${ actionId }`)
  }

  options.pathArgs = files

  console.log(`Running ${ action.name }`.green)

  let result

  try {
    result = project.run.action(actionId, argv)

    if (options.debug) {
       console.log(result)
    }
  } catch (error) {
    abort(error.message)
  }
}

function abort(message) {
   console.log(message.red)
   process.exit(0)
}
