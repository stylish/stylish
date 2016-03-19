'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publish = publish;
exports.handle = handle;

var _util = require('../util');

/**
 * Publish the project to a service such as Surge, or AWS
*/
function publish(program, dispatch) {
  program.command('publish [domain]').description('publish a website for this project to cloud hosting platforms').option('--domain <domain>', 'which domain to publish this to?').option('--public', 'which folder should we publish? defaults to the projects public path').option('--build', 'run the build process first').option('--build-command', 'which build command').option('--service <domain>', 'which service should we publish to? aws, surge.sh, some other domain', 'surge.sh').action(dispatch(handle));
}

exports.default = publish;
function handle(domain) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var project = context.project;

  domain = domain || options.domain || project.options.domain || project.get('settings.publishing.domain');
  options.public = options.public || project.paths.public;

  options.service = options.service || project.get('settings.publishing.service');

  if (options.service === 'skypager') {
    options.service = 'skypager.io';
  }
  if (options.service === 'blueprint') {
    options.service = 'blueprint.io';
  }

  if (options.service === 'blueprint.io' || options.service === 'skypager.io') {
    options.endpoint = 'surge.' + options.service;
    surgePlatformHandler(domain, options, context);
  } else if (options.service.match(/surge/i)) {
    surgeHandler(domain, options, context);
  }
}

function surgePlatformHandler(domain) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var cmd = 'deploy --project ' + options.public + ' --domain ' + domain + ' --endpoint ' + options.endpoint;

  var proc = require('child_process').spawn('surge', cmd.split(' '));

  process.stdin.pipe(proc.stdin);
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
}

function surgeHandler(domain) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var context = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var cmd = 'deploy --project ' + options.public + ' --domain ' + options.domain;

  var proc = require('child_process').spawn('surge', cmd.split(' '));

  process.stdin.pipe(proc.stdin);
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);
}

function awsHandler(domain) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  console.log('TODO: Implement this internally');
}

function abort(msg) {
  console.log(msg.red);
  process.exit(1);
}