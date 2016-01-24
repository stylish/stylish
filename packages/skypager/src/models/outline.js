define('Outline', () => {

})

export function create (document, options = {}) {
  return {
    data: document.data,
    parsed: document.parsed,
    sections: document.headings.sections.pluck('title'),
    subsections: document.headings.articles('title'),
    html: document.html.content
  }
}

export function validate (document, spec, utils) {
  return true
}
