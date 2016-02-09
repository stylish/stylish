import defaults from 'lodash/object/defaults'
import pick from 'lodash/object/pick'
import get from 'lodash/object/result'

const description = 'Multi-page React Webapp with Client-side Routing'

module.exports = {
  react_webapp,
  description
}

function react_webapp (env, project, options = {}) {
  return env === 'production' ? production(project, options) : developmen(project, options)
}

function production(project, options = {}) {
  return defaults({
    contentHash: true,
    env: 'production',
    platform: 'web',
    publicPath: '/',
    pushState: true,
    theme: (
      get(project, 'options.theme') ||
      get(project, 'settings.themes.theme') ||
      get(project, 'settings.themes.base') ||
      options.theme
    )
  }, project.get('settings.build.production'))

}

function development(project, options = {}) {
  return defaults({
    env: 'development',
    contentHash: false,
    platform: 'web',
    pushState: true,
    publicPath: '/',
    theme: (
      get(project, 'options.theme') ||
      get(project, 'settings.themes.theme') ||
      get(project, 'settings.themes.base') ||
      options.theme
    )
  }, project.get('settings.build.development'))
}
