'use strict';

describe("Log", function (log) {
  log.documents.have.a.section('Entries', function (section) {
    section.builder = _buildSection;

    section.has.many.articles('entries', function (entry) {
      entry.builder = _buildEntry;
    });
  });
});

create(function (document) {
  return {
    data: document.data,
    description: 'TODO',
    entries: []
  };
});

function _buildSection(section) {
  return {
    title: section.value,
    get node() {
      return section;
    },
    get entries() {
      section.entries;
    }
  };
}

function _buildEntry(entry) {
  return {
    title: entry.value,
    get node() {
      return entry;
    },
    get description() {
      entry.extract('paragraphs');
    }
  };
}