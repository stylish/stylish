import mapValues from 'lodash/object/mapValues'
import pick from 'lodash/object/pick'

import * as profiles from './profiles'
import * as presets from './presets'
import * as stages from './stages'

module.exports = {
  availableStages,
  availablePresets,
  availableProfiles,
  devpack
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
  return profiles[profile](environment, project, options)
}

function devpack(action, profile, environment, project, options = {}) {
  let argv = argsFor(profile, environment, project, options)

  if (!action) {
    action = environment === 'production' ? 'build' : 'serve'
  }

  if (options.test) {
    return argv
  }

  if ( action === 'build' || action === 'compile' ) {
    return require('../webpack/compiler')(argv)
  } else if (action === 'develop' || action === 'serve') {
    return require('../webpack/server')(argv)
  }
}
