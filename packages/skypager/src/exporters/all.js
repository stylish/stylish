export const EXPORTERS = [
  'assets',
  'content',
  'entities',
  'models',
  'project'
]

export function ExportAll (params = {}) {
  const project = params.project = (params.project || this)

  project.allAssets.forEach(asset => {
    try {
      if (!asset.raw) { asset.runImporter('disk', {sync: true}) }
    } catch (error) {
      console.log(`error importing asset: ${ asset.id }`)
      throw(error)
    }
  })

  return EXPORTERS.reduce((memo, exporter) => {
    return Object.assign(memo, {
      [exporter]: project.run.exporter(exporter, params)
    })
  }, {})
}

export default ExportAll
