import mapValues from 'lodash/object/mapValues'
import pick from 'lodash/object/pick'

import * as profiles from './profiles'
import * as presets from './presets'
import * as stages from './stages'

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
  if ( action === 'build' || action === 'compile' ) {
    console.log('options', options)
    return require('./webpack/compiler')(options)
  } else if (action === 'develop' || action === 'serve' || action === 'dev' || action === 'dev-server') {
    console.log('options', options)
    return require('./webpack/server')(options)
  }
}
