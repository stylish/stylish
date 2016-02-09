module.exports = function LoadsActions (actions) {
  actions.load(
    require('./sync_projects'), { id: 'sync_projects', uri: require.resolve('./sync_projects') },
  )

  actions.load(
    require('./sync_versions'), { id: 'sync_versions', uri: require.resolve('./sync_versions') }
  )

  actions.load(
    require('./run_script'), { id: 'run_script', uri: require.resolve('./run_script') }
  )
}
