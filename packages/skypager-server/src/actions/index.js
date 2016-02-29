module.exports = function LoadsActions(actions) {
  actions.load(
    require('./create_users'),
    {
      id: 'create_users',
      uri: require.resolve('./create_users')
    }
  )
}
