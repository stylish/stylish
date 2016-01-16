describe("Blueprint", function(model) {
  var blueprint = model, blueprint = model;
})

function create (document, options) {
  var project = document.project,
      entity = Object.assign({}, document.data);

  entity.categories = entity.categories || []
  entity.platforms = entity.platforms || {}

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

      categories: {
        type: 'object',
        sources: ['metadata.categories']
      },

      platforms: {
        type: 'object',
        sources: ['metadata.platforms']
      }
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
