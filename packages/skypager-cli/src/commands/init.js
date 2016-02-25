import { dump as toYaml } from 'js-yaml'
import { pathExists } from '../util'
import { join } from 'path'

const VERSION = require('../../package.json').version

export function init (program, dispatch) {
  program
    .command('init <projectName> [destination]')
    .description('create a new skypager project')
    .allowUnknownOption(true)
    .option('--overwrite','whether or not to replace a project that exists')
    .option('--destination','')
    .option('--plugins <list>', 'a comma separated list of plugins to use', list)
    .option('--portfolio', 'this project is a portfolo')
    .action(function(projectName, options) {
      handle(projectName, options)
    })
}

export function handle (projectName, destination, options = {}, context = {}) {
  const { resolve, join } = require('path')
  const mkdir = require('mkdirp').sync

  destination = destination || options.destination || resolve(join(process.env.PWD, projectName))

  if (pathExists(destination) && !options.overwrite) {
    abort('path already exists')
  }

  let source = options.portfolio
    ? join(__dirname, '../../packages', 'portfolio-template.asar')
    : join(__dirname, '../../packages', 'project-template.asar')

  console.log('Extracting Template...', source)

  try {
    require('asar').extractAll(source, destination)
  } catch(error) {
    abort(
      'Error extracting template: ' + error.message
    )
  }

  try {
    let packageJson = require(
       join(destination, 'package.json')
    )

    packageJson.name = projectName

    require('fs').writeFileSync(
      join(destination, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf8'
    )

  } catch(error) {
     abort('Error modifying package: ' + error.message)
  }

  if (!options.skipInstall) {
    try {
      console.log('Running NPM Install. This may take a bit.')
      let child = require('child_process').spawn(
         'npm',
         ['install', '--no-progress'],
         { cwd: destination, stdio:['inherit'] }
      )

      child.stdout.on('data', (d) => console.log(d.toString()))
      child.stderr.on('data', (d) => console.log(d.toString()))
    } catch(error) {
      abort('Error running npm install: ' + error.message)
    }
  }

  console.log('Finished!')
}

export default init


function list(val) {
  return `${ val }`.split(',').map(val => val.trim().toLowerCase())
}

function abort(msg) {
   console.log(msg).red
   process.exit(1)
}
