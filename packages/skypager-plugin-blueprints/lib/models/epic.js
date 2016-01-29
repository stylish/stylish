"use strict";

describe("Epic", function () {});

create(function (options, context) {});

module.exports = {
  decorate: function decorate(options, context) {},
  create: function create(options, context) {
    var document = options.document;

    return {
      id: document.id,
      title: document.headings.titles.first && document.headings.titles.first.value,
      description: document.mainCopy
    };
  }
};