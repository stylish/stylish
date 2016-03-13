module.exports = function (params = {}, context = {}) {
  let project = context.project || this
  let outputPath = project.path('build', 'component_interfaces.json')
  let mapValues = require('lodash/mapValues')

  let types = ['components','layouts','shells','entries']

  let payload = types.reduce((memo,type) => {
    let scripts = project.scripts[type].reduce((i,s) => {
      i[s.id] = s.parsed
      return i
    }, {})

    memo[type] = scripts

    return memo
  }, {})

  require('fs').writeFileSync(
    outputPath,
    JSON.stringify(
      payload,
      null,
      2
    ),
    'utf8'
  )

  return payload
}
