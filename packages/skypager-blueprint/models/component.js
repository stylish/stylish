describe('Component', function(entry) {

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

module.exports = {
   create
}
