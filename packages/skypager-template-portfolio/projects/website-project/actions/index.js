module.exports = function LoadProjectActions(actions) {
  actions.load(
    require('./routes/generate'),
    {
      id: 'routes/generate',
      uri: require.resolve('./routes/generate')
    }
  )
}
