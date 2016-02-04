import colors from 'colors'
import { resolve } from 'path'
import { existsSync as exists } from 'fs'

export function author (program, dispatch) {
  program
    .command('author [workspace]')
    .option('--main <require>', 'require this script in the electron main process')
    .option('--workspace <name>', 'use a different workspace', 'main')
    .option('--interactive', 'run an interactive REPL')
    .option('--dont-boot', 'dont boot the electron app (DEV HELPER)')
    .description('run an author workspace app')
    .action(dispatch(handle))
}

export default author

export function handle(workspace, options = {}, context = {}) {
  let { project } = context

  let electron = isElectronInstalled()
  let skypagerElectron = isSkypagerElectronInstalled()

  if (!electron) {
    abort('make sure electron-prebuilt is available.  You can specify a path manually via the ELECTRON_PREBUILT_PATH env var')
  }

  if (!skypagerElectron) {
    abort('Make sure the skypager-electron package is available. You can specify a path manually via the SKYPAGER_ELECTRON_PATH env var')
  }

  let authorArgs = process.argv.slice(2)

  workspace = workspace || options.workspace || 'main'

  authorArgs.push('--workspace', workspace)

  if (project) {
    authorArgs.push('--project', project.root)
  }

  let proc = require('child_process').spawn(
    electron,
    [ skypagerElectron ].concat(authorArgs)
  );

  if (options.interactive) {
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
    process.stdin.pipe(proc.stdin)
  } else {
    proc.stdout.on('data', (data) => console.log(data.toString()))
    proc.stderr.on('data', (data) => console.log(data.toString()))
  }
}

function isSkypagerElectronInstalled () {
  try {
    return require('path').dirname(require.resolve('skypager-electron'))
  } catch (error) {
     return false
  }
}

function isElectronInstalled () {
  try {
    return require('electron-prebuilt')
  } catch (error) {
    return false
  }
}

function abort (msg, ...rest) {
  console.log()
  console.log(`${msg}`.red)
  console.log(...rest)
  process.exit(1)
}
