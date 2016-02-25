import { dump as toYaml } from 'js-yaml'

const VERSION = require('../../package.json').version

export function init (program, dispatch) {
  program
    .command('init <projectName> [destination]')
    .description('create a new skypager project')
    .option('--overwrite','whether or not to replace a project that exists')
    .option('--destination','')
    .option('--plugins <list>', 'a comma separated list of plugins to use', list)
    .action(function(projectName, options) {
      handle(projectName, options)
    })
}

export function handle (projectName, destination, options = {}, context = {}) {
  const { resolve, join } = require('path')
  const { existsSync, writeFileSync } = require('fs')
  const mkdir = require('mkdirp').sync

  destination = destination || options.destination || resolve(join(process.env.PWD, projectName))

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
        'skypager': `^${ VERSION }`,
        'skypager-devpack': `^${ VERSION }`,
        'babel-preset-skypager': `^${ VERSION }`,
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
      'settings',
      'src',
      'models',
      'actions',
      'data',
      'dist',
      'public',
      'tmp/cache'
    ]

    folders.forEach(path => {
      mkdir(join(destination,path))
    })

    function template(...parts) {
      return (content) => {
        writeFileSync(
          join(destination, ...parts),
          content.split("\n").map(line => line.trim()).join("\n"),
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

    template('.gitignore')(['logs/**/*.log','tmp/cache', '.DS_Store', '.env', 'settings/secrets.yml' ].join("\n"))
    template('.npmignore')(['logs/**/*.log','tmp/cache', '.DS_Store', '.env', 'settings/secrets.yml' ].join("\n"))

    template('settings/publishing.yml', toYaml({
      publishing: {
        service: 'skypager.io'
      }
    }))

    template('settings/integrations.yml', toYaml({
      dropbox: {
        token: 'env.DROPBOX_API_TOKEN'
      },
      github: {
        token: 'env.GITHUB_ACCESS_TOKEN'
      },
      aws: {
        secret_access_key: 'env.AWS_SECRET_ACCESS_KEY',
        access_key_id: 'env.AWS_ACCESS_KEY_ID'
      },
      slack: {
        token: 'env.SLACK_ACCESS_TOKEN'
      },
      auth0: {
        domain: 'env.AUTH0_CLIENT_DOMAIN',
        clientId: 'env.AUTH0_CLIENT_ID'
      }
    }))


    template('docs/outline.md')(
      `---
      type: outline
      ---

      ## Sections
      ### Section A
      ### Section B
      `)

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
  return `${ val }`.split(',').map(val => val.trim().toLowerCase())
}
