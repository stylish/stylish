describe('Entry', function(entry) {
  entry.documents.have.a.section('routes', function(section){
    section.builder = builders.screens

    section.has.many.articles('childRoutes', function(screen, i) {
      screen.builder = builders.subscreen
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

function validate(options = {}, context = {}) {

}

function decorate(options = {}, context = {}) {
  let { asset } = options
}

const builders = {
  screens: function(section) {
    return {
      childRoutes: []
    }
  },
  subscreen: function(section) {

  }
}

module.exports = {
  create,
  decorate,
  validate
}
