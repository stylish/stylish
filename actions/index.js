var actions = [
  'packages/publish',
  'packages/sync_versions',
  'packages/test',
  'packages/initialize',
  'packages/clone',
  'projects/initialize',
  'projects/clone',
  'projects/preview',
  'projects/publish',
  'projects/test'
]

module.exports = function() {
  actions.forEach(function(action){
    load(require.resolve('./' + action))
  })
}
