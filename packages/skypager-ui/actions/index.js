module.exports = function LoadsActions(actions) {
  actions.load(
    require('./components/document'), {
      id: 'components/document',
      uri: require.resolve('./components/document')
    }
  )
}
