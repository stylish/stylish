import emoji from 'node-emoji'
import defaults from 'lodash/defaults'
import invoke from 'lodash/invoke'

import { loadSkypagerFramework } from '../util'

require('colors')

export function repl (program, dispatch) {
  program
    .command('console')
    .description('Run an interactive REPL within the project')
    .option('--es6', 'require babel-register and polyfill')
    .action(dispatch(handle))
}

export default repl

export function handle (options = {}, context = {}) {
  let { project } = context

  options = defaults(options, {
    color: process.env.SKYPAGER_CLI_BRAND_COLOR,
    icon: process.env.SKYPAGER_CLI_BRAND_ICON,
    brand: process.env.SKYPAGER_CLI_BRAND || process.env.SKYPAGER_CLI_BRAND_NAME
  }, {
    color: (project && project.get('options.brand.color')) || 'cyan',
    icon: (project && project.get('options.brand.icon')) || 'rocket',
    brand: (project && project.get('options.brand.name')) || 'skypager',
  })

  let { icon, brand, color } = options

  if (options.icon) {
    icon = emoji.get(icon) || 'rocket'
  }

  let prompt = (brand || 'skypager')[color] || (brand || 'skypager').cyan

  var replServer = require('repl').start({
    prompt: `${ icon } ${ prompt }: `
  })

  replServer.context['framework'] = replServer.context['skypager'] = loadSkypagerFramework()

  Object.keys(context).forEach(key => {
    replServer.context[key] = context[key]
    replServer.context.contextKeys = Object.keys(context)
  })
}
