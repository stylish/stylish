var yargs = require('yargs'),
    colors = require('colors'),
    skypagerMain = require('./lib/boot').enter({
      project: yargs.argv.project || process.env.PWD,
      argv: yargs.argv,
      command: yargs.argv._
    });

if (yargs.argv.interactive) {
  var server = require('repl').start({
    prompt: 'skypager-'.magenta + 'electron'.yellow + ' ' + ':'.white + '> '
  })

  server.context.project = skypagerMain.project
  server.context.app = skypagerMain
}
