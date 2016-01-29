module.exports = sourcePathReader

function sourcePathReader(options, context) {
  const doc = options.document || options.asset
  const { existsSync, readFileSync } = require('fs')
  const join = require('path').join

  Object.assign(doc, {
    readManifest() {
      if (doc.sourcePath && doc.sourcePath.length > 0 && existsSync(doc.manifestPath) ) {
        return JSON.parse(readFileSync(doc.manifestPath).toString())
      }
    },

    get manifestPath () {
      return this.sourcePath + '/package.json'
    },

    get sourcePath () {
      let data = doc.data
      let sourcePath = data.sourcePath

      if (sourcePath && sourcePath.length > 0) {
        return project.join(sourcePath)
      }
    }
  })

  return doc
}

