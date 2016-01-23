export function repl (program, dispatch) {
  program
    .command('console')
    .option('--es6', 'require babel-register and polyfill')
    .action(dispatch(handle))
}

export default repl

export function handle (options = {}, context = {}) {
  var replServer = require('repl').start({
    prompt: ('skypager'.magenta + ':'.cyan + ' ')
  })

  Object.keys(context).forEach(key => {
    replServer.context[key] = context[key]
    replServer.context.keys = Object.keys(context)
  })
}
