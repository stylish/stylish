action('Sync Versions')

describe('Keeps the package and project version numbers in sync across the mono repo')

cli(function (program, dispatch){
  let action = this

  program
    .command('publish:package')
    .description('make sure the packages are synced with the monorepo version number')
    .option('--patch', 'increase patch revision first')
    .option('--exclude <pattern>', 'exclude packages mathing pattern')
    .action(dispatch(action.api.runner))

  return program
})

execute(function(params, context) {
  let project = context.project
  let join = require('path').join
  let fs = require('fs')
  let exists = fs.existsSync

  project.docs.forEach(doc => {
    doc.runImporter('disk', {sync: true})
  })

  let packages = project.query('packages', { sourcePath: /\w+/ })

  let nextVersion = project.manifest.version

  packages.forEach(pkg => {
    require('child_process').spawnSync('npm',['publish'],{cwd:pkg.sourcePath})
  })
})
