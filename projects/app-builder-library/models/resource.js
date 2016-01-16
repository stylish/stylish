describe("Resource", function(model) {
  var resource = model, resource = model;
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

  return entity
}

module.exports = {
  create: create,
  config: {
    attributes: {
      name: {
        type: 'string',
        sources: ['metadata.name']
      }
    }
  }
}
