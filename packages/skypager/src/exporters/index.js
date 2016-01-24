const HELPERS = [
  'all',
  'project',
  'assets',
  'content',
  'entities',
  'snapshot',
  'bundle',
  'models'
]

function resolve (p) { return require.resolve('./' + p) }

module.exports = function (skypager) {
  return HELPERS.map(resolve).map(function (path) { load(path) })
}
