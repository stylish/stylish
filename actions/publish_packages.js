action('Publishes Packages')

describe('Publish packages to npm')

cli(function (program, dispatch){
  let action = this

  program
    .command('publish:packages')
    .description('make sure the packages are synced with the monorepo version number')
    .option('--exclude <pattern>', 'exclude packages mathing pattern')
    .option('--include <pattern>', 'include packages mathing pattern')
    .action(dispatch(action.api.runner))

  return program
})

execute(function(params, context) {
  let project = context.project
  let join = require('path').join
  let fs = require('fs')
  let exists = fs.existsSync
  let spawn = require('child_process').spawnSync

  project.docs.forEach(doc => {
    doc.runImporter('disk', {sync: true})
  })

  project.query('packages', {id:/packages.skypager/}).forEach(pkg => {
    console.log('  - '.magenta + ' ' + pkg.title)
    let proc = spawn('npm', ['publish'], {cwd: pkg.sourcePath})
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
  })

  console.log('ok.'.green + ' finished.')
})
