import defaults from 'lodash/object/defaults'
import pick from 'lodash/object/pick'
import get from 'lodash/object/result'

const description = 'multi-page React app built for Electron'

module.exports = {
  react_electron,
  description
}

function react_electron (env, project, options = {}) {
  return env === 'production' ? production(project, options) : development(project, options)
}

function production(project, options = {}) {
  return defaults({
    contentHash: false,
    env: 'production',
    htmlFileName: 'index.html',
    publicPath: '',
    platform: 'electron',
    theme: (
      get(project, 'options.theme') ||
      get(project, 'settings.themes.theme') ||
      get(project, 'settings.themes.base') ||
      options.theme
    )
  },
  project.get('settings.build.production'))
}

function development(project, options = {}) {
  return defaults({
    contentHash: false,
    env: 'development',
    htmlFileName: 'index.html',
    platform: 'electron',
    publicPath: `/`,
    theme: (
      get(project, 'options.theme') ||
      get(project, 'settings.themes.theme') ||
      get(project, 'settings.themes.base') ||
      options.theme
    )
  }, project.get('settings.build.development'))
}
