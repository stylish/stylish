'use strict';

action('generate specs');

describe('generate spec documents for existing assets');

cli(function (program, dispatch) {
  var action = this;

  program.command('specs:generate').description(action.definition.description).option('--collection <collection>', 'a glob pattern to match the files you want to document').option('--root <path>', 'manually specify the search root').option('--exclude <glob>', 'a glob pattern to include some file').option('--include <glob>', 'a glob pattern to exclude some file').option('--overwrite', 'overwrite any existing documentation files').action(dispatch(action.api.runner));

  return program;
});

execute(function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var options = args[0];
  var context = args[1];
  var include = options.include;
  var exclude = options.exclude;
  var collection = options.collection;
  var project = context.project;

  var exists = require('fs').existsSync;
  var mkdir = require('mkdirp').sync;
  var dirname = require('path').dirname;

  var cwd = options.collection ? project.content[collection].root : options.root ? options.root : project.root;

  require('glob')(include, {
    cwd: cwd,
    ignore: exclude
  }, function (err, files) {
    if (err) {
      error('error generating spec document', err);
      return;
    }

    files = files.map(function (source) {
      return {
        source: source,
        destination: project.path('documents', source.replace(/\.\w+$/, '.md'))
      };
    });

    console.log('files', files);

    if (!options.overwrite) {
      files = files.filter(function (_ref) {
        var destination = _ref.destination;
        return exists(destination);
      });
    }

    files.forEach(function (doc) {
      console.log('' + doc.destination);
    });
  });
});