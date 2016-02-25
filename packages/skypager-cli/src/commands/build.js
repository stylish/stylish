import { join, dirname } from 'path'

import shell from 'shelljs'
import util from '../util'
import uniq from 'lodash/uniq'

export function build (program, dispatch) {
  program
    .command('build [preset]')
    .allowUnknownOption(true)
    .description('build a website for this project using our preconfigured webpack bundle')
    .option('--output-folder <path>', 'relative path to the output folder', 'public')
    .option('--preset <name>', 'use a preset instead of all of this configuration')
    .option('--platform <name>', 'which platform are we building for? electron or web', 'web')
    .option('--theme <name>', 'the name of the theme to use', 'dashboard')
    .action(dispatch(handle))
}

export default build

export function handle(preset, options = {}, context = {}) {
  process.env.NODE_ENV = 'production'

  if (!isDevpackInstalled()) {
    console.log('The skypager-devpack package is required to use the webpack integration.'.red)
    process.exit(1)
  }

  let project = context.project

  if (!project) {
    console.log('Can not launch the dev server outside of a skypager project directory. run skypager init first.'.red)
    process.exit(1)
  }

  preset = preset || options.preset
  options.preset = preset

  function beforeCompile({config, argv}) {
    project.debug('skypager:beforeCompile', {
      ...argv,
      config
    })
  }

  function onCompile(err, stats) {
    project.debug('skypager:afterCompile', {
      stats: (stats && Object.keys(stats.toJson()))
    })
  }

  if (!preset) {
    console.log('Must specify a config preset.'.yellow)
    console.log('Available options:')
    console.log(
      available(project,
        'settings.build',
        'settings.builds',
        'settings.webpack'
      )
    )
    process.exit(1)
  }

  console.log('Checking for config presets: ' + preset.green)

  let opts = checkForSettings(project,
    `settings.build.${ preset }.webpack`,
    `settings.build.${ preset }`,
    `settings.builds.${ preset }.webpack`,
    `settings.builds.${ preset }`,
    `settings.webpack.${ preset }.build`,
    `settings.webpack.${ preset }`,
  )

  if (!opts) {
    console.log('Missing config. Creating default config in: ' + `settings/build/${ preset }`.green)
    project.content.settings_files.createFile(
      `settings/build/${ preset }.yml`,
      yaml(
        require('skypager-devpack').argsFor(preset, 'production')
      )
    )
  }

  options.devpack_api = 'v2'
  options = Object.assign(options, opts)

  let devpack = require(
    ($skypager && $skypager['skypager-devpack']) ||
    process.env.SKYPAGER_DEVPACK_ROOT ||
    'skypager-devpack'
  )

  devpack.webpack('build', options, {beforeCompile, onCompile})
}

function isDevpackInstalled () {
  let tryPath = ($skypager && $skypager.devPack) ||
    ($skypager && $skypager['skypager-devpack']) ||
    process.env.SKYPAGER_DEVPACK_ROOT ||
    attempt('skypager-devpack')

  if (!tryPath) {
    return false
  }

  try {
    if (tryPath) {
      require(tryPath)
    }
    return true
  } catch (error) {
    return false
  }
}

function attempt(packageRequire) {
  try {
   return require.resolve(packageRequire)
  } catch(e){ return false }
}

function checkForSettings(project, ...keys) {
  let key = keys.find((key) => {
    console.log('Checking for settings in: ' + key.cyan)
    let value = project.get(key)

    if (value) {
      return true
    }
  })

  if(key) {
     console.log('Found ' + key.green)
  }

  return project.get(key)
}

function available(project, ...keys) {
  return uniq(
    keys.reduce((memo,test) => {
      return memo.concat(
        Object.keys(
          project.get(test) || {}
        )
      )
    },[])
  ).sort().join(',')
}

function yaml(obj) {
   return require('js-yaml').dump(obj)
}
