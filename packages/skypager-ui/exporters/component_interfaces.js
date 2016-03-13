module.exports = function (params = {}, context = {}) {
  let project = context.project || this
  let outputPath = project.path('data_sources', 'component-docs.json')
  let mapValues = require('lodash/mapValues')
  let include = params.include
    ? params.include.split(',').map(s => s.trim().toLowerCase())
    : ['components','layouts','entries','shells']

  let writeFile = require('fs').writeFileSync

  include.forEach(type => {
    project.scripts[type].forEach(convertToData)
  })

  function convertToData(script) {
     script.runImporter('disk', {sync: true})
     require('child_process').execSync("mkdir -p " + project.path('data_sources', script.id))

     writeFile(
       project.path('data_sources', `${ script.id }/interface.json`),
       JSON.stringify(script.parsed, null, 2),
       'utf8'
    )
  }
}
