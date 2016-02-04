require('babel-register')({
  presets:[
    require.resolve('babel-preset-es2015'),
    require.resolve('babel-preset-react')
  ],
  plugins:[
    require.resolve('babel-plugin-add-module-exports')
  ]
})

var yargs = require('yargs'),
    pick = require('lodash/object/pick'),
    colors = require('colors'),
    loadProject = require('skypager/lib/util').loadProjectFromDirectory,
    project = loadProject(yargs.argv.project || process.env.PWD),
    skypagerMain = require('./src/index').enter({
      project,
      argv: yargs.argv,
      command: yargs.argv._
    });

if (yargs.argv.interactive) {
  var server = require('repl').start({
    prompt: 'skypager-'.magenta + 'electron'.yellow + ' ' + ':'.white + '> '
  })

  server.context.project = project
  server.context.app = skypagerMain
}
