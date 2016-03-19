'use strict';

describe('Package', function (Package) {});

exports.decorate = function decorate() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return require('./utils/source-paths')(options, context);
};

exports.create = function create() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var document = options.document;
  var project = context.project;
  var id = document.id;
  var data = document.data;
  var documentTitle = document.documentTitle;
  var sourcePath = document.sourcePath;
  var mainCopy = document.mainCopy;

  return {
    id: id,
    data: data,
    title: documentTitle,
    sourcePath: sourcePath,
    mainCopy: mainCopy,
    manifest: document.readManifest()
  };
};