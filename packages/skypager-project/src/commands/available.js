import { pluralize } from '../util'

import { capitalize } from 'lodash'

export function available (program, dispatch) {
  program
    .command('info')
    .description('list available helpers in this project')
    .action(dispatch(handle))
}

export default available

export function handle(options = {}, context = {}) {
  let { project } = context

  console.log('Support Libraries'.magenta)
  console.log('================='.white)

  supportLibraries.forEach(mod => {
    try {
      require(mod)
      console.log(mod.cyan)
      console.log('    found in: ' + require.resolve(mod))
      console.log('')
    } catch (error) {
      console.log(mod + ': ' + 'Missing.'.red )
    }
  })

  console.log('')
  console.log('Available Helpers'.green)
  console.log('================='.white)
  console.log('')

  let regs = Object.keys(project.registries)

  regs.forEach(regName => {
    console.log(`${ capitalize( regName ) }:`.cyan)
    console.log('-----')
    let registry = project.registries[regName]

    registry.available.sort().forEach(val => {
      console.log(`    ${ val }`)
    })

    console.log('')
  })
}

const supportLibraries = [
  'skypager-project',
  'skypager-devpack',
  'skypager-themes',
  'skypager-server'
]
