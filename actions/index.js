module.exports = function LoadsActions(actions) {
  actions.load(
    require('./vectors/reactify.js'),{
      id: 'svg/reactify',
      uri: require.resolve('./vectors/reactify.js')
    }
  )
}
