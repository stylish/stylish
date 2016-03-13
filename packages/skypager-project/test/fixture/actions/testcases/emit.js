action("emit")

execute(function(dispatch){
  let f = dispatch + '("testing")'
  eval(f)
})
