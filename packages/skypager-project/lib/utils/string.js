'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.humanize = humanize;
exports.titleize = titleize;
exports.classify = classify;
exports.tableize = tableize;
exports.tabelize = tabelize;
exports.underscore = underscore;
exports.parameterize = parameterize;
exports.slugify = slugify;
exports.singularize = singularize;
exports.pluralize = pluralize;

var _utile = require('utile');

function humanize(s) {
  return _utile.inflections.humanize(s).replace(/-|_/g, ' ');
}

function titleize(s) {
  return _utile.inflections.titleize(humanize(s));
}

function classify(s) {
  return _utile.inflections.classify(s);
}

function tableize(s) {
  return _utile.inflections.tableize(s);
}

function tabelize(s) {
  return _utile.inflections.tableize(s);
}

function underscore(s) {
  s = s.replace(/\\|\//g, '-', '');
  s = s.replace(/[^-\w\s]/g, ''); // remove unneeded chars
  s = s.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
  s = s.replace('-', '_');
  s = s.replace(/[-\s]+/g, '_'); // convert spaces to hyphens
  s = s.toLowerCase(); // convert to lowercase
  return s;
}

function parameterize(s) {
  s = s.replace(/\\|\//g, '-', '');
  s = s.replace(/[^-\w\s]/g, ''); // remove unneeded chars
  s = s.replace(/^\s+|\s+$/g, ''); // trim leading/trailing spaces
  s = s.replace(/[-\s]+/g, '-'); // convert spaces to hyphens
  s = s.toLowerCase(); // convert to lowercase
  return s;
}

function slugify(s) {
  return parameterize(s);
}

function singularize() {
  return _utile.inflections.singularize.apply(_utile.inflections, arguments);
}

function pluralize() {
  return _utile.inflections.pluralize.apply(_utile.inflections, arguments);
}