import { join, dirname } from 'path'

import shell from 'shelljs'
import util from '../util'

export function build (program, dispatch) {
  program
    .command('build [preset]')
    .description('build a website for this project using our preconfigured webpack bundle')
    .option('--preset <name>', 'use a preset instead of all of this configuration')
    .option('--entry <path>', 'relative path to the entry point', './src')
    .option('--entry-name <name>', 'what to name the entry point script', 'app')
    .option('--entry-only', 'only compiled asssets; do not use html template')
    .option('--platform <name>', 'which platform are we building for? electron or web', 'web')
    .option('--external-vendors', "assume vendor libraries will be available to our script")
    .option('--no-vendor-libraries', "don't include any vendor libraries in the bundle")
    .option('--theme <name>', 'the name of the theme to use', 'dashboard')
    .option('--output-folder <path>', 'relative path to the output folder', 'public')
    .option('--html-filename <filename>', 'what should we name the html file?', 'index.html')
    .option('--html-template-path <path>', 'path to the html template to use')
    .option('--precompiled <name>', 'use a precompiled html template which includes vendor libs, themes, etc')
    .option('--push-state', 'use a 200.html file to support push state')
    .option('--content-hash', 'fingerprint the names of the files as a cache busting mechanism', true)
    .option('--no-content-hash', 'fingerprint the names of the files as a cache busting mechanism', true)
    .option('--dev-tools-path <path>', 'path to the skypager-devpack')
    .option('--webpack-config <path>', 'path to a javascript function which can mutate the webpack config')
    .option('--export-library <name>', 'build this as a umd library')
    .option('--modules-path <path>', 'which modules folder to use for webpacks default? defaults to standard node_modules')
    .option('--dist-path <path>', 'the project exporter or dist path')
    .option('--skip-theme', 'do not include any skypager-theme content')
    .option('--feature-flags <path>', 'path to a script which exports an object to be used for feature flags')
    .option('--bundle', 'watch for content changes in the project and update the distribution bundle')
    .option('--bundle-command', 'the command to run to generate the bundle default: skypager export bundle', 'skypager export bundle')
    .option('--silent', 'suppress any server output')
    .option('--debug', 'show error info from the server')
    .option('--template-inject [target]', 'where to inject the webpack bundle? none, body, head')
    .option('--exclude-chunks [list]', 'chunk names to exclude from the html bundle')
    .option('--chunks [list]', 'chunk names to exclude from the html bundle')
    .option('--save-webpack-stats <path>', 'save the webpack compilation stats output')
    .action(dispatch(handle))
}

export default build

export function handle(preset, options = {}, context = {}) {
  options.preset = preset || options.preset
  options.theme = options.theme || project.options.theme

  if (!options.theme && !options.skipTheme) {
    console.log('Are you sure you want to run without a theme?'.yellow)
  }

  process.env.NODE_ENV = 'production'

  let bundleCommand = options.bundleCommand || 'skypager export bundle'

  if (options.bundle) {
    shell.exec(`${ bundleCommand } --clean`)
  }

  require(`${ pathToDevpack(options.devToolsPath) }/webpack/lib/compiler`)(options)
}


function pathToDevpack (opt) { return (opt && resolve(opt)) || process.env.SKYPAGER_DEVPACK_PATH || dirname( require.resolve('skypager-devpack')) }

function isDepackInstalled () {
  try {
    return pathToDevpack()
  } catch (error) {
    return false
  }
}
