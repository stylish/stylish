import colors from 'colors'
import { argv } from 'yargs'

export function importer (program, dispatch) {
  program
    .command('import <importer> [files...]')
    .description('run one of the project importers')
    .action(dispatch(handle))
}

export default importer

export function handle (actionId, files, options = {}, context = {}) {
  const { project } = context
  const importer = project.importer(actionId, false)

  if (!importer) {
    abort(`could not find and importer named ${ actionId }`)
  }
}

function abort(message) {
   console.log(message.red)
   process.exit(0)
}
