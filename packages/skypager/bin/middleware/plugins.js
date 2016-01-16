import { join, resolve } from 'path'
import glob from 'glob'

export function getPlugins (request = {}, next) {
  let { exists } = this
  let project = request.project

  if (project) {
    ['actions','exporters','importers','plugins'].forEach(helper => {
      glob.sync('*.js', {cwd: project.paths[helper]}).filter(file => {
        return file !== 'index.js'
      }).map(file => [file.replace('.js',''),join(project.paths[helper], file)]).map(file => {
        project[helper].register(...file)
      })
    })
  }

  next()
}

export default getPlugins
