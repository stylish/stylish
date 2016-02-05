import { join, resolve, dirname } from 'path'

import shell from 'shelljs'
import util from '../util'
import pick from 'lodash/object/pick'

export function develop (program, dispatch) {
  program
    .command('dev [entry]')
    .alias('develop')
    .alias('dev-server')
    .description('run a development server for this project')
    .option('--port <port>', 'which port should this server listen on?', 3000)
    .option('--host <hostname>', 'which hostname should this server listen on?', 'localhost')
    .option('--entry <path>', 'relative path to the entry point', './src')
    .option('--entry-name <name>', 'what to name the entry point script', 'app')
    .option('--platform <name>', 'which platform are we building for? electron or web', 'web')
    .option('--theme <name>', 'the name of the theme to use')
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
    .option('--middleware <path>', 'apply express middleware to the dev-server')
    .option('--modules-path <path>', 'which modules folder to use for webpacks default? defaults to standard node_modules')
    .option('--feature-flags <path>', 'path to a script which exports an object to be used for feature flags')
    .option('--skip-theme', 'do not include a theme')
    .option('--entry-only', 'do not use html template')
    .option('--dist-path <path>', 'the project exporter or dist path')
    .option('--external-vendors', "assume vendor libraries will be available to our script")
    .option('--no-vendor-libraries', "don't include any vendor libraries in the bundle")
    .option('--export-library <name>', 'build this as a umd library')
    .option('--template-inject [target]', 'where to inject the webpack bundle? none, body, head')
    .option('--exclude-chunks [list]', 'chunk names to exclude from the html bundle')
    .option('--chunks [list]', 'chunk names to exclude from the html bundle')
    .action(dispatch(handle))
}

export default develop

export function handle (entry, options = {}, context = {}) {
  let project = context.project

  if (options.bundle){
    launchWatcher(options, context)
  }

  launchServer(entry, options, context)

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
  var proc = shell.exec(`chokidar './{data,docs}/**/*.*' --silent --ignore --debounce 1200 -c '${ bundleCommand }'`, {async: true})

  proc.stdout.on('data', (data) => {
    if(!options.silent) {
      console.log(data)
    }
  })

  proc.stderr.on('data', (data) => {
    if(options.debug) {
      console.log(data)
    }
  })
}

export function launchServer (entry, options = {}, context = {}) {
  let project = context.project

  options.entry = entry || options.entry || project.options.entry || './src'
  options.theme = options.theme || project.options.theme || 'marketing'

  options.staticAssets = options.staticAssets || project.options.staticAssets || {}

  console.log(`Launching server with entry`.cyan + ` ${ options.entry }`.white)

  process.env.NODE_ENV = 'development'

  //wow
  let serverOptions = pick(options, 'fontsPrefix','modulesPath','platform','entry','entryName','precompiled', 'theme', 'skipTheme', 'outputFolder', 'htmlTemplatePath', 'htmlFilename', 'pushState', 'contentHash', 'noContentHash', 'project', 'featureFlags', 'staticAssets', 'chunks', 'excludeChunks', 'templateInject', 'entryOnly', 'exportLibrary', 'vendorLibraries', 'noVendorLibraries', 'externalVendors', 'target')

  require(`${ pathToDevpack(options.devToolsPath) }/webpack/server`)(serverOptions)
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

function pathToDevpack (opt) { return (opt && resolve(opt)) || process.env.SKYPAGER_DEVPACK_PATH || dirname( require.resolve('skypager-devpack')) }

function isDepackInstalled () {
  try {
    return pathToDevpack()
  } catch (error) {
    return false
  }
}
