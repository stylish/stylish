module.exports = function pluginLoader () {
  load(
    require.resolve('./lib/definition'),
    'blueprints'
  )
}
