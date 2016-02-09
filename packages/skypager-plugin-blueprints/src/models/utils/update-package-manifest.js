module.exports = updatePackageManifest

function updatePackageManifest(options = {}, context = {}) {
  const merge = require('lodash/object/merge')
  const doc = options.document || options.asset
  const fs = require('fs-promise')

  Object.assign(doc, {
    updateManifest (changes = {}) {
      let data = doc.sourcePath && doc.readManifest()
      let nextData = merge(data, changes)

      fs.writeFile(
        doc.manifestPath, JSON.stringify(nextData, null, 2)
      ).then(result => {
        console.log('Updated ' + doc.sourcePath)
      })
    }
  })
}
