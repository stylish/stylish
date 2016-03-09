import defaults from 'lodash/defaultsDeep'

const versions = {
  v1: require('../default_settings.json')
}

export function DefaultSettings (options = {}) {
  let version = versions[options.version || 'v1'] || versions.v1

  return defaults({}, { ...(version) }, options)
}

export default DefaultSettings
