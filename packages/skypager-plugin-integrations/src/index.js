module.exports = function LoadsPlugin(plugins) {
  plugins.load(
    require('./integrations'),
    {
      uri: require.resolve('./integrations'),
      id: 'integrations'
    }
  )
}
