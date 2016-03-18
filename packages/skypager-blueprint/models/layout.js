describe('Layout', function(layout) {
  layout.documents.have.a.section('Regions', function(section){
    section.builder = builders.region

    section.has.many.articles('childRoutes', function(screen, i) {
      return screen
    })
  })
})

function create(options = {}, { project }) {
  let { asset } = options

  return {
    ...(asset.data),
    title: asset.documentTitle
  }
}

export function create(options = {}, { project }) {
  let { asset } = options

  return {
    ...(asset.data),
    title: asset.documentTitle
  }
}

const builders = {
  regions: function(section) {
    return { }
  }
}

module.exports = {
   create
}
