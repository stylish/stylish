describe("Component", function(model) {
  var component = model, components = model;
})

function create (document, options) {
  var project = document.project,
      entity = Object.assign({}, document.data);

  entity.categories = entity.categories || [];
  entity.platforms = entity.platforms || {};

  if (entity.categories.length === 0 && entity.category) {
    entity.categories.push(entity.category)
  }

  if (!entity.title) {
    if (document.headings.titles.first) {
      entity.title = document.headings.titles.first.value
    }
  }

  entity.htmlSnippets = document.nodes.of.type('code').filter(function(node){
    return node.lang === 'html'
  }).map(function(node){ return node.value })

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
