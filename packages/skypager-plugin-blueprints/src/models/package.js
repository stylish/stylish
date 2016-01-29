describe('Package', (Package) => { })

exports.decorate = function decorate(options = {}, context = {}) {
  return require('./utils/source-paths')(options, context)
}

exports.create = function create (options = {}, context = {}) {
  let { document } = options
  let { project } = context
  let { id, data, documentTitle, sourcePath, mainCopy } = document

  return {
    id,
    data,
    title: documentTitle,
    sourcePath,
    mainCopy,
    manifest: document.readManifest()
  }
}
