'use strict';

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("Integration", function (model) {
  var integration = model,
      integrations = model;

  integration.documents.have.a.section('Basic Options', function (section) {
    section.builder = builders.basicOptions;
  });

  integration.documents.have.a.section('Advanced Options', function (section) {
    section.builder = builders.advancedOptions;
  });
});

function create(options, context) {
  var document = options.document || options.asset;
  var entity = (0, _assign2.default)({}, document.data);

  entity.categories = entity.categories || [];
  entity.platforms = entity.platforms || {};

  entity.title = entity.name ? entity.name : undefined;

  if (!entity.title) {
    entity.title = document.documentTitle;
  }

  entity.description = entity.description || document.mainCopy;

  return entity;
}

module.exports = {
  create: create,
  config: {
    attributes: {
      name: {
        type: 'string',
        sources: ['metadata.name']
      },
      website: {
        type: 'string',
        sources: ['metadata.website']
      },
      platforms: {
        type: 'object',
        sources: ['metadata.platforms']
      }

    }
  }
};

var builders = {
  basicOptions: function basicOptions(section) {
    return { value: section.value };
  },
  advancedOptions: function advancedOptions(section) {
    return { value: section.value };
  }
};