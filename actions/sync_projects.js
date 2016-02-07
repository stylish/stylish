action('Sync Projects')

describe('Generate project and package docs for projects found in the path')

cli(function (program, dispatch){
  let action = this

  program
    .command('sync:package:docs')
    .arguments('sync package docs [projectsPath]')
    .option('--packages-only', 'only sync packages')
    .option('--projects-only', 'only sync projects')
    .option('--exclude <pattern>','exclude pattern')
    .description('ensures that a project document exists for each project')
    .action(dispatch(action.api.runner))

  return program
})

execute(function(params, context) {
  let project = context.project
  let settings = project && project.mergedSettingsData
  let fs = require('fs')

  let packagemodel = project.models.lookup('package', false)

  if (!params.projectsOnly && packageModel && settings && settings.blueprints && settings.blueprints.packages_path) {
    fs.readdirSync(
      project.join(settings.blueprints.packages_path)
    ).forEach(path => {
        let pkg = require(project.join(settings.blueprints.packages_path, path, 'package.json'))

        let content = packageModel.generate({
          attributes: {
            title: pkg.name
          },
          data: {
            sourcePath: `${ settings.blueprints.packages_path }/${ path }`
          },
          content: pkg.description
        })

        let existing = project.docs.at(`${ settings.blueprints.packages_path }/${ path }`)
        let docPath = existing ? existing.paths.absolute : project.path('documents', `${ settings.blueprints.packages_path }/${ path }.md`)

        fs.writeFileSync(docPath, content)
    })
  }

  let projectModel = project.models.lookup('project', false)

  if (!params.packagesOnly && projectModel && settings && settings.blueprints && settings.blueprints.projects_path) {
    fs.readdirSync(
      project.join(settings.blueprints.projects_path)
    ).forEach(path => {
        let pkg = require(project.join(settings.blueprints.projects_path, path, 'package.json'))

        let content = projectModel.generate({
          attributes: {
            title: pkg.name
          },
          data: {
            sourcePath: `${ settings.blueprints.projects_path }/${ path }`
          },
          content: pkg.description
        })

        let existing = project.docs.at(`${ settings.blueprints.project_path }/${ path }`)
        let docPath = existing ? existing.paths.absolute : project.path('documents', `${ settings.blueprints.projects_path }/${ path }.md`)

        fs.writeFileSync(docPath, content)
    })
  }

})
