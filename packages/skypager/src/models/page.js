define('Page', (page) => { })

export function create (document, options = {}) {
  return {
    data: document.data,
    parsed: document.parsed,
    sections: document.headings.sections.pluck('value'),
    subsections: document.headings.articles.pluck('value'),
    html: document.html.content
  }
}

export function validate (document, spec, utils) {
  return true
}
