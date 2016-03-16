import { join, resolve, dirname, normalize, existsSync as exists } from 'path'
import { writeFileSync as write, statSync as stat } from 'fs'

import { argv } from 'yargs'

import mkdirp from 'mkdirp'
import colors from 'colors'
import debounce from 'lodash/debounce'

export function exporter (program, dispatch) {
  program
    .command('export <exporter>')
    .allowUnknownOption(true)
    .description('run one of the project exporters')
    .option('--format <format>', 'which format should the output be serialized in', 'json')
    .option('--output <path>', 'where to save the contents')
    .option('--pretty', 'pretty print the output')
    .option('--stdout', 'write output to stdout')
    .option('--benchmark', 'include benchmarking information')
    .option('--watch', 'watch files for changes and rerun the exporter')
    .option('--clean', 'clean or remove previous versions first')
    .action(dispatch(handle))
}

export default exporter

export function handle (exporterId, options = {}, context = {}) {
  console.log('Running exporter: ' + exporterId.cyan)
  actuallyHandle(exporterId, options, context)

  if (options.watch) {
    let files = './{data,docs,settings,src,assets,models,actions,exporters,importers}/**/*.*'
    let watcher = require('chokidar').watch(files,{
      usePolling: true,
      interval: 200,
      debounce: 1200
    })

    options.watch = false

    let onChange = () => {
      console.log('change detected. re-exporting')
      actuallyHandle(exporterId, options, context)
    }

    watcher.on('change', onChange)
  }
}

function actuallyHandle (exporterId, options = {}, context = {}) {
  const { project } = context
  const exporter = project.registries.exporters.lookup(exporterId, false)

  if (!exporter) {
    abort(`could not find and exporter named ${ exporterId }`)
  }

  const params = Object.assign({}, argv, {project})

  if (options.clean && exporterId === 'bundle') {
     require('rimraf').sync(
       project.path('build','bundle')
     )
  }

  if (options.benchmark) { console.time('exporter') }

  let payload = project.run.exporter(exporterId, params)

  let output

  if (options.format === 'json' && options.pretty) {
     output = JSON.stringify(payload, null, 2)
  } else if (options.format === 'json') {
     output = JSON.stringify(payload)
  } else if (options.format === 'yaml') {
    output = yaml.dump(payload)
  }

  if (options.output) {
    let outputPath = resolve(normalize(options.output))
    write(outputPath, output.toString(), 'utf8')
  } else if (options.stdout) {
     console.log(output)
  }


  if (options.benchmark) { console.timeEnd('exporter') }
}

function abort(message) {
   console.log(message.red)
   process.exit(0)
}
