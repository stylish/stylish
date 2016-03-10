action('reactify svgs')

describe('convert svg assets into react components')

cli(function (program,dispatch) {
  var action = this

  program
    .command('svg:reactify')
    .description(action.definition.description)
    .action(dispatch(action.api.runner))
})

execute(function(params, context) {
  var project = context.project
  var svg = require('skypager-devpack/lib/util/svg').svg
  var join = require('path').join
  var write = require('fs').writeFileSync

  project.ensureFolder('scripts', 'svg')

  project.vectors.all.forEach(vector => {
    var parts = vector.paths.relative.split('/')
    var filename = parts.pop()

    project.ensureFolder('scripts', 'svg', ...parts)

    var folder = project.path('scripts', 'svg', ...parts)

    return svg(vector.paths.absolute).then(requireComponent => {
      var outputPath = join(folder, filename.replace('.svg','.js') )

      write(outputPath, requireComponent.toString(), 'utf8')

      console.log('Saved ' + outputPath)

    }, (err) => {
      console.log('Error', err)
    })
  })
})
