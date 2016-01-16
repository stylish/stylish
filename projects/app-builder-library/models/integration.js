describe("Integration", function(model) {
  var integration = model,
      integrations = model;

  integration.documents.have.a.
    section('Basic Options', function(section){
      section.builder = builders.basicOptions
    })

  integration.documents.have.a.
    section('Advanced Options', function(section){
      section.builder = builders.advancedOptions
    })

})

function create (document, options) {
  var entity = Object.assign({}, document.data)

  entity.categories = entity.categories || [];
  entity.platforms = entity.platforms || {};

  entity.title = entity.name ? entity.name : undefined

  if (!entity.title) {
    if (document.headings.titles.first) {
      entity.title = document.headings.titles.first.value
    }
  }

  return entity
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
      },

    }
  }
}

var builders = {
  basicOptions: function(section){
    return {value: section.value}
  },
  advancedOptions: function(section){
    return {value: section.value}
  }
}
