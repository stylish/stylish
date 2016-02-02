module.exports = function LoadsPlugin(registry) {
  registry.load(
    require('./lib/integrations'), {
      id: 'integrations',
      uri: require.resolve('./lib/integrations')
    }
  )
}
