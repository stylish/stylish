describe("Log", (log) => {
  log.documents.have.a.section('Entries', (section) => {
    section.builder = _buildSection

    section.has.many('entries', (entry) => {
      entry.builder = _buildEntry
    })
  })
})

create(function(document) {
  return {
    data: document.data,
    description: 'TODO',
    entries: []
  }
})

function _buildSection (section) {
  return {
    title: section.value,
    get node () {
      return section
    },
    get entries() {
      section.entries
    }
  }
}

function _buildEntry (entry) {
  return {
    title: entry.value,
    get node () {
      return entry
    },
    get description() {
      entry.extract('paragraphs')
    }
  }
}
