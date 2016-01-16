action('load asset')

aka('load asset')

params(function () {
  required(function () {
    object('collection_name', 'which collection does the asset belong to?')
    object('asset_id', 'which asset is being loaded')
    object('raw_content', 'which content is being loaded into the asset')
  })
})

execute(function (dispatch) {

})
