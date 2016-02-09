import { manifest as framework } from 'skypager'
import trim from 'lodash/string/trim'

export function init (program, dispatch) {
  program
    .command('init <projectName>')
    .description('create a new skypager project')
    .option('--overwrite','whether or not to replace a project that exists')
    .option('--plugins <list>', 'a comma separated list of plugins to use', list)
    .action(function(projectName, options) {
      handle(projectName, options)
    })
}

export function handle (projectName, options = {}, context = {}) {
  const { resolve, join } = require('path')
  const { existsSync, writeFileSync } = require('fs')
  const destination = resolve(join(process.env.PWD, projectName))
  const mkdir = require('mkdirp').sync
  const set = require('object-path').set

  if ( !existsSync(destination) ) {
    mkdir(destination)
  }

    let man = {
      name: projectName,
      version: '1.0.0',
      skypager: {
        main: 'skypager.js',
        plugins: options.plugins ? `${ options.plugins }`.split(',') : []
      },
      devDependencies:{
        'skypager': `^${ framework.version }`,
        'skypager-devpack': `^${ framework.version }`,
        'babel-preset-skypager': `^${ framework.version }`,
        'babel-runtime': '^6.4.0'
      }
    }

    if (options.plugins) {
      plugins.forEach(plugin => {
        man.devDependencies[`skypager-plugin-${ plugin }`] = '*'
      })
    }

    const folders = [
      'docs/pages',
      'data/settings',
      'src',
      'actions'
    ]

    folders.forEach(path => {
      mkdir(join(destination,path))
    })

    function template(...parts) {
      return (content) => {
        writeFileSync(
          join(destination, ...parts),
          content,
          'utf8'
        )
      }
    }

    template('package.json')(
      JSON.stringify(man, null, 2),
    )

    template('skypager.js')(`
      require('skypager/lib/util').skypagerBabel()

      module.exports = require('skypager').load(__filename, {
        manifest: require('./package.json')
      })
      `,
      'utf8'
    )

    template('.babelrc')('{presets:["skypager"]}')

    template('.gitignore')(['logs/**/*.log','tmp/cache', '.DS_Store', '.env' ].join("\n"))

    template('docs/outline.md')(
      `---
      type: outline
      ---

      ## Sections
      ### Section A
      ### Section B
      `.replace(/^\s+/m, '')
    )

    template('docs/pages/cover.md')(
      `---
      type: page
      cover: true
      title: ${ projectName }
      ---

      # Project Name\n`)
}

export default init


function list(val) {
  return `${ val }`.split(',').map(val => trim(val).toLowerCase())
}
