action('generate specs')

describe('generate spec documents for existing assets')

cli(function(program, dispatch){
  let action = this

  program
    .command('specs:generate')
    .description(action.definition.description)
    .option('--collection <collection>', 'a glob pattern to match the files you want to document')
    .option('--root <path>', 'manually specify the search root')
    .option('--exclude <glob>', 'a glob pattern to include some file')
    .option('--include <glob>', 'a glob pattern to exclude some file')
    .option('--overwrite', 'overwrite any existing documentation files')
    .action(dispatch(
      action.api.runner
    ))

  return program
})

execute(function(...args){
  let [options, context] = args
  let { include, exclude, collection } = options
  let { project } = context
  let exists = require('fs').existsSync
  let mkdir = require('mkdirp').sync
  let dirname = require('path').dirname

  let cwd = options.collection
    ? project.content[collection].root
    : options.root ? (options.root) : project.root

  require('glob')(include, {
    cwd: cwd,
    ignore: exclude
  }, (err, files) => {
    if (err) {
      error('error generating spec document', err)
      return
    }

    files = files.map((source) => ({
      source,
      destination: project.path('documents', source.replace(/\.\w+$/,'.md'))
    }))

    console.log('files', files)

    if (!options.overwrite) {
      files = files.filter(({destination})=> { return exists(destination) })
    }

    files.forEach(doc => {
      console.log(`${ doc.destination }`)
    })

  })


})
