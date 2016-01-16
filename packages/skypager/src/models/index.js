const HELPERS = [ 'outline', 'page' ]

function resolve (p) { return require.resolve('./' + p) }

module.exports = function (skypager) {
  return HELPERS.map(resolve).map(function (path) { load(path) })
}
