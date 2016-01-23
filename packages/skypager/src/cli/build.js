import { join, dirname } from 'path'

import shell from 'shelljs'
import util from '../util'

export function build (program, dispatch) {
  program
    .command('build [entry]')
    .description('build a website for this project using our preconfigured webpack bundle')
    .option('--entry <path>', 'relative path to the entry point', './src')
    .option('--entry-name <name>', 'what to name the entry point script', 'app')
    .option('--platform <name>', 'which platform are we building for? electron or web', 'web')
    .option('--external-vendors', "assume vendor libraries will be available to our script")
    .option('--no-vendor-libraries', "don't include any vendor libraries in the bundle")
    .option('--theme <name>', 'the name of the theme to use', 'dashboard')
    .option('--output-folder <path>', 'relative path to the output folder', 'public')
    .option('--html-filename <filename>', 'what should we name the html file?', 'index.html')
    .option('--html-template-path <path>', 'path to the html template to use')
    .option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc')
    .option('--push-state', 'use a 200.html file to support push state')
    .option('--content-hash', 'fingerprint the names of the files as a cache busting mechanism', true)
    .action(dispatch(handle))
}

export default build

export function handle(entry, options = {}, context = {}) {
  entry = entry || options.entry
  let binPath = join(pathToDevpack(), 'bin', 'cli.js')
  let cmd = `${ binPath } build ${ process.argv.slice(3).join(' ') }`
  shell.exec(cmd)
}

function pathToDevpack () {
  return dirname(
    require.resolve('skypager-devpack')
  )
}

function isDepackInstalled () {
  try {
    return pathToDevpack()
  } catch (error) {
    return false
  }
}
