action("Random")

params(function(){
  id('id')
})

validate(function(dispatch){
  if(!project.documents.at(dispatch.id)){
    return false
  }
})

execute(function(dispatch){

})
