import argv from 'yargs'
import { sync as mkdir } from 'mkdirp'
import { findPackageSync } from './util'
import { program } from './commands'
import { checkAll } from './dependencies'

export function cli(options = {}) {
  checkAll()

  options.frameworkHost = options.frameworkHost || 'skypager-project'

  if(!findPackageSync(options.frameworkHost)) {
    program({mode: 'missing_dependencies'})()
    return
  }

  if (typeof options.frameworkHost !== 'string' && options.frameworkHost !== 'skypager-project') {
    process.env.SKYPAGER_FRAMEWORK_HOST = options.frameworkHost
  }

  program(options)()
  return
}

export default cli
