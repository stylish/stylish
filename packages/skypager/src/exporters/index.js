const HELPERS = [
  'asset_manifest',
  'collection_bundle',
  'html',
  'json',
  'entities',
  'snapshot',
  'disk'
]

function resolve (p) { return require.resolve('./' + p) }

module.exports = function (skypager) {
  return HELPERS.map(resolve).map(function (path) { load(path) })
}
