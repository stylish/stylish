import mapValues from 'lodash/object/mapValues'
import pick from 'lodash/object/pick'

import * as profiles from './profiles'
import * as presets from './presets'

export function availableProfiles (project) {
  return (
    mapValues(profiles, (profile) => profile.description)
  )
}

export function availablePresets (project) {
  return (
    mapValues(presets, (profile) => preset.description)
  )
}

export function argsFor(action, profile, environment, project, options = {}) {
  return profiles[profile](environment, project, options)
}

export function devpack(action = 'compile', profile, environment, project, options = {}) {
  let argv = argsFor(profile, environment, project, options)

  if ( action === 'build' || action === 'compile' ) {
    return require('../webpack/compiler')(argv)
  } else if (action === 'develop' || action === 'serve') {
    return require('../webpack/server')(argv)
  }
}

export default devpack
