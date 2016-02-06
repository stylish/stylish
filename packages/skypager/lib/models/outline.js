'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.validate = validate;
define('Outline', function () {});

function create(_ref) {
  var document = _ref.document;

  return {
    data: document.data,
    parsed: document.parsed,
    sections: document.headings.sections.pluck('title'),
    subsections: document.headings.articles.pluck('title'),
    html: document.html.content
  };
}

function validate(document, spec, utils) {
  return true;
}