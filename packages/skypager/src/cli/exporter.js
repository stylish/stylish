import colors from 'colors'
import { argv } from 'yargs'

export function exporter (program, dispatch) {
  program
    .command('export <exporter>')
    .description('run one of the project exporters')
    .option('--output <path>', 'where to save the contents')
    .option('--pretty', 'where to save the contents')
    .option('--format <format>', 'which format should the output be serialized in', 'json')
    .action(dispatch(handle))
}

export default exporter

export function handle (exporterId, options = {}, context = {}) {
  const { project } = context
  const exporter = project.registries.exporters.lookup(exporterId, false)

  if (!exporter) {
    abort(`could not find and exporter named ${ exporterId }`)
  }

  const params = Object.assign({}, argv, {project})

  let payload = project.run.exporter(exporterId, params)

  if (options.format === 'json' && options.pretty) {
     payload = JSON.stringify(payload, null, 2)
  } else if (options.format === 'json') {
     payload = JSON.stringify(payload)
  }

  console.log(payload)
}

function abort(message) {
   console.log(message.red)
   process.exit(0)
}
