action("LoadAsset")

params(function(){
  required(function(){
    string("uri", "Any valid URI or Path reference that can be used to access this asset")
    string("raw", "The raw content for the asset")
    string("type", "What type of asset is this", {in:['asset','document','data_source']})
  })
})

execute(function(dispatch, action){

})
