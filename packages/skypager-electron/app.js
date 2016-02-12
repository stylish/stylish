var yargs = require('yargs'),
    colors = require('colors'),
    argv = yargs.argv;

var loader;

if (argv.devMode || process.env.SKYPAGER_ENV == 'dev') {
  require('babel-register')({
    presets:['skypager']
  })

  loader = require('./src/boot')
} else {
  loader = require('./lib/boot')
}

var skypagerMain = loader.enter({
    project: yargs.argv.project || process.env.PWD,
    argv: argv,
    command: argv._
  });

if (yargs.argv.interactive) {
  var server = require('repl').start({
    prompt: 'skypager-'.magenta + 'electron'.yellow + ' ' + ':'.white + '> ',
    input: process.stdin,
    output: process.stdout
  })

  server.context.project = skypagerMain.project
  server.context.app = skypagerMain
}
