module.exports = function LoadsActions (actions) {
  actions.load(
    require('./each_package'), { id: 'each_package', uri: require.resolve('./each_package') }
  )
}
