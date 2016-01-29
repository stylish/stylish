module.exports = LoadsModels

const resolve = require.resolve

function LoadsModels (models) {
  const load = models.load.bind(models)

  load(require('./backlog'), {uri: resolve('./backlog'), id: 'backlog'})
  load(require('./concept'), {uri: resolve('./concept'), id: 'concept'})
  load(require('./environment'), {uri: resolve('./environment'), id: 'environment'})
  load(require('./epic'), {uri: resolve('./epic'), id: 'epic'})
  load(require('./feature'), {uri: resolve('./feature'), id: 'feature'})
  load(require('./metric'), {uri: resolve('./metric'), id: 'metric'})
  load(require('./package'), {uri: resolve('./package'), id: 'package'})
  load(require('./persona'), {uri: resolve('./persona'), id: 'persona'})
  load(require('./platform'), {uri: resolve('./platform'), id: 'platform'})
  load(require('./project'), {uri: resolve('./project'), id: 'project'})
  load(require('./release'), {uri: resolve('./release'), id: 'release'})
  load(require('./repository'), {uri: resolve('./repository'), id: 'repository'})
  load(require('./service'), {uri: resolve('./service'), id: 'service'})
  load(require('./ui_component'), {uri: resolve('./ui_component'), id: 'ui_component'})
  load(require('./ui_layout'), {uri: resolve('./ui_layout'), id: 'ui_layout'})
  load(require('./ui_theme'), {uri: resolve('./ui_theme'), id: 'ui_theme'})
  load(require('./ui_screen'), {uri: resolve('./ui_screen'), id: 'ui_screen'})
  load(require('./wizard'), {uri: resolve('./wizard'), id: 'wizard'})
}
