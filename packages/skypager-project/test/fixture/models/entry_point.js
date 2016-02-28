describe('Entry Point', function(){

})

export function create(options = {}, context = {}) {
  let { asset } = options

  return asset.data || {}
}
