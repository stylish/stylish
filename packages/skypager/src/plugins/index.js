const HELPERS = [ 'github', 'google-drive' ]

function resolve (p) { return require.resolve('./' + p) }

module.exports = function (skypager) {
  return HELPERS.map(resolve).map(function (path) {
    load(path)
  })
}
