import defaults from 'lodash/object/defaults'
import pick from 'lodash/object/pick'

export const description = 'Multi-page React Webapp with Client-side Routing'

export function ReactWebapp (environment = 'production', project, options = {}) {
  console.log('YO YOY', arguments)

  switch (environment) {
    case development:
      return development(project, options)

    case production:
      return production(project, options)

    default:
      return production(project, options)
  }

  return production(project, options)
}

export default ReactWebapp

export function production(project, options = {}) {
  return defaults({
    pushState: true,
    env: 'production',
    contentHash: true,
    platform: 'web',
    publicPath: '/',
    theme: (
      project.options.theme ||
      project.get('settings.themes.theme') ||
      project.get('settings.themes.base') ||
      options.theme
    )
  }, project.get('settings.build.production'))

}

export function development(project, options = {}) {
  return defaults({
    pushState: true,
    noContentHash: true,
    platform: 'web',
    env: 'development',
    publicPath: '/',
    theme: (
      project.options.theme ||
      project.get('settings.themes.theme') ||
      project.get('settings.themes.base') ||
      options.theme
    )
  }, project.get('settings.build.development'))
}
