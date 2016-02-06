module.exports = function LoadsActions (actions) {
  actions.load(
    require('./sync_versions'), { id: 'sync_package_versions', uri: require.resolve('./sync_versions') }
  )
}
