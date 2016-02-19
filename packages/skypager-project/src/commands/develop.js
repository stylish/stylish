import { join, resolve, dirname } from 'path'

import shell from 'shelljs'
import util from '../util'
import pick from 'lodash/pick'

/**
 * This is a low level wrapper around webpack dev server and how we use it to build react / bootstrap / redux
 * apps for web, electron, and react-native platforms.
 *
 * Eventually I would rather have several presets which compose these different options together.
*/
export function develop (program, dispatch) {
  program
    .command('dev [preset]')
    .alias('develop')
    .alias('dev-server')
    .description('run a development server for this project')
    .option('--preset <name>', 'use a preset instead of all of this configuration')
    .option('--platform <name>', 'which platform are we building for? electron or web', 'web')
    .option('--port <port>', 'which port should this server listen on?', 3000)
    .option('--host <hostname>', 'which hostname should this server listen on?', 'localhost')
    .option('--entry <path>', 'relative path to the entry point', './src')
    .option('--entry-name <name>', 'what to name the entry point script', 'app')
    .option('--entry-only', 'do not build an html template, only build the webpack entries')
    .option('--html-template-path <path>', 'path to the html template to use')
    .option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc')
    .option('--ngrok', 'when enabled, will attempt to use ngrok to expose a public API endpoint for this server')
    .option('--ngrok-config <path>', 'path to a configuration file for the ngrok service')
    .option('--silent', 'suppress any server output')
    .option('--debug', 'show error info from the server')
    .option('--dev-tools-path <path>', 'path to the skypager-devpack devtools library')
    .option('--webpack-config <path>', 'path to a javascript function which can mutate the webpack config')
    .option('--bundle', 'watch for content changes in the project and update the distribution bundle')
    .option('--bundle-command', 'the command to run to generate the bundle default: skypager export bundle', 'skypager export bundle')
    .option('--dist-path <path>', 'the project exporter or dist path, where the bundle will be built')
    .option('--middleware <path>', 'apply express middleware to the dev-server')
    .option('--modules-path <path>', 'which modules folder to use for webpacks default? defaults to standard node_modules')
    .option('--feature-flags <path>', 'path to a script which exports an object to be used for feature flags')
    .option('--theme <name>', 'the name of the theme to use')
    .option('--skip-theme', 'do not include a theme')
    .option('--external-vendors', "assume vendor libraries will be available to our script")
    .option('--no-vendor-libraries', "don't include any vendor libraries in the bundle")
    .option('--export-library <name>', 'build this as a umd library')
    .option('--template-inject [target]', 'where to inject the webpack bundle? none, body, head')
    .option('--exclude-chunks [list]', 'chunk names to exclude from the html bundle')
    .option('--chunks [list]', 'chunk names to exclude from the html bundle')
    .option('--save-webpack-stats <path>', 'save the webpack compilation stats output')
    .option('--proxy-target <host:port>', 'the host and port you want to proxy request to')
    .option('--proxy-path <base-url>', 'base url to handle the proxied request')
    .action(dispatch(handle))
}

export default develop

export function handle (preset, options = {}, context = {}) {
  let project = context.project

  if (options.bundle){
    launchWatcher(options, context)
  }

  launchServer(preset, options, context)

  if (options.ngrok) {
    launchTunnel(options, context)
  }
}

export function launchWatcher(options, context) {
  let project = context.project

  let bundleCommand = options.bundleCommand || 'skypager export bundle'

  console.log('Exporting project bundle'.green)
  shell.exec(`${ bundleCommand } --clean`)

  console.log('Launching project bundler'.yellow)
  var watcherProc = shell.exec(`chokidar './{data,docs,settings,src}/**/*.*' --silent --ignore --debounce 1200 -c '${ bundleCommand }'`, {async: true})

  watcherProc.on('error', (err) => {
    console.log('Error launching the bundler watch command', error)
  })

  watcherProc.stdout.on('data', (data) => {
    if(!options.silent) {
      console.log(data)
    }
  })

  watcherProc.stderr.on('data', (data) => {
    if(options.debug) {
      console.log(data)
    }
  })
}

export function launchServer (preset, options = {}, context = {}) {
  let project = context.project

  if (!project) {
    console.log('Can not launch the dev server outside of a skypager project directory. run skypager init first.'.red)
    process.exit(1)
  }

  if (!isDevpackInstalled()) {
    console.log('The skypager-devpack package is required to use the webpack integration.'.red)
    process.exit(1)
  }

  options.entry = options.entry || project.options.entry || './src'
  options.theme = options.theme || project.get('settings.branding.theme') || project.get('settings.style.theme') || project.options.theme || 'marketing'

  options.staticAssets = options.staticAssets || project.options.staticAssets || {}

  console.log(`Launching server with entry`.cyan + ` ${ options.entry }`.white)

  process.env.NODE_ENV = process.env.NODE_ENV || 'development'

  function onCompile(err, stats) {
    project.debug('skypager:afterDevCompile', {
      stats: (stats && Object.keys(stats.toJson()))
    })
  }

  function beforeCompile(err, data) {
    project.debug('skypager:beforeDevCompile', {
      ...data
    })
  }

  process.title = 'skypager dev'
  require('skypager-devpack').webpack('develop', options, {beforeCompile, onCompile})
}


export function launchTunnel(options, context) {
  var server = shell.exec(`ngrok http ${ options.port || 3000 }`, {async: true})

  server.stdout.on('data', (data) => {
    console.log(data)
  })

  server.stderr.on('data', (data) => {
    console.log(data)
  })

  server.on('end', () => {
     console.log('Ngrok tunnel ended')
  })
}

function isDevpackInstalled () {
  try {
    require('skypager-devpack')
    return true
  } catch (error) {
    return false
  }
}
