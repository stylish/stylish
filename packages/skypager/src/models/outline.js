define('Outline', ()=> {
  outline.example(
    h2("Table Of Contents",
       h3("sections")
    )
  )
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
