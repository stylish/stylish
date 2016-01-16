var models = exports = module.exports = function loadModels () {
  models.available.forEach(id => {
    registry.load(require.resolve('./' + id))
  })
}

exports.available = [
  'backlog',
  'clone',
  'concept',
  'epic',
  'package',
  'persona',
  'project',
  'repository'
]

