action('generate routes')

describe('automatically generate react-router config for your screens')

cli(function (program, dispatch){
  var action = this

  program
    .command('generate:routes')
    .description(action.definition.description)
    .action(
      dispatch(action.api.runner)
    )

  return program
})

execute(function(params = {}, context = {}) {
  let { project } = context

  let scripts = project.scripts

  let entries = project.scripts.query((script) => {
    return (script.type === 'entry' && script.id.match(/^\w+\/\w+$/))
  })

  console.log('Entries')
  console.log(entries)
})
