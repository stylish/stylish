var PROJECT_MODELS = ['changelog','community_plugin','example','inspiration','testcase','layout','entry_point']

function resolve(model){ return require.resolve('./' + model) }

module.exports = function(project){
  return PROJECT_MODELS.map(resolve).map(function(path){ load(path) })
}
