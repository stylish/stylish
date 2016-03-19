'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = create;
exports.validate = validate;
define('Outline', function (outline) {
  /**
   * This is better than what i have currently
   example(
    h1('document.title'),
     paragraphs('document.description'),
     h2("Table Of Contents",
       h3("sections", { builder: sectionsBuilder, multi: true })
    )
  )
  */
  outline.documents.have.a.section('Table Of Contents', function (section) {
    section.has.many.articles('sections', function (article) {});
  });
});

function create(_ref) {
  var document = _ref.document;

  return {
    data: document.data,
    sections: document.headings.articles.pluck('value'),
    html: document.html.content
  };
}

function validate(document, spec, utils) {
  return true;
}