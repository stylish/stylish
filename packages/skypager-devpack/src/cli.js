import { join, resolve } from 'path'
import mapValues from 'lodash/mapValues'
import pick from 'lodash/pick'

import * as profiles from './webpack/profiles'
import * as presets from './webpack/profiles/presets'
import * as stages from './webpack/profiles/stages'

module.exports = {
  availableStages,
  availablePresets,
  availableProfiles,
  devpack,
  webpack
}

function availableProfiles (project) {
  return (
    mapValues(profiles, (profile) => profile.description)
  )
}

function availableStages (project) {
  return (
    mapValues(stages, (stage) => stage.description)
  )
}

function availablePresets (project) {
  return (
    mapValues(presets, (preset) => preset.description)
  )
}

function argsFor(profile, environment, project, options = {}) {
  return profiles[profile][profile](environment, project, options)
}

function devpack(action, profile, environment, project, options = {}) {
  let argv = argsFor(profile, environment, project, options)

  if (!action) {
    action = environment === 'production' ? 'build' : 'serve'
  }

  if (options.test) {
    return argv
  }

  return webpack(action, argv)
}

function webpack(action, options) {
  console.log(`Running skypager-devpack ${ action } from ${ join(__dirname, '..') }`)
  if ( action === 'build' || action === 'compile' ) {
    return require('./webpack/compiler')(options)
  } else if (action === 'develop' || action === 'serve' || action === 'dev' || action === 'dev-server') {
    return require('./webpack/server')(options)
  }
}
