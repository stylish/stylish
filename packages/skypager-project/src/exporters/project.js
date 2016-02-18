/**
 * Serialize import project information into a JSON Object.
 *
 * @param {Array} includeData which project datasources to include
 *
 */
export function ProjectExporter (params = {}) {
  const project = params.project || this

  const { root, options, cacheKey, paths } = project

  const data = {}

  if (options.includeData) {
    options.includeData.forEach(dataSourceId => {
       let dataSource = project.data_sources.at(dataSourceId)
       data[dataSourceId] = dataSource.data
    })
  }

  return Object.assign(data, {
    options,
    cacheKey,
    paths,
    root
  })
}

export default ProjectExporter
