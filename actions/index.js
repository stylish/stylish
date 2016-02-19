module.exports = function LoadsActions (actions) {
  actions.load(
    require('./sync_projects'), { id: 'sync_projects', uri: require.resolve('./sync_projects') },
  )

  actions.load(
    require('./run_script'), { id: 'run_script', uri: require.resolve('./run_script') }
  )
}
