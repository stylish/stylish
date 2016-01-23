import { pluralize } from '../util'

export function available (program, dispatch) {
  program
    .command('available [helperType]')
    .description('list available helpers in this project')
    .option('--type <helperType>', 'the type of helpers you want to list. valid options are action, context, exporter, importer, model, plugin, renderer, store, view')
    .action(dispatch(handle))
}

export default available

export function handle(type, options = {}, context = {}) {
  let helperType = type || options.type
  let { project } = context

  helperType = pluralize(helperType).toLowerCase()

  console.log(`Available ${ helperType }`.green + ':')

  let registry = project.registries[helperType]

  registry.available.sort().forEach(val => {
    console.log(val)
  })
}
