var skypager = require('skypager-project')
var reactDocs = require('react-docgen')

// Most of the scripts in this library are react components.
// We can parse them without evaluating them and learn important things about their interface
Object.assign(skypager.Assets.Script.prototype, {
  parser(raw) {
    try {
      let clean = raw.replace(/export default.*/, '')
      return reactDocs.parse(clean)
    } catch(error) {
      return {
        error: error.message
      }
    }
  }
})

var project = module.exports = skypager.load(__filename)

skypager.exporters.load(
  require('./exporters/component_interfaces'), {
    id: 'component_docs',
    uri: require.resolve('./exporters/component_interfaces')
  }
)

Object.assign(project.scripts, {
  get components() {
    return project.scripts.query(script => script.isIndex && script.categoryFolder === 'components')
  },
  get entries() {
    return project.scripts.query(script => script.isIndex && script.categoryFolder === 'entries')
  },
  get layouts() {
    return project.scripts.query(script => script.isIndex && script.categoryFolder === 'layouts')
  },
  get shells() {
    return project.scripts.query(script => script.isIndex && script.categoryFolder === 'shells')
  },
  get themes() {
    return project.scripts.query(script => script.isIndex && script.categoryFolder === 'themes')
  },
})

