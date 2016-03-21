import { loadSkypagerFramework } from '../util'

export function repl (program, dispatch) {
  program
    .command('console')
    .description('Run an interactive REPL within the project')
    .option('--es6', 'require babel-register and polyfill')
    .action(dispatch(handle))
}

export default repl

export function handle (options = {}, context = {}) {
  var prompt = `${ context.prompt || process.env.SKYPAGER_CLI_BRAND || 'skypager' }`.magenta

  var replServer = require('repl').start({
    prompt: `${ prompt }: `
  })

  replServer.context['skypager'] = loadSkypagerFramework()

  Object.keys(context).forEach(key => {
    replServer.context[key] = context[key]
    replServer.context.contextKeys = Object.keys(context)
  })
}
