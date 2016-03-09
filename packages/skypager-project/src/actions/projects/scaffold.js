action('scaffold project')

describe('generate the project scaffolding')

execute(function(params = {}, { project }) {
  let mkdir = require('mkdirp').sync
  let map = require('lodash/mapValues')

  values(project.paths).forEach(path => {
    if (!path.match(/\.\w+/)) {
      console.log('  Creating ', path, mkdir(path))
    }
  })
})
