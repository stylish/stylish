import colors from 'colors'
import { argv } from 'yargs'

export function run (program, dispatch) {
  program
    .command('run <action> [files...]')
    .action(dispatch(handle))
}

export default run

export function handle (actionId, files, options = {}, context = {}) {
  const { project } = context
  const action = project.actions.lookup(actionId, false)

  if (!action) {
    abort(`could not find and action named ${ actionId }`)
  }
}

function abort(message) {
   console.log(message.red)
   process.exit(0)
}
