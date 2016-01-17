describe('Repository', function() {  })

exports.create = function(document) {
  return document.data
}

exports.attributes = {
  host: {
    type: 'string'
  }
}
