describe('The Skypager Project Bundle', function (){
  let project = require('./fixture')
  let exported = require('./fixture/dist/bundle.js')

  it('contains a single JSON package for the entire project', function(){
    exported.should.be.an.Object()
  })
})

const { keys } = Object
