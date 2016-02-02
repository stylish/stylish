import colors from 'colors'

export function author (program, dispatch) {
  program
    .command('author')
    .description('run the author app')
    .action(dispatch(handle))
}

export default author

export function handle(options = {}, context = {}) {
  let { project } = context

  let electron = isElectronInstalled()
  let skypagerElectron = isSkypagerElectronInstalled()

  if (!electron) {
    console.log('Please install the electron-prebuilt package'.red)
    process.exit(1)
  }

  if (!skypagerElectron) {
    console.log('Please install the skypager-electron package'.red)
    process.exit(1)
  }

  let proc = require('child_process').spawn(
    electron,
    [ skypagerElectron ].concat(process.argv.slice(2))
  )

  proc.stdout.on('data', (data) => console.log(data.toString()))
  proc.stderr.on('data', (data) => console.log(data.toString()))
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
    console.log('Error!', error.message)
     return false
  }
}
