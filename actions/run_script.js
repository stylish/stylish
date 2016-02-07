action('Run Project Script')

describe('Runs an npm script for each project')

cli(function (program, dispatch){
  let action = this

  program
    .command('run:package:script <scriptName>')
    .description('ensures that a project document exists for each project')
    .option('--packages-only', 'only include packages')
    .option('--projects-only', 'only include projects')
    .option('--exclude <pattern>','exclude pattern')
    .action(dispatch(action.api.runner))

  return program
})

execute(function(params, context) {
  let project = context.project

  forEachPackage(project, (pkg) => {
    if (pkg.sourcePath && pkg.manifestPath) {
      console.log('Package: ', pkg.name, Object.keys(pkg.readManifest().scripts || {}))
    }
  })
})

function forEachPackage(project ,fn) {
  let packages = project.query('docs', { id:/^packages\// })
  packages.forEach(fn.bind(project))
}

function forEachProject(project, fn) {
  let projects = project.query('docs', { id:/^projects\// })
  projects.forEach(fn.bind(project))
}

