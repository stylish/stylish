var actions = [
  'packages/generate',
  'packages/publish',
  'packages/sync_versions',
  'packages/test',
  'packages/initialize',
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
