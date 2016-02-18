define('Outline', (outline)=> {
  /**
   * This is better than what i have currently

  example(
    h1('document.title'),

    paragraphs('document.description'),

    h2("Table Of Contents",
       h3("sections", { builder: sectionsBuilder, multi: true })
    )
  )
  */
  outline.documents.have.a.section('Table Of Contents', (section) => {
    section.has.many.articles('sections', (article) => {

    })
  })
})

export function create ({document}) {
  return {
    data: document.data,
    sections: document.headings.articles.pluck('value'),
    html: document.html.content
  }
}

export function validate (document, spec, utils) {
  return true
}
