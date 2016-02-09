import defaults from 'lodash/object/defaults'
import pick from 'lodash/object/pick'

export const description = 'multi-page React app built for Electron'

export function ReactElectron (environment = 'production', project, options = {}) {
  switch (environment) {
    case development:
      return development(project, options)
      break;

    case production:

    default:
      return production(project, options)
  }

  return production(project, options)
}

export default ReactElectron

export function production(project, options = {}) {
  return defaults({
    pushState: true,
    noContentHash: true,
    htmlFileName: 'index.html',
    publicPath: '',
    platform: 'electron',
    theme: (
      project.options.theme ||
      project.get('settings.themes.theme') ||
      project.get('settings.themes.base') ||
      options.theme
    )
  },
  project.get('settings.build.production'))
}

export function development(project, options = {}) {
  return defaults({
    pushState: true,
    noContentHash: true,
    htmlFileName: 'index.html',
    platform: 'electron',
    publicPath: `/`,
    theme: (
      project.options.theme ||
      project.get('settings.themes.theme') ||
      project.get('settings.themes.base') ||
      options.theme
    )
  }, project.get('settings.build.development'))
}
