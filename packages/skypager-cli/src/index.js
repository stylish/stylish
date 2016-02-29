import argv from 'yargs'
import { sync as mkdir } from 'mkdirp'
import { findPackageSync } from './util'
import { program } from './commands'
import { checkAll } from './dependencies'

export function cli(options = {}) {
  checkAll()

  if(!findPackageSync('skypager-project')) {
    program({mode: 'missing_dependencies'})()
    return
  }

  program(options)()
  return
}

export default cli
