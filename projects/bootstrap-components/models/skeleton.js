// The name choices here suck but avoiding collission
describe( "Skeleton", (skeleton) => {
  skeleton.documents.have.a.section('Sections', (section) => {
    section.has.many('Landings', (landing) => {
      landing = landingBuilder
    })

    section.builder = sectionsBuilder
  })
})

export const example = `
# Main Title

## Sections

### Subsection Alpha
### Subsection Bravo
### Subsection Charlie
`

const sectionsBuilder = (section) => {
  return {
    title: section.value
  }
}

const landingBuilder = (landing) => {
  return {
    title: landing.value
  }
}

export const builders = {
  sectionsBuilder,
  landingBuilder
}

export function validate (document) {
  //document.headings.titles.length.should.not.equal(0)
  //document.headings.section('Sections').should.be.an.Object()
  //document.headings.section('Sections').descendants.should.not.be.empty()
}

export function create (document) {
  let entity = Object.assign({}, document.data)

  entity.title = document.headings.titles.first.value

  return entity
}
