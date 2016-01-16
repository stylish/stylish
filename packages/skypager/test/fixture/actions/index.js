var PROJECT_ACTIONS = [
  'testcases/run',
  'testcases/random'
]

function resolve(action){ return require.resolve('./' + action) }

module.exports = function(project){
  return PROJECT_ACTIONS.map(resolve).map(function(path){ load(path) })
}
