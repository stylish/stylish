describe("Epic", function() {  })

create(function (options, context) {
})

module.exports = {
  decorate: function(options, context) {

  },
  create: function(options, context) {
    let document = options.document

    return {
      id: document.id,
      title: document.headings.titles.first && document.headings.titles.first.value,
      description: document.mainCopy
    }

  }
}
