'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.validate = validate;
define('Page', function (page) {});

function create(_ref) {
  var document = _ref.document;
  var context = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return {
    data: document.data,
    parsed: document.parsed,
    sections: document.headings.sections.pluck('value'),
    subsections: document.headings.articles.pluck('value'),
    html: document.html.content
  };
}

function validate(document, spec, utils) {
  return true;
}